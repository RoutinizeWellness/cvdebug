"use node";

import { internalAction } from "../_generated/server";
import { v, ConvexError } from "convex/values";
import { createWorker } from "tesseract.js";

const internalAny = require("../_generated/api").internal;

/**
 * Enhanced text cleaning function that preserves structure while removing noise
 */
function cleanExtractedText(text: string): string {
  return text
    // Remove null bytes and replacement characters
    .replace(/\0/g, "")
    .replace(/[\uFFFD\uFFFE\uFFFF]/g, "")
    // Preserve line breaks but normalize them
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    // Remove excessive line breaks (more than 2 consecutive)
    .replace(/\n{3,}/g, "\n\n")
    // Clean up control characters but keep tabs, newlines
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    // Normalize spaces (replace multiple spaces with single space)
    .replace(/ {2,}/g, " ")
    // Remove spaces at start/end of lines
    .split('\n')
    .map(line => line.trim())
    .join('\n')
    // Final trim
    .trim();
}

export const performOcr = internalAction({
  args: {
    resumeId: v.id("resumes"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const startTime = Date.now();
    let retryCount = 0;
    const maxRetries = 2;

    try {
      while (retryCount <= maxRetries) {
        try {
          console.log(`[Server OCR] Starting enhanced Tesseract.js OCR for resume ${args.resumeId} (attempt ${retryCount + 1}/${maxRetries + 1})`);

          // 1. Get the file URL from storage
          const fileUrl = await ctx.storage.getUrl(args.storageId);
          if (!fileUrl) {
            throw new Error("File not found in storage");
          }

          // 2. Fetch the file with extended timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 60000); // Increased to 60s

          try {
            const response = await fetch(fileUrl, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (!response.ok) {
              throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
            }

            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const fileSize = buffer.length;

            console.log(`[Server OCR] File fetched successfully, size: ${(fileSize / 1024).toFixed(2)} KB`);

            // 3. Execute Enhanced Tesseract OCR with multi-language support
            console.log(`[Server OCR] Running enhanced Tesseract.js OCR with multi-language support (eng+spa+fra)`);

            // Multi-language support for better accuracy across different resume formats
            const worker = await createWorker(['eng', 'spa', 'fra'], 1, {
              logger: (m: any) => {
                if (m.status === 'recognizing text') {
                  console.log(`[OCR Progress] ${m.status}: ${Math.round(m.progress * 100)}%`);
                } else if (m.status === 'loading language traineddata') {
                  console.log(`[OCR Progress] Loading language data: ${m.progress.toFixed(2)}%`);
                }
              }
            });

            let extractedText = "";
            let confidence = 0;

            try {
              // Set OCR parameters for better accuracy
              await worker.setParameters({
                preserve_interword_spaces: '1', // Better spacing preservation
              } as any);

              const result = await worker.recognize(buffer);
              extractedText = result.data.text;
              confidence = result.data.confidence || 0;

              console.log(`[Server OCR] Tesseract extracted ${extractedText.length} characters with ${confidence.toFixed(2)}% confidence`);

              // Log low confidence warning
              if (confidence < 60) {
                console.warn(`[Server OCR] Low OCR confidence detected: ${confidence.toFixed(2)}%. Text quality may be poor.`);
              }
            } finally {
              await worker.terminate();
            }

            // 4. Enhanced text cleaning with better preservation
            extractedText = cleanExtractedText(extractedText);

            // Check minimum length threshold
            if (extractedText.length < 100) {
              if (retryCount < maxRetries) {
                console.log(`[Server OCR] Insufficient text extracted (${extractedText.length} chars), retrying...`);
                retryCount++;
                continue;
              }
              throw new ConvexError("COMPLEX_FORMAT_DETECTED");
            }

            const processingTime = Date.now() - startTime;
            console.log(
              `[Server OCR] Successfully extracted ${extractedText.length} characters in ${processingTime}ms with ${confidence.toFixed(2)}% confidence`
            );

            await ctx.runMutation(internalAny.resumes.updateResumeOcr, {
              id: args.resumeId,
              ocrText: extractedText,
              forceAccept: true,
            });

            return {
              success: true,
              textLength: extractedText.length,
              processingTime,
              confidence: confidence.toFixed(2),
              method: "enhanced_tesseract_ocr",
              retryCount
            };

          } catch (fetchError: any) {
            clearTimeout(timeoutId);

            if (fetchError.name === 'AbortError') {
              if (retryCount < maxRetries) {
                console.log(`[Server OCR] Fetch timeout, retrying... (${retryCount + 1}/${maxRetries})`);
                retryCount++;
                continue;
              }
              throw new Error("File fetch timeout after 60 seconds");
            }
            throw fetchError;
          }

        } catch (error: any) {
          // If it's a retryable error and we haven't exhausted retries, continue loop
          if (retryCount < maxRetries && !isNonRetryableError(error)) {
            console.log(`[Server OCR] Error occurred, retrying... (${retryCount + 1}/${maxRetries})`);
            retryCount++;
            continue;
          }

          // If we've exhausted retries or it's a non-retryable error, throw
          throw error;
        }
      }

      // This should never be reached due to the throw above, but TypeScript needs it
      throw new Error("OCR processing failed after all retries");

    } catch (error: any) {
      const processingTime = Date.now() - startTime;
      console.error(`[Server OCR] Critical error after ${processingTime}ms (${retryCount} retries):`, error);

    const isComplexFormat =
      error instanceof ConvexError &&
      error.message === "COMPLEX_FORMAT_DETECTED";

    let userMessage =
      "An unexpected error occurred during server-side processing.";

    if (error.message.includes("timeout")) {
      userMessage =
        "Server processing timed out after multiple attempts. This file may be too large or complex. Try compressing the PDF or converting to DOCX format.";
    } else if (error.message.includes("not found")) {
      userMessage = "File could not be accessed. Please try uploading again.";
    } else if (error.message.includes("fetch")) {
      userMessage =
        "Network error while processing file. Please check your connection and try again.";
    } else if (isComplexFormat) {
      userMessage =
        "We detected complex, image-heavy layers that Deep OCR could not fully recover even after multiple attempts. Try: 1) Print to PDF to flatten layers, 2) Convert to Word format, or 3) Use a simpler PDF template.";
    }

    userMessage += "\n\nIf this issue persists, please contact support with the following details:\n";
    userMessage += `- Error: ${error.message}\n`;
    userMessage += `- Resume ID: ${args.resumeId}\n`;
    userMessage += `- Processing time: ${processingTime}ms\n`;
    userMessage += `- Retry attempts: ${retryCount}`;

    await ctx.runMutation(internalAny.resumes.updateResumeMetadata, {
      id: args.resumeId,
      title: "Resume",
      category: isComplexFormat ? "Complex Format" : "System Error",
      analysis: userMessage,
      score: 0,
      status: "failed",
    });

      return {
        success: false,
        error: error.message,
        processingTime,
        critical: true,
        retryCount
      };
    }
  },
});

/**
 * Determines if an error is retryable or should fail immediately
 */
function isNonRetryableError(error: any): boolean {
  const message = error.message || "";
  return (
    message.includes("not found") ||
    message.includes("INVALID") ||
    message.includes("FORBIDDEN") ||
    error instanceof ConvexError
  );
}
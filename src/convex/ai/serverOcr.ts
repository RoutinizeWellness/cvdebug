"use node";

import { internalAction } from "../_generated/server";
import { v } from "convex/values";
import Tesseract, { createWorker } from "tesseract.js";

// Use require to avoid deep type instantiation issues
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

export const processWithServerOcr = internalAction({
  args: {
    resumeId: v.id("resumes"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const startTime = Date.now();
    
    try {
      console.log(`[Server OCR] Starting Tesseract.js OCR for resume ${args.resumeId}`);
      
      // Get the file from storage
      const fileUrl = await ctx.storage.getUrl(args.storageId);
      if (!fileUrl) {
        throw new Error("File not found in storage");
      }

      // Fetch the file with extended timeout
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

        // Determine content type from response headers or buffer analysis
        const contentType = response.headers.get('content-type') || "unknown";

        let extractedText = "";
        let confidence = 0;
        let method = "utf8_extraction";

        // Use Enhanced Tesseract.js for OCR on images and image-based PDFs
        if (contentType.includes("image") || contentType.includes("pdf")) {
          console.log(`[Server OCR] Running enhanced Tesseract.js OCR on ${contentType} with multi-language support`);

          try {
            // Multi-language support for better accuracy
            const worker = await createWorker(['eng', 'spa', 'fra'], 1, {
              logger: (m: any) => {
                if (m.status === 'recognizing text') {
                  console.log(`[OCR Progress] ${m.status}: ${Math.round(m.progress * 100)}%`);
                } else if (m.status === 'loading language traineddata') {
                  console.log(`[OCR Progress] Loading language data: ${m.progress.toFixed(2)}%`);
                }
              }
            });

            try {
              // Set OCR parameters for better accuracy
              await worker.setParameters({
                preserve_interword_spaces: '1', // Better spacing preservation
              } as any);

              const result = await worker.recognize(buffer);
              extractedText = result.data.text;
              confidence = result.data.confidence || 0;
              method = "enhanced_tesseract_ocr";

              console.log(`[Server OCR] Tesseract extracted ${extractedText.length} characters with ${confidence.toFixed(2)}% confidence`);

              // Log low confidence warning
              if (confidence < 60) {
                console.warn(`[Server OCR] Low OCR confidence detected: ${confidence.toFixed(2)}%. Text quality may be poor.`);
              }
            } finally {
              await worker.terminate();
            }

          } catch (ocrError: any) {
            console.error("[Server OCR] Enhanced Tesseract failed, trying UTF-8 extraction:", ocrError.message);
            // Fallback to UTF-8 extraction
            extractedText = buffer.toString('utf-8');
            method = "utf8_fallback";
          }
        } else {
          // Try UTF-8 extraction for non-image files
          extractedText = buffer.toString('utf-8');
        }

        // Clean up the text with enhanced cleaning
        try {
          extractedText = cleanExtractedText(extractedText);

          if (extractedText.length < 50) {
            throw new Error(`Insufficient text extracted (${extractedText.length} chars)`);
          }

          const processingTime = Date.now() - startTime;
          console.log(`[Server OCR] Successfully extracted ${extractedText.length} characters in ${processingTime}ms using ${method}`);

          // Update the resume with OCR text
          await ctx.runMutation(internalAny.resumes.updateResumeOcr, {
            id: args.resumeId,
            ocrText: extractedText,
          });

          return {
            success: true,
            textLength: extractedText.length,
            processingTime,
            confidence: confidence > 0 ? confidence.toFixed(2) : undefined,
            method
          };
          
        } catch (extractionError: any) {
          console.error("[Server OCR] Text extraction failed:", extractionError.message);
          
          // Provide detailed error reporting based on file type
          let errorMessage = "Server-side OCR failed. ";
          let suggestions: string[] = [];

          if (contentType.includes("pdf")) {
            errorMessage += "This PDF format is not supported for text extraction.";
            suggestions = [
              "1. Open your PDF in Adobe Acrobat or a PDF editor",
              "2. Use 'Print to PDF' or 'Save As PDF' to create a new version",
              "3. Ensure the PDF contains selectable text (not scanned images)",
              "4. Try converting to Word (.docx) format first",
              "5. If it's a LaTeX PDF, re-export using a different PDF engine"
            ];
          } else if (contentType.includes("image")) {
            errorMessage += "Image OCR processing is not yet available on the server.";
            suggestions = [
              "1. Ensure the image is clear and high-resolution",
              "2. Try converting the image to a PDF first",
              "3. Use a document scanner app to create a proper PDF",
              "4. Consider typing your resume in Word instead"
            ];
          } else {
            errorMessage += "This file format may not be supported.";
            suggestions = [
              "1. Save your resume as a standard PDF",
              "2. Try using Word (.docx) format",
              "3. Ensure the file is not corrupted",
              "4. Contact support at cvdebug@outlook.com if the issue persists"
            ];
          }

          const fullErrorMessage = `${errorMessage}\n\nTroubleshooting steps:\n${suggestions.join('\n')}`;
          
          // Mark as failed with detailed guidance
          await ctx.runMutation(internalAny.resumes.updateResumeMetadata, {
            id: args.resumeId,
            title: "Resume",
            category: "Processing Error",
            analysis: fullErrorMessage,
            score: 0,
            status: "failed",
          });
          
          return { 
            success: false, 
            error: extractionError.message,
            contentType,
            fileSize,
            suggestions
          };
        }
        
      } catch (fetchError: any) {
        clearTimeout(timeoutId);

        if (fetchError.name === 'AbortError') {
          throw new Error("File fetch timeout after 60 seconds");
        }
        throw fetchError;
      }
      
    } catch (error: any) {
      const processingTime = Date.now() - startTime;
      console.error(`[Server OCR] Critical error after ${processingTime}ms:`, error);
      
      // Determine error type for better user guidance
      let userMessage = "An unexpected error occurred during server-side processing.";
      
      if (error.message.includes("timeout")) {
        userMessage = "Server processing timed out. This file may be too large or complex.";
      } else if (error.message.includes("not found")) {
        userMessage = "File could not be accessed. Please try uploading again.";
      } else if (error.message.includes("fetch")) {
        userMessage = "Network error while processing file. Please check your connection and try again.";
      }
      
      userMessage += "\n\nIf this issue persists, please contact support at cvdebug@outlook.com with the following details:\n";
      userMessage += `- Error: ${error.message}\n`;
      userMessage += `- Resume ID: ${args.resumeId}\n`;
      userMessage += `- Processing time: ${processingTime}ms`;
      
      await ctx.runMutation(internalAny.resumes.updateResumeMetadata, {
        id: args.resumeId,
        title: "Resume",
        category: "System Error",
        analysis: userMessage,
        score: 0,
        status: "failed",
      });
      
      return { 
        success: false, 
        error: error.message,
        processingTime,
        critical: true
      };
    }
  },
});
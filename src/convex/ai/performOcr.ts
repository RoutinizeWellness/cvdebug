"use node";

import { internalAction } from "../_generated/server";
import { v } from "convex/values";
import { createWorker } from "tesseract.js";

const internalAny = require("../_generated/api").internal;

export const performOcr = internalAction({
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

      // Fetch the file with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000);

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

        const contentType = response.headers.get('content-type') || "unknown";

        let extractedText = "";
        
        // Use Tesseract.js for OCR on images and image-based PDFs
        if (contentType.includes("image") || contentType.includes("pdf")) {
          console.log(`[Server OCR] Running Tesseract.js OCR on ${contentType}`);
          
          try {
            const worker = await createWorker('eng');
            
            try {
              const { data: { text } } = await worker.recognize(buffer);
              extractedText = text;
              console.log(`[Server OCR] Tesseract extracted ${extractedText.length} characters`);
            } finally {
              await worker.terminate();
            }
            
          } catch (ocrError: any) {
            console.error("[Server OCR] Tesseract failed, trying UTF-8 extraction:", ocrError.message);
            extractedText = buffer.toString('utf-8');
          }
        } else {
          extractedText = buffer.toString('utf-8');
        }
        
        // Clean up the text
        extractedText = extractedText
          .replace(/\0/g, '')
          .replace(/[\uFFFD\uFFFE\uFFFF]/g, '')
          .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        
        if (extractedText.length < 50) {
          throw new Error(`Insufficient text extracted (${extractedText.length} chars)`);
        }
        
        const processingTime = Date.now() - startTime;
        console.log(`[Server OCR] Successfully extracted ${extractedText.length} characters in ${processingTime}ms`);
        
        // Update the resume with OCR text
        await ctx.runMutation(internalAny.resumes.updateResumeOcr, {
          id: args.resumeId,
          ocrText: extractedText,
        });
        
        return { 
          success: true, 
          textLength: extractedText.length,
          processingTime,
          method: "tesseract_ocr"
        };
        
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        
        if (fetchError.name === 'AbortError') {
          throw new Error("File fetch timeout after 45 seconds");
        }
        throw fetchError;
      }
      
    } catch (error: any) {
      const processingTime = Date.now() - startTime;
      console.error(`[Server OCR] Critical error after ${processingTime}ms:`, error);
      
      let userMessage = "An unexpected error occurred during server-side processing.";
      
      if (error.message.includes("timeout")) {
        userMessage = "Server processing timed out. This file may be too large or complex.";
      } else if (error.message.includes("not found")) {
        userMessage = "File could not be accessed. Please try uploading again.";
      } else if (error.message.includes("fetch")) {
        userMessage = "Network error while processing file. Please check your connection and try again.";
      }
      
      userMessage += "\n\nIf this issue persists, please contact support with the following details:\n";
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

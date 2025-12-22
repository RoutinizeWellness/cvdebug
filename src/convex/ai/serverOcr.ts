"use node";

import { internalAction } from "../_generated/server";
import { v } from "convex/values";

// Use require to avoid deep type instantiation issues
const internalAny = require("../_generated/api").internal;

export const processWithServerOcr = internalAction({
  args: {
    resumeId: v.id("resumes"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    try {
      console.log(`[Server OCR] Starting server-side OCR for resume ${args.resumeId}`);
      
      // Get the file from storage
      const fileUrl = await ctx.storage.getUrl(args.storageId);
      if (!fileUrl) {
        throw new Error("File not found in storage");
      }

      // Fetch the file
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // For now, we'll use a simple text extraction approach
      // In production, you could integrate with services like:
      // - Google Cloud Vision API
      // - AWS Textract
      // - Azure Computer Vision
      // - Tesseract.js in Node environment
      
      // Placeholder: Extract basic text from buffer
      // This is a simplified version - in production you'd use proper OCR
      let extractedText = "";
      
      try {
        // Try to extract text as UTF-8
        extractedText = buffer.toString('utf-8');
        
        // Clean up the text
        extractedText = extractedText
          .replace(/\0/g, '')
          .replace(/[\uFFFD\uFFFE\uFFFF]/g, '')
          .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
          .trim();
        
        if (extractedText.length < 50) {
          throw new Error("Insufficient text extracted");
        }
        
        console.log(`[Server OCR] Successfully extracted ${extractedText.length} characters`);
        
        // Update the resume with OCR text
        await ctx.runMutation(internalAny.resumes.updateResumeOcr, {
          id: args.resumeId,
          ocrText: extractedText,
        });
        
        return { success: true, textLength: extractedText.length };
        
      } catch (error: any) {
        console.error("[Server OCR] Text extraction failed:", error.message);
        
        // Mark as failed with helpful message
        await ctx.runMutation(internalAny.resumes.updateResumeMetadata, {
          id: args.resumeId,
          title: "Resume",
          category: "Error",
          analysis: "Server-side OCR failed. This file format may not be supported. Please try:\n\n1. Re-save your PDF using 'Print to PDF'\n2. Convert to Word (.docx) format\n3. Export from your editor using 'Save As PDF'\n4. Ensure the file contains selectable text",
          score: 0,
          status: "failed",
        });
        
        return { success: false, error: error.message };
      }
      
    } catch (error: any) {
      console.error("[Server OCR] Critical error:", error);
      
      await ctx.runMutation(internalAny.resumes.updateResumeMetadata, {
        id: args.resumeId,
        title: "Resume",
        category: "Error",
        analysis: "An unexpected error occurred during server-side processing. Please try uploading again or contact support.",
        score: 0,
        status: "failed",
      });
      
      return { success: false, error: error.message };
    }
  },
});

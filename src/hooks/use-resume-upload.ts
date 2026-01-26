import React, { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { createWorker } from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";
import { api } from "@/convex/_generated/api";

// Cast to any to avoid deep type instantiation errors
const apiAny = api as any;

export type TargetMarket = "USA" | "UK" | "DACH" | "EU" | "LATAM" | "APAC";

export function useResumeUpload(jobDescription: string, setJobDescription: (val: string) => void) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [processingResumeId, setProcessingResumeId] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<TargetMarket>("USA");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const generateUploadUrl = useMutation(apiAny.resumes.generateUploadUrl);
  const createResume = useMutation(apiAny.resumes.createResume);
  const updateResumeOcr = useMutation(apiAny.resumes.updateResumeOcr);
  const deleteResume = useMutation(apiAny.resumes.deleteResume);
  const triggerServerOcr = useMutation(apiAny.resumes.triggerServerOcr);

  const cancelUpload = async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    if (processingResumeId) {
      try {
        await deleteResume({ id: processingResumeId as any });
      } catch (e) {
        console.error("Failed to cleanup resume on cancel", e);
      }
    }
    
    setIsUploading(false);
    setProcessingResumeId(null);
    setProcessingStatus("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.info("Upload cancelled");
  };

  const handleFile = async (file: File) => {
    if (!file) return;

    // Reset abort controller
    abortControllerRef.current = new AbortController();

    // FILE SIZE VALIDATION (5MB limit)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File too large (Max 5MB). Try compressing your PDF or removing images.");
      return;
    }

    // FILE TYPE VALIDATION with specific error messages
    const validTypes = [
      "image/jpeg", 
      "image/png", 
      "image/webp", 
      "application/pdf", 
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!validTypes.includes(file.type)) {
      // Check file extension as fallback (some browsers report incorrect MIME types)
      const fileName = file.name.toLowerCase();
      if (fileName.endsWith('.pdf') || fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
        console.warn(`[Upload] MIME type mismatch: ${file.type} for ${file.name}, proceeding based on extension`);
      } else {
        toast.error("File type not supported. Please upload PDF, DOCX, or image files only.");
        return;
      }
    }

    if (jobDescription.trim()) {
      toast.info("🎯 Analyzing resume with your job description for tailored scoring...");
    } else {
      toast.info("📄 Analyzing resume with general industry standards...");
    }

    setIsUploading(true);
    setProcessingStatus("Uploading your resume...");
    
    let resumeId = null;
    let storageId = null;

    try {
      // NETWORK TIMEOUT PROTECTION
      const uploadTimeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("UPLOAD_TIMEOUT")), 30000)
      );

      const uploadPromise = generateUploadUrl().then(async (postUrl) => {
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": file.type || "application/octet-stream" },
          body: file,
          signal: abortControllerRef.current?.signal,
        });
        
        if (!result.ok) {
          const errorText = await result.text().catch(() => "Unknown error");
          throw new Error(`UPLOAD_FAILED: ${result.status} - ${errorText}`);
        }
        
        return result.json();
      });

      const uploadResult = await Promise.race([uploadPromise, uploadTimeout]) as any;

      console.log("[Upload] Upload result received:", uploadResult);

      storageId = uploadResult.storageId;

      // CRITICAL: Validate all required fields before proceeding
      if (!storageId || typeof storageId !== 'string' || storageId.length === 0) {
        console.error("[Upload] ❌ Invalid storageId received:", uploadResult);
        throw new Error("UPLOAD_FAILED: Invalid storage ID received from server");
      }

      if (!file || !file.name) {
        console.error("[Upload] ❌ Invalid file object:", file);
        throw new Error("UPLOAD_FAILED: Invalid file object");
      }

      const fileName = file.name.trim();
      const mimeType = file.type || "application/octet-stream";

      // Final validation before createResume
      if (!fileName || fileName.length === 0) {
        console.error("[Upload] ❌ Empty filename");
        throw new Error("UPLOAD_FAILED: File must have a name");
      }

      console.log("[Upload] ✅ Validation passed. Creating resume with:", {
        storageId,
        title: fileName,
        mimeType,
        hasJobDescription: !!jobDescription.trim(),
        fileSize: file.size,
        fileType: file.type
      });

      const trimmedJobDesc = jobDescription.trim();

      console.log("[Upload] 🚀 About to call createResume with:", {
        storageId_raw: storageId,
        storageId_type: typeof storageId,
        storageId_length: storageId?.length,
        title: fileName,
        mimeType: mimeType,
        hasJobDescription: !!trimmedJobDesc
      });

      // Call mutation directly - Convex will handle type validation
      try {
        resumeId = await createResume({
          storageId: storageId,
          title: fileName,
          mimeType: mimeType,
          ...(trimmedJobDesc && { jobDescription: trimmedJobDesc }),
        });
        console.log("[Upload] ✅ createResume succeeded, resumeId:", resumeId);
      } catch (createError: any) {
        console.error("[Upload] ❌ createResume failed with error:", createError);
        console.error("[Upload] ❌ Error message:", createError?.message);
        console.error("[Upload] ❌ Error code:", createError?.code);
        console.error("[Upload] ❌ Error data:", createError?.data);
        throw createError;
      }

      setProcessingResumeId(resumeId);
      setProcessingStatus("Analyzing file structure...");

      toast.success(jobDescription.trim() 
        ? "Resume uploaded! AI is analyzing against your job description..." 
        : "Resume uploaded! AI is analyzing..."
      );
      
      // Try fast client-side processing first with 90s timeout
      const processingPromise = processFile(file, resumeId, storageId);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("CLIENT_TIMEOUT")), 90000)
      );

      try {
        await Promise.race([processingPromise, timeoutPromise]);
      } catch (processingError: any) {
        // If client-side fails or times out, trigger server-side OCR
        if (processingError.message === "CLIENT_TIMEOUT" || 
            processingError.message.includes("Could not extract text") ||
            processingError.message.includes("OCR")) {
          
          console.log("[Client] Client processing failed/timed out, triggering server OCR");
          toast.info("⚙️ Switching to deep scan mode...");
          
          await triggerServerOcr({ resumeId, storageId });
          toast.success("Deep scan initiated. This may take a moment...");
          setJobDescription("");
          return; // Don't cleanup, let server handle it
        }
        throw processingError;
      }
      
      setJobDescription("");

    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log("Upload cancelled by user");
        return; // Already handled in cancelUpload
      }
      
      console.error("[Upload Error]", error);
      
      // SPECIFIC ERROR MESSAGES based on error type
      if (error.message === "UPLOAD_TIMEOUT") {
        toast.error("Upload timed out. Check your internet connection and try again.");
      } else if (error.message.startsWith("UPLOAD_FAILED")) {
        toast.error("Upload failed. The file may be corrupted or your connection interrupted. Try again.");
      } else if (error.message === "CLIENT_TIMEOUT" || 
          error.message.includes("Could not extract text") ||
          error.message.includes("OCR")) {
        
        console.log("[Client] Client-side processing failed, triggering server-side OCR fallback");
        toast.info("⚙️ Client processing timed out. Trying server-side extraction...");
        
        try {
          if (resumeId && storageId) {
            await triggerServerOcr({ resumeId, storageId });
            toast.success("Server-side processing initiated. This may take a moment...");
            setJobDescription("");
            return; // Don't cleanup, let server handle it
          }
        } catch (serverError: any) {
          console.error("[Client] Server OCR trigger failed:", serverError);
          toast.error("Processing failed. Try: 1) Re-saving as PDF using 'Print to PDF', 2) Converting to .docx, or 3) Ensuring text is selectable (not scanned images).");
        }
      } else if (error?.message?.includes("COMPLEX_FORMAT_DETECTED")) {
        setProcessingStatus(
          "Your PDF has complex layers. Applying Deep OCR... (please wait ~15s)"
        );
        toast.info(
          "Your PDF has complex layers. Applying Deep OCR... (please wait 15s)"
        );
        return;
      } else if (error.message.includes("CREDITS_EXHAUSTED")) {
        toast.error("No credits remaining. Upgrade to continue scanning resumes.");
      } else {
        const errorMsg = error instanceof Error ? error.message : String(error);
        
        // Enhanced error messaging with actionable help
        if (errorMsg.includes('timeout') || errorMsg.includes('network')) {
          toast.error(
            "Upload timed out. Your file might have complex layers.",
            {
              description: "Try: 1) 'Print to PDF' to flatten it, or 2) Use our Deep OCR (longer wait, 100% success)",
              duration: 8000,
            }
          );
        } else if (errorMsg.includes('size') || errorMsg.includes('large')) {
          toast.error(
            "File too large (max 5MB).",
            {
              description: "Compress your PDF or use 'Print to PDF' with lower quality settings",
              duration: 6000,
            }
          );
        } else if (errorMsg.includes('type') || errorMsg.includes('format')) {
          toast.error(
            "Unsupported file type.",
            {
              description: "We accept: PDF, DOCX, DOC, PNG, JPG. Try converting your file.",
              duration: 6000,
            }
          );
        } else if (errorMsg.includes('text') || errorMsg.includes('ocr')) {
          toast.error(
            "Could not extract text from your file.",
            {
              description: "Your PDF might have complex layers. Try: 1) 'Print to PDF' to flatten it, 2) Convert to .docx, or 3) Click 'Deep OCR' for advanced scanning",
              duration: 10000,
            }
          );
        } else if (errorMsg.includes('credit')) {
          toast.error(
            "No scans remaining.",
            {
              description: "Upgrade to Single Scan (€4.99) or Interview Sprint (€24.99) for unlimited scans",
              duration: 6000,
            }
          );
        } else {
          toast.error(
            "Processing failed.",
            {
              description: "Try: 1) Re-saving as PDF using 'Print to PDF', 2) Converting to .docx, or 3) Ensuring text is selectable (not scanned images)",
              duration: 8000,
            }
          );
        }
      }
      
      setProcessingResumeId(null);
      setProcessingStatus("");
      
      if (resumeId) {
        try {
          await deleteResume({ id: resumeId });
        } catch (e) { console.error("Cleanup failed", e); }
      }
    } finally {
      if (!abortControllerRef.current?.signal.aborted) {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    }
  };

  const processFile = async (file: File, resumeId: any, storageId: string) => {
    let worker: any = null;
    let pdf: any = null;

    try {
      let text = "";
      setProcessingStatus("Extracting text from document...");

      if (file.type === "application/pdf") {
        const pdfVersion = pdfjsLib.version || "4.0.379";
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfVersion}/build/pdf.worker.min.mjs`;

        // CRITICAL: Wrap in try-catch to prevent memory crashes
        let arrayBuffer: ArrayBuffer;
        try {
          arrayBuffer = await file.arrayBuffer();
        } catch (memError) {
          console.error("[Upload] ArrayBuffer failed - possible memory issue:", memError);
          throw new Error("PDF too complex for browser. Please try: 1) Compress your PDF, 2) Print to PDF to flatten it, or 3) Convert to DOCX");
        }

        try {
          const loadingTask = pdfjsLib.getDocument({
            data: arrayBuffer,
            useSystemFonts: true,
            standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfVersion}/standard_fonts/`,
            disableFontFace: true, // Reduce memory usage
            isEvalSupported: false, // Security + performance
          });

          // Add timeout to PDF loading
          const loadTimeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("PDF_LOAD_TIMEOUT")), 15000)
          );

          pdf = await Promise.race([loadingTask.promise, loadTimeout]);
          
          const maxPages = Math.min(pdf.numPages, 15);
          
          for (let i = 1; i <= maxPages; i++) {
            if (abortControllerRef.current?.signal.aborted) throw new Error("Aborted");
            
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            
            const pageText = content.items
              .map((item: any) => {
                const str = item.str || "";
                const hasEOL = item.hasEOL;
                return hasEOL ? str + "\n" : str + " ";
              })
              .join("");
            
            text += pageText + "\n";
          }
          
          if (text.trim().length < 20) {
            console.log("PDF text extraction yielded minimal text, attempting enhanced OCR fallback...");
            toast.info("PDF format not standard, using enhanced OCR for text extraction...");
            setProcessingStatus("Running enhanced OCR on image-based PDF...");

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            if (!context) {
              throw new Error("Canvas context creation failed. Your browser may be out of memory.");
            }

            let ocrText = "";

            // Multi-language support for better accuracy
            try {
              worker = await createWorker(['eng', 'spa', 'fra']);
            } catch (workerError) {
              console.error("[Upload] Tesseract worker creation failed:", workerError);
              throw new Error("OCR initialization failed. Please try: 1) Refreshing the page, 2) Compressing your PDF, or 3) Converting to DOCX");
            }

            try {
              // Set OCR parameters for better accuracy
              await worker.setParameters({
                preserve_interword_spaces: '1', // Better spacing preservation
              } as any);

              for (let i = 1; i <= Math.min(pdf.numPages, 3); i++) { // Reduced from 5 to 3 pages
                if (abortControllerRef.current?.signal.aborted) throw new Error("Aborted");

                setProcessingStatus(`Scanning page ${i} of ${Math.min(pdf.numPages, 5)} with enhanced OCR...`);

                const page = await pdf.getPage(i);
                // Higher scale for better OCR accuracy
                const viewport = page.getViewport({ scale: 2.5 });
                canvas.width = viewport.width;
                canvas.height = viewport.height;

                await page.render({
                  canvasContext: context!,
                  viewport: viewport
                }).promise;

                const blob = await new Promise<Blob | null>((resolve) => {
                  canvas.toBlob((b) => resolve(b), 'image/png');
                });

                if (blob) {
                  const imageUrl = URL.createObjectURL(blob);
                  try {
                    const result = await worker.recognize(imageUrl);
                    const pageText = result.data.text;
                    const confidence = result.data.confidence || 0;

                    console.log(`[Client OCR] Page ${i} extracted with ${confidence.toFixed(2)}% confidence`);

                    if (confidence < 60) {
                      console.warn(`[Client OCR] Low confidence on page ${i}: ${confidence.toFixed(2)}%`);
                    }

                    ocrText += pageText + "\n";
                  } catch (ocrError) {
                    console.error(`Enhanced OCR failed for PDF page ${i}:`, ocrError);
                  } finally {
                    URL.revokeObjectURL(imageUrl);
                  }
                }
              }
            } finally {
              await worker.terminate();
            }

            text = ocrText;
            
            if (!text.trim()) {
              throw new Error("Could not extract text from this PDF. Please try: 1) Re-saving as a new PDF from Word, 2) Using 'Save As PDF' instead of 'Export', or 3) Uploading as a .docx file instead.");
            }
          }
        } catch (pdfError: any) {
          if (pdfError.message === "Aborted") throw pdfError;
          
          console.error("PDF parsing failed:", pdfError);
          toast.info("PDF format not recognized, attempting enhanced OCR extraction...");
          setProcessingStatus("PDF parsing failed, attempting enhanced OCR...");

          try {
            // Multi-language support for better accuracy
            if (!worker) {
              worker = await createWorker(['eng', 'spa', 'fra']);
            }
            const imageUrl = URL.createObjectURL(file);
            try {
              // Set OCR parameters for better accuracy
              await worker.setParameters({
                preserve_interword_spaces: '1', // Better spacing preservation
              } as any);

              const result = await worker.recognize(imageUrl);
              text = result.data.text;
              const confidence = result.data.confidence || 0;

              console.log(`[Client OCR] PDF extracted with ${confidence.toFixed(2)}% confidence`);

              if (confidence < 60) {
                console.warn(`[Client OCR] Low confidence: ${confidence.toFixed(2)}%`);
              }

              if (!text.trim()) {
                throw new Error("OCR produced no text");
              }
            } finally {
              URL.revokeObjectURL(imageUrl);
              await worker.terminate();
            }
          } catch (ocrError) {
            console.error("Enhanced OCR fallback also failed:", ocrError);
            // Add OCR prefix to trigger server fallback
            throw new Error("OCR: Could not read text from this file. Please try: 1) Re-saving as a new PDF using 'Print to PDF', 2) Converting to Word (.docx) format, or 3) Ensuring the file contains selectable text (not just images).");
          }
        }
      } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        setProcessingStatus("Reading Word document...");
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } else {
        try {
          setProcessingStatus("Scanning image with enhanced OCR...");
          // Multi-language support for better accuracy
          if (!worker) {
            worker = await createWorker(['eng', 'spa', 'fra']);
          }
          const imageUrl = URL.createObjectURL(file);
          try {
            // Set OCR parameters for better accuracy
            await worker.setParameters({
              tessedit_pageseg_mode: '1', // Automatic page segmentation with OSD
              preserve_interword_spaces: '1', // Better spacing preservation
            });

            const result = await worker.recognize(imageUrl);
            text = result.data.text;
            const confidence = result.data.confidence || 0;

            console.log(`[Client OCR] Image extracted with ${confidence.toFixed(2)}% confidence`);

            if (confidence < 60) {
              console.warn(`[Client OCR] Low confidence: ${confidence.toFixed(2)}%`);
              toast.info(`Image quality may be low (${confidence.toFixed(0)}% confidence). Consider using a higher resolution scan.`);
            }
          } catch (ocrError: any) {
            console.error("Inner OCR Error:", ocrError);
            const errorStr = ocrError?.message || String(ocrError);
            // Prefix with OCR to trigger server-side fallback
            if (errorStr.includes("attempting to read image")) {
              throw new Error("OCR: The image file appears to be corrupted or in an unsupported format.");
            }
            throw new Error(`OCR: Could not read text from this image. ${errorStr}`);
          } finally {
            URL.revokeObjectURL(imageUrl);
            // Worker will be cleaned up in the outer finally block
          }
        } catch (ocrError: any) {
          console.error("Enhanced image OCR processing failed:", ocrError);
          // If it's already our formatted error, rethrow it to preserve the "OCR:" prefix
          if (ocrError.message && ocrError.message.startsWith("OCR:")) {
            throw ocrError;
          }
          throw new Error(`OCR: Failed to process image. ${ocrError.message || String(ocrError)}`);
        }
      }

      if (!text.trim()) {
        throw new Error("OCR: No readable text found. Please ensure your file contains selectable text (not just images) or try uploading as .docx format.");
      }

      // Enhanced text cleaning function
      const cleanText = text
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

      console.log("DEBUG: Extracted text length:", cleanText.length);
      console.log("DEBUG: First 100 chars:", cleanText.substring(0, 100));

      if (cleanText.length < 10) {
        throw new Error(`OCR: Extracted text is too short (${cleanText.length} chars). Your file may be corrupted or contain only images. Try re-saving as PDF or uploading as .docx.`);
      }

      setProcessingStatus("Finalizing analysis...");
      await updateResumeOcr({ id: resumeId, ocrText: cleanText });

      toast.success("✅ Text extracted successfully! AI analysis in progress...");

    } catch (error: any) {
      console.error("[processFile] Error:", error);

      // Enhanced error messages
      if (error.message === "Aborted") {
        throw error;
      } else if (error.message === "PDF_LOAD_TIMEOUT") {
        throw new Error("PDF loading timed out. Please try: 1) Print to PDF to flatten it, 2) Compress the PDF, or 3) Convert to DOCX");
      } else if (error.message?.includes("Canvas context")) {
        throw new Error("Browser out of memory. Please try: 1) Close other tabs, 2) Compress your PDF, or 3) Use a smaller file");
      } else if (error.message?.includes("OCR initialization")) {
        throw error; // Already has good message
      }

      throw error;
    } finally {
      // CRITICAL: Always cleanup workers and resources
      if (worker) {
        try {
          await worker.terminate();
          console.log("[Cleanup] Tesseract worker terminated");
        } catch (e) {
          console.error("[Cleanup] Failed to terminate worker:", e);
        }
      }

      if (pdf) {
        try {
          await pdf.destroy();
          console.log("[Cleanup] PDF document destroyed");
        } catch (e) {
          console.error("[Cleanup] Failed to destroy PDF:", e);
        }
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  return {
    isUploading,
    isDragging,
    processingResumeId,
    setProcessingResumeId,
    processingStatus,
    selectedRegion,
    setSelectedRegion,
    fileInputRef,
    handleFile,
    handleFileUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    cancelUpload
  };
}
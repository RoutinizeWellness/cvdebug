import React, { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { createWorker } from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";
import { api } from "@/convex/_generated/api";

// Cast to any to avoid deep type instantiation errors
const apiAny = api as any;

export function useResumeUpload(jobDescription: string, setJobDescription: (val: string) => void) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [processingResumeId, setProcessingResumeId] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<string>("");
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

    const validTypes = [
      "image/jpeg", 
      "image/png", 
      "image/webp", 
      "application/pdf", 
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!validTypes.includes(file.type)) {
      toast.error("Please upload an image (JPG/PNG), PDF, or Word (.docx) file.");
      return;
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
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
        signal: abortControllerRef.current.signal,
      });
      
      if (!result.ok) throw new Error("Upload failed");
      
      const uploadResult = await result.json();
      storageId = uploadResult.storageId;

      resumeId = await createResume({
        storageId,
        title: file.name,
        mimeType: file.type,
        jobDescription: jobDescription.trim() || undefined,
      });

      setProcessingResumeId(resumeId);
      setProcessingStatus("Analyzing file structure...");

      toast.success(jobDescription.trim() 
        ? "Resume uploaded! AI is analyzing against your job description..." 
        : "Resume uploaded! AI is analyzing..."
      );
      
      // Try fast client-side processing first with 60s timeout
      const processingPromise = processFile(file, resumeId, storageId);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("CLIENT_TIMEOUT")), 60000)
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
      
      console.error(error);
      
      // Check if this is a timeout or processing failure that should trigger server-side OCR
      if (error.message === "CLIENT_TIMEOUT" || 
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
          toast.error("Both client and server processing failed. Please try a different file format.");
        }
      } else {
        const errorMsg = error instanceof Error ? error.message : String(error);
        toast.error(`Failed to upload resume: ${errorMsg}`);
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
    try {
      let text = "";
      setProcessingStatus("Extracting text from document...");

      if (file.type === "application/pdf") {
        const pdfVersion = pdfjsLib.version || "4.0.379"; 
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfVersion}/build/pdf.worker.min.mjs`;
        
        const arrayBuffer = await file.arrayBuffer();
        
        try {
          const loadingTask = pdfjsLib.getDocument({ 
            data: arrayBuffer,
            useSystemFonts: true,
            standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfVersion}/standard_fonts/`,
          });
          
          const pdf = await loadingTask.promise;
          
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
            console.log("PDF text extraction yielded minimal text, attempting OCR fallback...");
            toast.info("PDF format not standard, using OCR for text extraction...");
            setProcessingStatus("Running OCR on image-based PDF...");
            
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            let ocrText = "";

            const worker = await createWorker("eng");
            
            try {
              for (let i = 1; i <= Math.min(pdf.numPages, 5); i++) {
                if (abortControllerRef.current?.signal.aborted) throw new Error("Aborted");
                
                setProcessingStatus(`Scanning page ${i} of ${Math.min(pdf.numPages, 5)}...`);
                
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 2.0 });
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
                    const ret = await worker.recognize(imageUrl);
                    ocrText += ret.data.text + "\n";
                  } catch (ocrError) {
                    console.error(`OCR failed for PDF page ${i}:`, ocrError);
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
          toast.info("PDF format not recognized, attempting OCR extraction...");
          setProcessingStatus("PDF parsing failed, attempting OCR...");
          
          try {
            const worker = await createWorker("eng");
            const imageUrl = URL.createObjectURL(file);
            try {
              const ret = await worker.recognize(imageUrl);
              text = ret.data.text;
              if (!text.trim()) {
                throw new Error("OCR produced no text");
              }
            } finally {
              URL.revokeObjectURL(imageUrl);
              await worker.terminate();
            }
          } catch (ocrError) {
            console.error("OCR fallback also failed:", ocrError);
            throw new Error("Could not read text from this file. Please try: 1) Re-saving as a new PDF using 'Print to PDF', 2) Converting to Word (.docx) format, or 3) Ensuring the file contains selectable text (not just images).");
          }
        }
      } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        setProcessingStatus("Reading Word document...");
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } else {
        try {
          setProcessingStatus("Scanning image for text...");
          const worker = await createWorker("eng");
          const imageUrl = URL.createObjectURL(file);
          try {
            const ret = await worker.recognize(imageUrl);
            text = ret.data.text;
          } catch (ocrError: any) {
             const errorMessage = ocrError?.message?.includes("attempting to read image") 
                                  ? "The image file appears to be corrupted or in an unsupported format. Please try a different image (JPG/PNG)." 
                                  : `Could not read text from this image. Please ensure it is clear and readable. Original OCR issue: ${ocrError?.message || "Unknown error."}`;
             throw new Error(errorMessage);
          } finally {
            URL.revokeObjectURL(imageUrl);
            await worker.terminate();
          }
        } catch (ocrError: any) {
          console.error("Image OCR processing failed:", ocrError);
          throw new Error(`Failed to process image for text extraction. Original issue: ${ocrError instanceof Error ? ocrError.message : String(ocrError)}`);
        }
      }

      if (!text.trim()) {
        throw new Error("No text could be extracted from the file. Please try converting your document to a different format or ensure it contains readable text.");
      }

      const cleanText = text.replace(/\0/g, '').replace(/[\uFFFD\uFFFE\uFFFF]/g, '');

      console.log("DEBUG: Extracted text length:", cleanText.length);
      
      if (cleanText.length < 20) {
        throw new Error(`Extracted text is too short (${cleanText.length} chars). Please ensure the file contains selectable text.`);
      }

      setProcessingStatus("Finalizing analysis...");
      await updateResumeOcr({ id: resumeId, ocrText: cleanText });
      
      toast.success("✅ Text extracted successfully! AI analysis in progress...");
      
    } catch (error: any) {
      if (error.message === "Aborted") throw error;
      throw error;
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
    fileInputRef,
    handleFile,
    handleFileUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    cancelUpload
  };
}
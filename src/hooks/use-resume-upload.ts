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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(apiAny.resumes.generateUploadUrl);
  const createResume = useMutation(apiAny.resumes.createResume);
  const updateResumeOcr = useMutation(apiAny.resumes.updateResumeOcr);
  const deleteResume = useMutation(apiAny.resumes.deleteResume);

  const handleFile = async (file: File) => {
    if (!file) return;

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
    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();

      const resumeId = await createResume({
        storageId,
        title: file.name,
        mimeType: file.type,
        jobDescription: jobDescription.trim() || undefined,
      });

      setProcessingResumeId(resumeId);

      toast.success(jobDescription.trim() 
        ? "Resume uploaded! AI is analyzing against your job description..." 
        : "Resume uploaded! AI is analyzing..."
      );
      
      await processFile(file, resumeId);
      setJobDescription("");

    } catch (error) {
      console.error(error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      toast.error(`Failed to upload resume: ${errorMsg}`);
      setProcessingResumeId(null);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const processFile = async (file: File, resumeId: any) => {
    try {
      let text = "";

      if (file.type === "application/pdf") {
        const pdfVersion = pdfjsLib.version || "4.0.379"; 
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfVersion}/build/pdf.worker.min.mjs`;
        
        const arrayBuffer = await file.arrayBuffer();
        
        try {
          const pdf = await pdfjsLib.getDocument({ 
            data: arrayBuffer,
            useSystemFonts: true,
            standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfVersion}/standard_fonts/`,
          }).promise;
          
          for (let i = 1; i <= pdf.numPages; i++) {
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
          
          if (text.trim().length < 50 || (text.match(/[^\x00-\x7F]/g) || []).length / text.length > 0.5) {
            console.log("PDF text extraction yielded poor results, attempting OCR fallback...");
            toast.info("PDF text layer is unclear, using OCR for better accuracy...");
            
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            let ocrText = "";
            let ocrErrors: any[] = [];

            const worker = await createWorker("eng");
            
            try {
              for (let i = 1; i <= pdf.numPages; i++) {
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
                    ocrErrors.push(ocrError);
                  } finally {
                    URL.revokeObjectURL(imageUrl);
                  }
                } else {
                  console.warn(`Could not create image blob for PDF page ${i}. Skipping OCR for this page.`);
                  ocrErrors.push(new Error(`Failed to create image blob for PDF page ${i}`));
                }
              }
            } finally {
              await worker.terminate();
            }
            
            text = ocrText;
            
            if (!text.trim() && ocrErrors.length > 0) {
              const firstError = ocrErrors[0];
              throw new Error(`Failed to extract text from PDF via OCR. It might be corrupted or severely malformed. Details: ${firstError?.message || "Unknown OCR error."}`);
            }
          }
        } catch (pdfError) {
          console.error("PDF parsing failed:", pdfError);
          throw new Error(`Could not parse this PDF file. It may be corrupted, password protected, or in an unsupported format. Please try saving it as a new PDF or converting to Word. Original issue: ${pdfError instanceof Error ? pdfError.message : String(pdfError)}`);
        }
      } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } else {
        try {
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
      console.log("DEBUG: Extracted text preview:", cleanText.substring(0, 200));

      if (cleanText.length < 20) {
        throw new Error(`Extracted text is too short (${cleanText.length} chars). Please ensure the file contains selectable text.`);
      }

      await updateResumeOcr({ id: resumeId, ocrText: cleanText });
      
      toast.success("✅ Text extracted successfully! AI analysis in progress...");
      
    } catch (error: any) {
      console.error("Processing Error:", error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      toast.error(`Text extraction failed: ${errorMsg}`);
      setProcessingResumeId(null);
      
      try {
        await deleteResume({ id: resumeId });
      } catch (deleteError) {
        console.error("Failed to delete failed resume:", deleteError);
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
    fileInputRef,
    handleFile,
    handleFileUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop
  };
}
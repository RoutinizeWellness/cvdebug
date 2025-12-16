import { useState, useRef } from "react";
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

      // Set processing state to show upsell overlay
      setProcessingResumeId(resumeId);

      toast.success(jobDescription.trim() 
        ? "Resume uploaded! AI is analyzing against your job description..." 
        : "Resume uploaded! AI is analyzing..."
      );
      
      // Process the file
      await processFile(file, resumeId);
      setJobDescription("");

    } catch (error) {
      console.error(error);
      toast.error("Failed to upload resume");
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
        // PDF Processing with enhanced error handling and fallback
        const pdfVersion = pdfjsLib.version || "4.0.379"; 
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfVersion}/build/pdf.worker.min.mjs`;
        
        const arrayBuffer = await file.arrayBuffer();
        
        try {
          // Try standard PDF text extraction
          const pdf = await pdfjsLib.getDocument({ 
            data: arrayBuffer,
            useSystemFonts: true,
            standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfVersion}/standard_fonts/`,
          }).promise;
          
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            
            // Enhanced text extraction with better spacing
            const pageText = content.items
              .map((item: any) => {
                // Preserve spacing between text items
                const str = item.str || "";
                const hasEOL = item.hasEOL;
                return hasEOL ? str + "\n" : str + " ";
              })
              .join("");
            
            text += pageText + "\n";
          }
          
          // If extracted text is too short or seems corrupted, try OCR fallback
          if (text.trim().length < 50 || (text.match(/[^\x00-\x7F]/g) || []).length / text.length > 0.5) {
            console.log("PDF text extraction yielded poor results, attempting OCR fallback...");
            toast.info("PDF text layer is unclear, using OCR for better accuracy...");
            
            // Convert PDF to image and use OCR
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            text = ""; // Reset text
            
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better OCR
              canvas.width = viewport.width;
              canvas.height = viewport.height;
              
              await page.render({
                canvasContext: context!,
                viewport: viewport
              }).promise;
              
              // Convert canvas to blob and run OCR
              const blob = await new Promise<Blob>((resolve) => {
                canvas.toBlob((b) => resolve(b!), 'image/png');
              });
              
              const worker = await createWorker("eng");
              const imageUrl = URL.createObjectURL(blob);
              const ret = await worker.recognize(imageUrl);
              URL.revokeObjectURL(imageUrl);
              await worker.terminate();
              
              text += ret.data.text + "\n";
            }
          }
        } catch (pdfError) {
          console.error("PDF parsing failed, attempting OCR fallback:", pdfError);
          toast.info("PDF format not standard, using OCR for text extraction...");
          
          // Full OCR fallback for completely unreadable PDFs
          const worker = await createWorker("eng");
          const imageUrl = URL.createObjectURL(file);
          const ret = await worker.recognize(imageUrl);
          URL.revokeObjectURL(imageUrl);
          await worker.terminate();
          text = ret.data.text;
        }
      } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        // Word (.docx) Processing
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } else {
        // Image OCR Processing
        const worker = await createWorker("eng");
        const imageUrl = URL.createObjectURL(file);
        const ret = await worker.recognize(imageUrl);
        URL.revokeObjectURL(imageUrl);
        await worker.terminate();
        text = ret.data.text;
      }

      if (!text.trim()) {
        toast.error("No text could be extracted from the file. Please try converting your PDF to a different format or ensure it contains readable text.");
        return;
      }

      // Clean text before sending
      const cleanText = text.replace(/\0/g, '').replace(/[\uFFFD\uFFFE\uFFFF]/g, '');

      console.log("DEBUG: Extracted text length:", cleanText.length);
      console.log("DEBUG: Extracted text preview:", cleanText.substring(0, 200));

      if (cleanText.length < 20) {
        throw new Error(`Extracted text is too short (${cleanText.length} chars). Please ensure the file contains selectable text.`);
      }

      // Send extracted text to backend for AI analysis
      await updateResumeOcr({ id: resumeId, ocrText: cleanText });
      
      toast.success("✅ Text extracted successfully! AI analysis in progress...");
      
      // Don't clear processing state here - let it clear when analysis completes
    } catch (error: any) {
      console.error("Processing Error:", error);
      toast.error(`Text extraction failed: ${error.message || "Please try a different file format."}`);
      setProcessingResumeId(null);
      
      // Delete the failed resume
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

declare module 'pdfjs-dist' {
  export const GlobalWorkerOptions: {
    workerSrc: string;
  };
  export const version: string;
  export function getDocument(src: any): {
    promise: Promise<PDFDocumentProxy>;
  };

  export interface PDFDocumentProxy {
    numPages: number;
    getPage(pageNumber: number): Promise<PDFPageProxy>;
  }

  export interface PDFPageProxy {
    getTextContent(): Promise<PDFTextContent>;
    getViewport(params: { scale: number }): any;
    render(params: any): any;
  }

  export interface PDFTextContent {
    items: Array<{ str: string }>;
  }
}

declare module 'tesseract.js' {
  export function createWorker(langs?: string, oem?: number, config?: any): Promise<Worker>;
  
  export interface Worker {
    recognize(image: any, options?: any): Promise<RecognizeResult>;
    terminate(): Promise<void>;
  }

  export interface RecognizeResult {
    data: {
      text: string;
      [key: string]: any;
    };
  }
}

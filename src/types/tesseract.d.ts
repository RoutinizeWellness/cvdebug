declare module 'tesseract.js' {
  export function createWorker(langs?: string | string[], oem?: number, config?: any): Promise<Worker>;

  export interface Worker {
    recognize(image: any, options?: any): Promise<RecognizeResult>;
    terminate(): Promise<void>;
    setParameters(params: Record<string, any>): Promise<void>;
  }

  export interface RecognizeResult {
    data: {
      text: string;
      confidence?: number;
      [key: string]: any;
    };
  }
}

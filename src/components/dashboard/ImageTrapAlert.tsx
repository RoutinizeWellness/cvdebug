import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ImageTrapAlertProps {
  textLayerIntegrity?: number;
  hasImageTrap?: boolean;
  onFixGuide?: () => void;
}

export function ImageTrapAlert({ textLayerIntegrity, hasImageTrap, onFixGuide }: ImageTrapAlertProps) {
  // If no data yet, don't show anything
  if (textLayerIntegrity === undefined) {
    return null;
  }

  const score = textLayerIntegrity;
  const isCritical = score < 50;
  const isWarning = score >= 50 && score < 80;
  const isHealthy = score >= 80;

  if (isHealthy) {
    return (
      <Alert className="border-green-500/50 bg-green-500/10">
        <CheckCircle2 className="h-4 w-4 text-green-500" />
        <AlertTitle className="text-green-500 font-bold">✅ Text Layer Healthy</AlertTitle>
        <AlertDescription className="text-green-600 dark:text-green-400 text-sm">
          Your resume's text layer is readable by ATS systems. OCR integrity score: <strong>{score}/100</strong>
        </AlertDescription>
      </Alert>
    );
  }

  if (isWarning) {
    return (
      <Alert className="border-yellow-500/50 bg-yellow-500/10">
        <Info className="h-4 w-4 text-yellow-500" />
        <AlertTitle className="text-yellow-500 font-bold">⚠️ Minor OCR Issues Detected</AlertTitle>
        <AlertDescription className="text-yellow-600 dark:text-yellow-400 text-sm space-y-3">
          <p>
            Your resume has some text extraction issues. OCR integrity score: <strong>{score}/100</strong>
          </p>
          <Progress value={score} className="h-2" />
          <p className="text-xs">
            Some ATS systems may have difficulty parsing certain sections. Consider re-exporting your resume as a simpler PDF.
          </p>
          {onFixGuide && (
            <Button size="sm" variant="outline" onClick={onFixGuide} className="mt-2">
              View Fix Guide
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  // Critical - Image Trap detected
  return (
    <Alert className="border-red-500/50 bg-red-500/10 animate-pulse">
      <AlertTriangle className="h-5 w-5 text-red-500" />
      <AlertTitle className="text-red-500 font-bold text-lg">⚠️ RED ALERT: Your latest edit broke your PDF encoding</AlertTitle>
      <AlertDescription className="text-red-600 dark:text-red-400 space-y-3">
        <p className="font-semibold">
          Engineers from [Company] will see a blank page. OCR integrity score: <strong>{score}/100</strong>
        </p>
        <Progress value={score} className="h-2 bg-red-900" />
        <div className="bg-red-950/50 border border-red-900/50 rounded-lg p-4 space-y-2 text-sm">
          <p className="font-bold">⚠️ What this means:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>ATS systems <strong>cannot read</strong> your resume text</li>
            <li>Your resume appears as an <strong>image</strong> to robots</li>
            <li>You will be <strong>auto-rejected</strong> by 90% of companies</li>
          </ul>
        </div>
        {onFixGuide && (
          <Button size="sm" variant="destructive" onClick={onFixGuide} className="mt-2 font-bold">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Click to Fix via PDF Sanitizer
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
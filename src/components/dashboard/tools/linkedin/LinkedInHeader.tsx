import { Calendar, RefreshCw } from "lucide-react";

interface LinkedInHeaderProps {
  lastScanned: string;
  profileUrl?: string;
  onRescan: () => void;
  isScanning: boolean;
}

export function LinkedInHeader({ lastScanned, profileUrl, onRescan, isScanning }: LinkedInHeaderProps) {
  return (
    <>
      {/* Breadcrumbs */}
      <div className="flex flex-wrap gap-2 mb-6 text-sm">
        <span className="text-slate-500">Dashboard</span>
        <span className="text-slate-600">/</span>
        <span className="text-slate-500">Tools</span>
        <span className="text-slate-600">/</span>
        <span className="text-slate-900 font-medium">LinkedIn Audit</span>
      </div>

      {/* Page Heading & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-slate-900 text-3xl md:text-4xl font-black leading-tight tracking-tight">
            LinkedIn Profile Audit
          </h1>
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Calendar className="h-4 w-4" />
            <span>Last scanned: {lastScanned}</span>
            {profileUrl && (
              <>
                <span className="mx-1">•</span>
                <span>Profile: {profileUrl}</span>
              </>
            )}
          </div>
        </div>
        <button
          onClick={onRescan}
          disabled={isScanning}
          className="flex items-center gap-2 bg-primary hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-slate-900 px-5 py-2.5 rounded-lg font-bold text-sm shadow-lg shadow-primary/20"
        >
          <RefreshCw className={`h-5 w-5 ${isScanning ? "animate-spin" : ""}`} />
          <span>{isScanning ? "Scanning..." : "Re-scan Profile"}</span>
        </button>
      </div>
    </>
  );
}
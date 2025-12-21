import { Logo } from "@/components/Logo";
import { useState } from "react";
import { PrivacyDialog } from "./PrivacyDialog";
import { TermsDialog } from "./TermsDialog";

export function Footer() {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  return (
    <footer className="w-full py-12 border-t border-gray-200 bg-white">
      <PrivacyDialog open={showPrivacy} onOpenChange={setShowPrivacy} />
      <TermsDialog open={showTerms} onOpenChange={setShowTerms} />
      
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <Logo variant="default" iconClassName="h-6 w-auto" textClassName="text-lg" />
        <div className="flex items-center gap-8">
          <button onClick={() => setShowTerms(true)} className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2">
            <span>📄</span> Terms of Service
          </button>
          <button onClick={() => setShowPrivacy(true)} className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2">
            <span>🔒</span> Privacy Policy
          </button>
          <a className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2" href="https://x.com/Aherme13" target="_blank" rel="noopener noreferrer">
            <span>🐦</span> Twitter <span>↗️</span>
          </a>
        </div>
        <div className="text-xs text-gray-500">
          © 2024 CVDebug. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
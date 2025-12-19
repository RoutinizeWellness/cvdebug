import { Logo } from "@/components/Logo";
import { useState } from "react";
import { PrivacyDialog } from "./PrivacyDialog";
import { TermsDialog } from "./TermsDialog";

export function Footer() {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  return (
    <footer className="w-full py-12 border-t border-white/10 bg-[#050505]">
      <PrivacyDialog open={showPrivacy} onOpenChange={setShowPrivacy} />
      <TermsDialog open={showTerms} onOpenChange={setShowTerms} />
      
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="CVDebug Logo" className="h-6 w-6" />
          <span className="text-white font-bold text-sm tracking-tight">CVDebug</span>
        </div>
        <div className="flex items-center gap-8">
          <button onClick={() => setShowTerms(true)} className="text-sm text-gray-500 hover:text-white transition-colors">Terms of Service</button>
          <button onClick={() => setShowPrivacy(true)} className="text-sm text-gray-500 hover:text-white transition-colors">Privacy Policy</button>
          <a className="text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-1" href="https://x.com/Aherme13" target="_blank" rel="noopener noreferrer">
            Twitter <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
          </a>
        </div>
        <div className="text-xs text-gray-600">
          © 2024 CVDebug. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
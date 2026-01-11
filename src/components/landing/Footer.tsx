import { Logo } from "@/components/Logo";
import { useState } from "react";
import { PrivacyDialog } from "./PrivacyDialog";
import { TermsDialog } from "./TermsDialog";

export function Footer() {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  return (
    <footer className="border-t border-slate-800 bg-slate-950/50 backdrop-blur-sm pt-16 pb-8">
      <PrivacyDialog open={showPrivacy} onOpenChange={setShowPrivacy} />
      <TermsDialog open={showTerms} onOpenChange={setShowTerms} />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
          <div className="flex flex-col gap-4 max-w-sm">
            <Logo variant="default" />
            <p className="text-slate-400 text-sm leading-relaxed">
              The developer-first toolkit for navigating the modern, automated job market. Debug your career today.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-12 md:gap-16">
            <div className="flex flex-col gap-3">
              <h4 className="text-white font-semibold text-sm">Product</h4>
              <a className="text-slate-400 text-sm hover:text-primary transition-colors" href="/">ATS Scanner</a>
              <a className="text-slate-400 text-sm hover:text-primary transition-colors" href="/preview">Preview Scan</a>
              <a className="text-slate-400 text-sm hover:text-primary transition-colors" href="/pricing">Pricing</a>
              <a className="text-slate-400 text-sm hover:text-primary transition-colors" href="/dashboard">Dashboard</a>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-white font-semibold text-sm">For Nurses</h4>
              <a className="text-slate-400 text-sm hover:text-primary transition-colors" href="/ats-scanner-for-nurses">Nursing ATS Scanner</a>
              <a className="text-slate-400 text-sm hover:text-primary transition-colors" href="/icu-nurse-ats-optimizer">ICU Nurse</a>
              <a className="text-slate-400 text-sm hover:text-primary transition-colors" href="/er-nurse-ats-optimizer">ER Nurse</a>
              <a className="text-slate-400 text-sm hover:text-primary transition-colors" href="/travel-nurse-ats-optimizer">Travel Nurse</a>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-white font-semibold text-sm">For Tech</h4>
              <a className="text-slate-400 text-sm hover:text-primary transition-colors" href="/software-engineer-keyword-sniper">Software Engineer</a>
              <a className="text-slate-400 text-sm hover:text-primary transition-colors" href="/senior-frontend-engineer-ats">Frontend Engineer</a>
              <a className="text-slate-400 text-sm hover:text-primary transition-colors" href="/backend-engineer-java-ats">Backend Engineer</a>
              <a className="text-slate-400 text-sm hover:text-primary transition-colors" href="/devops-engineer-kubernetes-ats">DevOps Engineer</a>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-white font-semibold text-sm">Resources</h4>
              <a className="text-slate-400 text-sm hover:text-primary transition-colors" href="/blog">Blog</a>
              <a className="text-slate-400 text-sm hover:text-primary transition-colors" href="/blog/how-to-beat-ats-resume-scanners">Beat ATS Guide</a>
              <a className="text-slate-400 text-sm hover:text-primary transition-colors" href="/blog/understanding-ats-robot-view">Robot View Guide</a>
              <a className="text-slate-400 text-sm hover:text-primary transition-colors" href="mailto:cvdebug@outlook.com">Contact</a>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-white font-semibold text-sm">Legal</h4>
              <button onClick={() => setShowPrivacy(true)} className="text-slate-400 text-sm hover:text-primary transition-colors text-left">Privacy Policy</button>
              <button onClick={() => setShowTerms(true)} className="text-slate-400 text-sm hover:text-primary transition-colors text-left">Terms of Service</button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-xs">© 2024 CVDebug. All rights reserved.</p>
          <div className="flex gap-4">
            <a className="text-slate-500 hover:text-white transition-colors" href="https://x.com/Aherme13" target="_blank" rel="noopener noreferrer">
              <span className="text-xl">🐦</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
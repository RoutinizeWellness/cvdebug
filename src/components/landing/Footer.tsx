import { Logo } from "@/components/Logo";
import { useState } from "react";
import { PrivacyDialog } from "./PrivacyDialog";
import { TermsDialog } from "./TermsDialog";

export function Footer() {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  return (
    <footer className="border-t py-12 bg-background">
      <PrivacyDialog open={showPrivacy} onOpenChange={setShowPrivacy} />
      <TermsDialog open={showTerms} onOpenChange={setShowTerms} />
      
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
          <div className="flex flex-col gap-3 max-w-sm">
            <Logo />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Privacy-first: Your data is automatically deleted after 30 days. We do not sell your data.
            </p>
          </div>
          
          <div className="flex flex-col gap-3 items-start md:items-end">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                TB
              </div>
              <div className="text-left md:text-right">
                <p className="text-sm font-bold text-foreground">Built by Tini Boti</p>
                <p className="text-xs text-muted-foreground">Developer building tools for job seekers</p>
              </div>
            </div>
            <a 
              href="https://twitter.com/tiniboti" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-primary/80 transition-colors group"
            >
              <svg className="h-4 w-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Follow my journey on X
            </a>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Resume ATS Optimizer. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground font-medium">
            <button onClick={() => setShowPrivacy(true)} className="hover:text-foreground transition-colors">Privacy</button>
            <button onClick={() => setShowTerms(true)} className="hover:text-foreground transition-colors">Terms</button>
            <a href="https://twitter.com/tiniboti" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
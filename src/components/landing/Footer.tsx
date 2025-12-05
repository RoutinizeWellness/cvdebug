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
      
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <Logo />
        <div className="text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} Resume ATS Optimizer. All rights reserved.
        </div>
        <div className="flex gap-6 text-sm text-muted-foreground font-medium">
          <button onClick={() => setShowPrivacy(true)} className="hover:text-foreground transition-colors">Privacy</button>
          <button onClick={() => setShowTerms(true)} className="hover:text-foreground transition-colors">Terms</button>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Twitter</a>
        </div>
      </div>
    </footer>
  );
}
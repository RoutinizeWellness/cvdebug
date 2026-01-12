import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export function TermsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Terms of Service</DialogTitle>
          <DialogDescription>
            Last updated: {new Date().toLocaleDateString('es-ES')}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              Please read these Terms of Service carefully before using Resume ATS Optimizer.
            </p>

            <h3 className="font-bold text-foreground text-lg mt-6">1. Acceptance of Terms</h3>
            <p>
              By accessing or using our service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.
            </p>

            <h3 className="font-bold text-foreground text-lg mt-6">2. Description of Service</h3>
            <p>
              Resume ATS Optimizer provides AI-powered resume analysis and optimization tools. We offer ATS scoring, keyword analysis, and rewriting suggestions.
            </p>

            <h3 className="font-bold text-foreground text-lg mt-6">3. User Accounts</h3>
            <p>
              You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password. You agree not to disclose your password to any third party.
            </p>

            <h3 className="font-bold text-foreground text-lg mt-6">4. Credits and Payments</h3>
            <p>
              Our service operates on a credit-based system. Credits are purchased and used for resume scans.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Credits are non-refundable once purchased.</li>
              <li>Free trial credits are valid for 15 days from registration.</li>
              <li>We reserve the right to modify our pricing and credit usage rates at any time.</li>
            </ul>

            <h3 className="font-bold text-foreground text-lg mt-6">5. User Content</h3>
            <p>
              You retain ownership of any resumes or documents you upload. By uploading content, you grant us a license to use, reproduce, and process that content solely for the purpose of providing the service to you.
            </p>

            <h3 className="font-bold text-foreground text-lg mt-6">6. Disclaimer</h3>
            <p>
              Our AI analysis is advisory in nature. We do not guarantee job interviews or employment offers. The ATS scoring is a simulation based on common industry standards.
            </p>

            <h3 className="font-bold text-foreground text-lg mt-6">7. Termination</h3>
            <p>
              We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
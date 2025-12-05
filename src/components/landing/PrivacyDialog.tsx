import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export function PrivacyDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Privacy Policy</DialogTitle>
          <DialogDescription>
            Last updated: {new Date().toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              At Resume ATS Optimizer, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information.
            </p>

            <h3 className="font-bold text-foreground text-lg mt-6">1. Information We Collect</h3>
            <p>
              We collect information you provide directly to us, including:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Account information (email address, name) via our authentication provider (Clerk).</li>
              <li>Uploaded documents (resumes, CVs) for analysis.</li>
              <li>Payment information (processed securely by Stripe).</li>
              <li>Usage data and interaction with our AI tools.</li>
            </ul>

            <h3 className="font-bold text-foreground text-lg mt-6">2. How We Use Your Information</h3>
            <p>
              We use your information to:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Provide, maintain, and improve our services.</li>
              <li>Process your resume using AI algorithms to generate ATS scores and feedback.</li>
              <li>Process payments and manage your credit balance.</li>
              <li>Send you technical notices, updates, and support messages.</li>
            </ul>

            <h3 className="font-bold text-foreground text-lg mt-6">3. Data Storage and Security</h3>
            <p>
              Your resumes and personal data are stored securely using Convex's database and file storage. We implement industry-standard security measures to protect your data. 
              We do not sell your personal data to third parties.
            </p>

            <h3 className="font-bold text-foreground text-lg mt-6">4. AI Processing</h3>
            <p>
              We use third-party AI providers (such as OpenRouter/Google Gemini) to analyze your resume content. Your data is sent to these providers solely for the purpose of generating the analysis and is not used to train their public models.
            </p>

            <h3 className="font-bold text-foreground text-lg mt-6">5. Contact Us</h3>
            <p>
              If you have any questions about this Privacy Policy, please contact us at support@resumeatsoptimizer.com.
            </p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

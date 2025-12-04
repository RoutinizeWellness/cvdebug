import { FileText } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t py-12 bg-background">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">Resume ATS Optimizer</span>
        </div>
        <div className="text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} Resume ATS Optimizer. All rights reserved.
        </div>
        <div className="flex gap-6 text-sm text-muted-foreground font-medium">
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
        </div>
      </div>
    </footer>
  );
}

import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="border-t py-12 bg-background">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <Logo />
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
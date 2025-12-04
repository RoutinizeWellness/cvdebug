import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { FileText } from "lucide-react";
import { useNavigate } from "react-router";

export function Navbar() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg tracking-tight">Resume ATS Optimizer</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/auth")} className="text-muted-foreground hover:text-foreground font-medium hidden sm:flex">
            Sign In
          </Button>
          <Button onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")} className="rounded-full px-6 shadow-lg shadow-primary/20 font-bold">
            {isAuthenticated ? "Dashboard" : "Get Started"}
          </Button>
        </div>
      </div>
    </nav>
  );
}

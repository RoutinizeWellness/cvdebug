import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { Logo } from "@/components/Logo";

export function Navbar() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="cursor-pointer hover:opacity-90 transition-opacity group" onClick={() => navigate("/")}>
          <Logo />
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/pricing")} className="text-muted-foreground hover:text-foreground font-medium hidden sm:flex">
            Pricing
          </Button>
          <Button variant="ghost" onClick={() => navigate("/auth")} className="text-muted-foreground hover:text-foreground font-medium hidden sm:flex">
            Sign In
          </Button>
          <Button onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")} className="rounded-full px-6 shadow-lg shadow-primary/20 font-bold hover:shadow-primary/40 hover:scale-105 transition-all bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
            {isAuthenticated ? "Dashboard" : "Get Started"}
          </Button>
        </div>
      </div>
    </nav>
  );
}
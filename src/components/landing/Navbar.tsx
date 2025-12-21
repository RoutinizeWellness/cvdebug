import { useState } from "react";
import { useNavigate } from "react-router";
import { X, Menu } from "lucide-react";
import { Logo } from "@/components/Logo";

export function Navbar() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 z-50 w-full glass-nav">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="cursor-pointer" onClick={() => navigate("/")}>
            <Logo variant="default" />
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a className="text-sm font-medium text-slate-300 hover:text-white transition-colors" href="#features">Features</a>
            <a className="text-sm font-medium text-slate-300 hover:text-white transition-colors" href="#pricing">Pricing</a>
            <a className="text-sm font-medium text-slate-300 hover:text-white transition-colors" href="#" onClick={(e) => { e.preventDefault(); navigate("/auth"); }}>Login</a>
            <button 
              className="h-9 px-4 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm font-medium transition-colors"
              onClick={() => navigate("/auth")}
            >
              Sign Up
            </button>
          </div>
          <button 
            className="md:hidden text-slate-300"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-slate-900 border-l border-slate-800 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <Logo variant="default" />
              <button 
                className="text-slate-500 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex flex-col p-6 gap-6">
              <a 
                className="text-base font-medium text-slate-300 hover:text-white transition-colors py-2" 
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a 
                className="text-base font-medium text-slate-300 hover:text-white transition-colors py-2" 
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <button 
                className="mt-4 flex items-center justify-center h-12 px-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-base font-semibold rounded-lg transition-all"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/auth");
                }}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
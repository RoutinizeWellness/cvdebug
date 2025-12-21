import { useState } from "react";
import { useNavigate } from "react-router";
import { X, Menu } from "lucide-react";
import { Logo } from "@/components/Logo";

export function Navbar() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="cursor-pointer" onClick={() => navigate("/")}>
            <Logo variant="default" />
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a className="text-sm font-medium text-gray-700 hover:text-primary transition-colors" href="#features">Features</a>
            <a className="text-sm font-medium text-gray-700 hover:text-primary transition-colors" href="#pricing">Pricing</a>
            <a className="text-sm font-medium text-gray-700 hover:text-primary transition-colors" href="#faq">FAQ</a>
          </div>
          <button 
            className="hidden md:flex items-center justify-center h-10 px-6 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-lg transition-all hover:scale-105 shadow-md shadow-primary/25"
            onClick={() => navigate("/auth")}
          >
            Get Started
          </button>
          <button 
            className="md:hidden text-gray-900 p-2"
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
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white border-l border-gray-200 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <Logo variant="default" />
              <button 
                className="text-gray-500 hover:text-gray-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex flex-col p-6 gap-6">
              <a 
                className="text-base font-medium text-gray-700 hover:text-primary transition-colors py-2" 
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a 
                className="text-base font-medium text-gray-700 hover:text-primary transition-colors py-2" 
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <a 
                className="text-base font-medium text-gray-700 hover:text-primary transition-colors py-2" 
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </a>
              <button 
                className="mt-4 flex items-center justify-center h-12 px-6 bg-primary hover:bg-primary/90 text-white text-base font-semibold rounded-lg transition-all hover:scale-105 shadow-md shadow-primary/25"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/auth");
                }}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
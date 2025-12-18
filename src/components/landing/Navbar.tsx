import { useState } from "react";
import { useNavigate } from "react-router";
import { X } from "lucide-react";

export function Navbar() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#050505]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="flex items-center justify-center size-8 rounded bg-[#7c3bed]/20 text-[#7c3bed] border border-[#7c3bed]/30">
              <span className="material-symbols-outlined text-[20px]">terminal</span>
            </div>
            <h1 className="text-white text-lg font-bold tracking-tight">CVDebug</h1>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a className="text-sm font-medium text-gray-400 hover:text-white transition-colors" href="#features">Features</a>
            <a className="text-sm font-medium text-gray-400 hover:text-white transition-colors" href="#pricing">Pricing</a>
            <a className="text-sm font-medium text-gray-400 hover:text-white transition-colors" href="#faq">FAQ</a>
          </div>
          <button 
            className="hidden md:flex items-center justify-center h-9 px-4 bg-[#22C55E] hover:bg-[#16a34a] text-black text-sm font-bold rounded-lg transition-colors shadow-[0_0_15px_-3px_rgba(34,197,94,0.4)]"
            onClick={() => navigate("/auth")}
          >
            Get Started
          </button>
          <button 
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-[#050505] border-l border-white/10 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center size-8 rounded bg-[#7c3bed]/20 text-[#7c3bed] border border-[#7c3bed]/30">
                  <span className="material-symbols-outlined text-[20px]">terminal</span>
                </div>
                <h1 className="text-white text-lg font-bold tracking-tight">CVDebug</h1>
              </div>
              <button 
                className="text-gray-400 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex flex-col p-6 gap-6">
              <a 
                className="text-base font-medium text-gray-300 hover:text-white transition-colors py-2" 
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a 
                className="text-base font-medium text-gray-300 hover:text-white transition-colors py-2" 
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <a 
                className="text-base font-medium text-gray-300 hover:text-white transition-colors py-2" 
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </a>
              <button 
                className="mt-4 flex items-center justify-center h-12 px-6 bg-[#22C55E] hover:bg-[#16a34a] text-black text-base font-bold rounded-lg transition-colors shadow-[0_0_15px_-3px_rgba(34,197,94,0.4)]"
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
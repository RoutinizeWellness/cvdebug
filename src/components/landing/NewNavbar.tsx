import { Button } from "@/components/ui/button";
import { Terminal, Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";

export function NewNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const navLinks = [
    { name: "Analyzer", href: "#analyzer" },
    { name: "Tools", href: "#features" },
    { name: "Pricing", href: "/pricing" },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(href);
    }
  };

  return (
    <>
      <nav className="fixed top-0 z-50 w-full glass-panel-light shadow-soft">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="cursor-pointer flex items-center"
            onClick={() => navigate("/")}
          >
            <img
              src="https://harmless-tapir-303.convex.cloud/api/storage/4f836582-7336-4306-8004-211fad87218f"
              alt="CVDebug Logo"
              className="h-8"
            />
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden md:flex md:gap-8"
          >
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href)}
                className="text-sm font-medium text-[#475569] transition-colors hover:text-[#1E293B]"
              >
                {link.name}
              </button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-4"
          >
            <button
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
              className="hidden text-sm font-medium text-[#475569] transition-colors hover:text-[#1E293B] sm:block"
            >
              {isAuthenticated ? "Dashboard" : "Log in"}
            </button>
            <Button
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
              className="gradient-button group relative inline-flex h-9 items-center justify-center overflow-hidden rounded-md px-4 text-sm font-semibold text-white border-0"
            >
              <span className="mr-2">Scan Resume</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-[#1E293B]"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </motion.div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 glass-panel-light border-t border-[#E2E8F0] md:hidden"
          >
            <div className="mx-auto max-w-7xl px-4 py-4 space-y-4">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href)}
                  className="block w-full text-left text-sm font-medium text-[#475569] transition-colors hover:text-[#1E293B] py-2"
                >
                  {link.name}
                </button>
              ))}
              <button
                onClick={() => {
                  navigate(isAuthenticated ? "/dashboard" : "/auth");
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left text-sm font-medium text-[#475569] transition-colors hover:text-[#1E293B] py-2 sm:hidden"
              >
                {isAuthenticated ? "Dashboard" : "Log in"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

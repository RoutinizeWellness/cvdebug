import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useI18n } from "@/contexts/I18nContext";

export function NewNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useI18n();

  // Handle scroll effect with debouncing
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      // Debounce scroll events for better performance
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setScrolled(window.scrollY > 10);
      }, 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navLinks = [
    { name: t.navbar.analyzer, href: "/preview" },
    { name: t.navbar.tools, href: "#features" },
    { name: t.navbar.pricing, href: "/pricing" },
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
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl border-b border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="cursor-pointer flex items-center gap-3 group"
            onClick={() => navigate("/")}
          >
            <div className="relative flex items-center">
              <img
                src="/favicon.png?v=21"
                alt="CVDebug Logo"
                className="w-12 h-12 transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:flex md:gap-1"
          >
            {navLinks.map((link, index) => (
              <motion.button
                key={link.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                onClick={() => handleNavClick(link.href)}
                className="px-4 py-2 text-sm font-semibold text-[#475569] transition-all duration-200 hover:text-[#1E293B] hover:bg-slate-50 rounded-lg relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300 group-hover:w-3/4 group-hover:left-[12.5%]" />
              </motion.button>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center gap-3"
          >
            <div className="hidden lg:block">
              <LanguageSelector />
            </div>

            <button
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
              className="hidden sm:block text-sm font-semibold text-[#475569] transition-colors hover:text-[#1E293B] px-4 py-2 rounded-lg hover:bg-slate-50"
            >
              {isAuthenticated ? t.navbar.dashboard : t.navbar.login}
            </button>

            <Button
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
              className="relative group h-10 px-6 overflow-hidden rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold shadow-[0_10px_40px_-10px_rgba(139,92,246,0.5)] hover:shadow-[0_20px_60px_-10px_rgba(139,92,246,0.6)] transition-all duration-300 border-0"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">{t.navbar.scanResume}</span>
                <span className="sm:hidden">{t.navbar.scan}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-[#1E293B] hover:bg-slate-50 p-2 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </motion.div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 120 }}
            className="fixed top-20 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-b border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] md:hidden"
          >
            <div className="mx-auto max-w-7xl px-4 py-6 space-y-2">
              {navLinks.map((link, index) => (
                <motion.button
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  onClick={() => handleNavClick(link.href)}
                  className="block w-full text-left text-base font-semibold text-[#475569] transition-all hover:text-[#1E293B] hover:bg-slate-50 py-3 px-4 rounded-lg"
                >
                  {link.name}
                </motion.button>
              ))}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                onClick={() => {
                  navigate(isAuthenticated ? "/dashboard" : "/auth");
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left text-base font-semibold text-[#475569] transition-all hover:text-[#1E293B] hover:bg-slate-50 py-3 px-4 rounded-lg"
              >
                {isAuthenticated ? t.navbar.dashboard : t.navbar.login}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

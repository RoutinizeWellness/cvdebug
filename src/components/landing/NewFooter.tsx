import { Github, Twitter } from "lucide-react";
import { Link } from "react-router";

export function NewFooter() {
  return (
    <footer className="bg-[#F8FAFC] mt-24 border-t border-[#E2E8F0]">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <img
              src="/assets/cvdebug-logo.png"
              alt="CVDebug"
              className="h-8 w-auto object-contain mb-4"
            />
            <p className="text-[#475569] text-sm">
              Beat ATS systems with AI-powered resume optimization. Get hired faster.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-[#1E293B] font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/pricing" className="text-[#475569] hover:text-[#3B82F6] text-sm transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/preview" className="text-[#475569] hover:text-[#3B82F6] text-sm transition-colors">
                  Free Scanner
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-[#475569] hover:text-[#3B82F6] text-sm transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-[#1E293B] font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-[#475569] hover:text-[#3B82F6] text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[#475569] hover:text-[#3B82F6] text-sm transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-[#1E293B] font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-[#475569] hover:text-[#3B82F6] text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-[#475569] hover:text-[#3B82F6] text-sm transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#E2E8F0] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-center text-xs leading-5 text-[#475569]">
            © 2026 CVDebug Inc. All rights reserved. System Status: <span className="text-[#22C55E]">Online</span>
          </p>

          <div className="flex justify-center space-x-6">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#475569] hover:text-[#3B82F6] transition-colors"
            >
              <span className="sr-only">Twitter</span>
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#475569] hover:text-[#3B82F6] transition-colors"
            >
              <span className="sr-only">GitHub</span>
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

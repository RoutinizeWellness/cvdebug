import { FileText, Briefcase, LayoutTemplate, Linkedin, Mail, Settings, Shield, LayoutDashboard, Timer, ChevronDown } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Logo } from "@/components/Logo";
import { LogoutConfirmDialog } from "@/components/LogoutConfirmDialog";
import { useState, useEffect } from "react";

const apiAny = api;

interface SidebarProps {
  categoryFilter: string | null;
  setCategoryFilter: (category: string | null) => void;
  setShowPricing: (show: boolean) => void;
  currentView: string;
  setCurrentView: (view: string) => void;
}

export function Sidebar({ categoryFilter, setCategoryFilter, setShowPricing, currentView, setCurrentView }: SidebarProps) {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const currentUser = useQuery(apiAny.users.currentUser);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0 });

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // Calculate sprint countdown
  useEffect(() => {
    const updateCountdown = () => {
      if (currentUser?.sprintExpiresAt) {
        const now = Date.now();
        const diff = currentUser.sprintExpiresAt - now;

        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          setTimeRemaining({ days, hours, minutes });
        }
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [currentUser?.sprintExpiresAt]);

  const NavItem = ({ active, icon, label, onClick }: any) => (
    <button
      onClick={onClick}
      className={`group flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors relative ${
        active
          ? "text-blue-700 bg-blue-50 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] ring-1 ring-blue-100"
          : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
      }`}
    >
      {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#3B82F6] rounded-l-lg"></div>}
      <span className="material-symbols-outlined text-[20px]" style={{ color: active ? '#3B82F6' : undefined }}>
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );

  const hasActiveSprint = currentUser?.sprintExpiresAt && currentUser.sprintExpiresAt > Date.now();

  return (
    <aside className="w-64 flex-shrink-0 bg-[#FFFFFF] border-r border-[#E2E8F0] flex flex-col z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)] hidden md:flex"
      style={{ height: '100vh' }}>

      {/* Logo & Nav */}
      <div className="flex flex-col p-6 mb-4">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => setCurrentView('mission')}>
          <Logo iconClassName="h-12 w-auto" />
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          <NavItem
            active={currentView === 'mission'}
            icon="home"
            label="Home"
            onClick={() => setCurrentView('mission')}
          />

          <NavItem
            active={currentView === 'master-cvs'}
            icon="description"
            label="My Resumes"
            onClick={() => setCurrentView('master-cvs')}
          />

          <NavItem
            active={currentView === 'tools'}
            icon="smart_toy"
            label="AI Tools"
            onClick={() => setCurrentView('tools')}
          />

          <NavItem
            active={currentView === 'settings'}
            icon="settings"
            label="Settings"
            onClick={() => setCurrentView('settings')}
          />

          {user?.email === "tiniboti@gmail.com" && (
            <NavItem
              active={false}
              icon="shield"
              label="Admin Panel"
              onClick={() => navigate("/admin")}
            />
          )}
        </nav>
      </div>

      {/* Footer Area: Sprint Widget & Profile */}
      <div className="mt-auto">
        {/* Sprint Countdown Widget */}
        {hasActiveSprint && (
          <div className="mx-4 mb-4 p-4 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] relative overflow-hidden group shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="absolute inset-0 bg-violet-50/50 group-hover:bg-violet-50 transition-colors"></div>

            <div className="flex items-center justify-between mb-2 relative z-10">
              <span className="text-[10px] uppercase font-bold text-violet-600 tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"></span>
                Sprint Active
              </span>
            </div>

            <div className="flex items-baseline gap-1 font-mono text-[#0F172A] relative z-10">
              <span className="text-xl font-bold">{String(timeRemaining.days).padStart(3, '0')}</span>
              <span className="text-[10px] text-slate-400 mr-2">DAYS</span>
              <span className="text-xl font-bold">{String(timeRemaining.hours).padStart(2, '0')}</span>
              <span className="text-[10px] text-slate-400 mr-2">HRS</span>
              <span className="text-xl font-bold">{String(timeRemaining.minutes).padStart(2, '0')}</span>
              <span className="text-[10px] text-slate-400">MIN</span>
            </div>
          </div>
        )}

        {/* Upgrade Button */}
        <div className="mx-4 mb-4">
          <button
            onClick={() => setShowPricing(true)}
            className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:opacity-90 text-white font-semibold text-sm shadow-[0_10px_40px_-10px_rgba(139,92,246,0.3)] transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
            {hasActiveSprint ? 'Manage Plan' : 'Upgrade Now'}
          </button>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-100 bg-[#FFFFFF]">
          <div className="flex items-center gap-3 px-2 py-2">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8",
                  userButtonTrigger: "hover:opacity-80 transition-opacity"
                }
              }}
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-[#0F172A]">
                {currentUser?.name || user?.fullName || "User"}
              </span>
              <span className="text-xs text-[#64748B]">
                {currentUser?.subscriptionTier === "interview_sprint"
                  ? "Pro Plan"
                  : "Free Plan"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <LogoutConfirmDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        onConfirm={handleSignOut}
      />
    </aside>
  );
}

import { FileText, Briefcase, LayoutTemplate, Linkedin, Mail, Settings, Shield, LayoutDashboard, Timer, ChevronDown } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
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
      className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors relative ${
        active
          ? "bg-gradient-to-r from-blue-500/15 to-blue-500/5 border border-blue-500/20 text-white"
          : "text-slate-400 hover:text-white hover:bg-slate-800/50"
      }`}
    >
      {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r"></div>}
      <span className="material-symbols-outlined text-[20px]" style={{ color: active ? '#3B82F6' : undefined }}>
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );

  const hasActiveSprint = currentUser?.sprintExpiresAt && currentUser.sprintExpiresAt > Date.now();

  return (
    <aside className="w-72 flex-shrink-0 hidden md:flex flex-col justify-between h-screen sticky top-0 relative z-20 transition-all duration-300"
      style={{
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)'
      }}>

      {/* Logo & Nav */}
      <div className="flex flex-col gap-8 p-6">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="material-symbols-outlined text-white text-[20px]">terminal</span>
          </div>
          <h1 className="text-white text-xl font-bold tracking-tight">CVDebug</h1>
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
            active={currentView === 'projects'}
            icon="work_history"
            label="Job Tracking"
            onClick={() => setCurrentView('projects')}
          />

          <NavItem
            active={currentView === 'tools'}
            icon="psychology"
            label="AI Tools"
            onClick={() => setCurrentView('tools')}
          />

          {/* Account Section */}
          <div className="flex flex-col gap-1 mt-4 pt-4 border-t border-slate-800/50">
            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Account</p>

            <NavItem
              active={currentView === 'profile'}
              icon="credit_card"
              label="Subscription"
              onClick={() => setCurrentView('profile')}
            />

            <NavItem
              active={false}
              icon="settings"
              label="Settings"
              onClick={() => {/* Settings */}}
            />

            {user?.email === "tiniboti@gmail.com" && (
              <NavItem
                active={false}
                icon="shield"
                label="Admin Panel"
                onClick={() => navigate("/admin")}
              />
            )}
          </div>
        </nav>
      </div>

      {/* Footer Area: Sprint Widget & Profile */}
      <div className="p-6 flex flex-col gap-6">
        {/* Sprint Countdown Widget */}
        {hasActiveSprint && (
          <div
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-violet-500/30 p-4 cursor-pointer hover:border-violet-500/50 transition-colors group"
            style={{ boxShadow: '0 0 20px -5px rgba(139, 92, 246, 0.3)' }}
            onClick={() => setShowPricing(true)}
          >
            <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-violet-500/20 blur-2xl rounded-full"></div>

            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-violet-300 uppercase tracking-wide flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse"></span>
                Sprint Active
              </span>
              <span className="material-symbols-outlined text-violet-400 text-[16px]">timer</span>
            </div>

            <div className="flex gap-2 text-white">
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold font-mono">{String(timeRemaining.days).padStart(2, '0')}</span>
                <span className="text-[10px] text-slate-400 uppercase">Days</span>
              </div>
              <span className="text-lg font-bold font-mono text-slate-600">:</span>
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold font-mono">{String(timeRemaining.hours).padStart(2, '0')}</span>
                <span className="text-[10px] text-slate-400 uppercase">Hrs</span>
              </div>
              <span className="text-lg font-bold font-mono text-slate-600">:</span>
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold font-mono">{String(timeRemaining.minutes).padStart(2, '0')}</span>
                <span className="text-[10px] text-slate-400 uppercase">Min</span>
              </div>
            </div>
          </div>
        )}

        {/* User Profile */}
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/50 cursor-pointer transition-colors">
          <UserButton
            appearance={{
              elements: {
                userButtonBox: "flex flex-row gap-2",
                userButtonOuterIdentifier: "text-sm font-bold text-slate-200",
                avatarBox: "h-10 w-10 rounded-full border border-slate-700"
              }
            }}
          />
          <div className="flex flex-col flex-1">
            <span className="text-sm font-semibold text-white leading-tight">
              {currentUser?.name || user?.fullName || "User"}
            </span>
            <span className="text-xs text-slate-500">
              {currentUser?.subscriptionTier === "interview_sprint"
                ? "Sprint Active"
                : currentUser?.subscriptionTier === "single_scan"
                ? "Pro"
                : "Free Tier"}
            </span>
          </div>
          <span className="material-symbols-outlined text-slate-500 text-[20px]">expand_more</span>
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

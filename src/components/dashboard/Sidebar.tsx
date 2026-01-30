import { FileText, Briefcase, LayoutTemplate, Linkedin, Mail, Settings, Shield, LayoutDashboard, Timer, ChevronDown } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Logo } from "@/components/Logo";
import { LogoutConfirmDialog } from "@/components/LogoutConfirmDialog";
import { SidebarApplicationTracker } from "@/components/dashboard/SidebarApplicationTracker";
import { useState, useEffect } from "react";
import { useI18n } from "@/contexts/I18nContext";

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
  const { t } = useI18n();

  const handleSignOut = async () => {
    try {
      await signOut();
      // Use window.location for full page reload after sign out
      window.location.href = "/";
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
      className={`group flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors relative ${active
        ? "text-[#0F172A] bg-[#F8FAFC] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] ring-1 ring-[#F1F5F9]"
        : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
        }`}
    >
      {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#64748B] rounded-l-lg"></div>}
      <span className="material-symbols-outlined text-[20px]" style={{ color: active ? '#64748B' : undefined }}>
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );

  const hasActiveSprint = currentUser?.sprintExpiresAt && currentUser.sprintExpiresAt > Date.now();

  return (
    <aside className="w-64 flex-shrink-0 bg-[#FFFFFF] border-r border-[#E2E8F0] flex flex-col z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)] hidden md:flex overflow-hidden"
      style={{ height: '100vh' }}>

      {/* Logo Area */}
      <div className="flex flex-col p-6 mb-2 flex-shrink-0">
        <div className="flex items-center gap-2 mb-2 cursor-pointer" onClick={() => setCurrentView('mission')}>
          <Logo iconClassName="h-10 w-auto" />
        </div>
      </div>

      {/* Scrollable Navigation Area */}
      <div className="flex-1 overflow-y-auto px-4 space-y-6 pb-6 custom-scrollbar">

        {/* RESUMES SECTION */}
        <div>
          <h3 className="px-4 mb-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
            {t.sidebar.resumesSection}
          </h3>
          <div className="flex flex-col gap-1">
            <NavItem
              active={currentView === 'mission'}
              icon="dashboard"
              label={t.sidebar.home}
              onClick={() => setCurrentView('mission')}
            />
            <NavItem
              active={currentView === 'master-cvs'}
              icon="description"
              label={t.sidebar.myResumes}
              onClick={() => setCurrentView('master-cvs')}
            />
            <NavItem
              active={currentView === 'match'}
              icon="target"
              label={t.sidebar.jobMatch}
              onClick={() => setCurrentView('match')}
            />
          </div>
        </div>

        {/* TOOLS SECTION */}
        <div>
          <h3 className="px-4 mb-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
            {t.sidebar.toolsSection}
          </h3>
          <div className="flex flex-col gap-1">
            <NavItem
              active={currentView === 'tools'}
              icon="auto_awesome"
              label={t.sidebar.aiAssistant}
              onClick={() => setCurrentView('tools')}
            />
            <NavItem
              active={currentView === 'analytics'}
              icon="monitoring"
              label={t.sidebar.analytics}
              onClick={() => setCurrentView('analytics')}
            />
          </div>
        </div>

        {/* APPLICATIONS SECTION */}
        <div>
          <h3 className="px-4 mb-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
            {t.sidebar.applicationsSection}
          </h3>
          <SidebarApplicationTracker />
        </div>

        {/* ACCOUNT SECTION */}
        <div>
          <h3 className="px-4 mb-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
            {t.sidebar.accountSection}
          </h3>
          <div className="flex flex-col gap-1">
            <NavItem
              active={currentView === 'settings'}
              icon="settings"
              label={t.sidebar.settings}
              onClick={() => setCurrentView('settings')}
            />
            <button
              onClick={() => setShowPricing(true)}
              className="group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all text-slate-600 hover:text-[#0F172A] hover:bg-slate-50 border border-transparent hover:border-slate-100"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px] text-slate-400 group-hover:text-[#0F172A]">payments</span>
                <span>{t.sidebar.managePlan}</span>
              </div>
            </button>
          </div>
        </div>

        {/* ADMIN PANEL - Isolated at the bottom of the scroll if exists */}
        {user?.primaryEmailAddress?.emailAddress === "tiniboti@gmail.com" && (
          <div className="pt-4 mt-4 border-t border-slate-100">
            <NavItem
              active={false}
              icon="shield_person"
              label={t.sidebar.adminPanel}
              onClick={() => navigate("/admin")}
            />
          </div>
        )}
      </div>

      {/* Footer Area: Sprint Widget & Profile */}
      <div className="mt-auto flex-shrink-0 border-t border-slate-50 bg-[#F8FAFC]/30">

        {/* Compact Sprint Progress */}
        {hasActiveSprint && (
          <div className="mx-4 mt-4 p-3 rounded-xl bg-[#0F172A] text-white relative overflow-hidden group shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">
                Sprint Active
              </span>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-[9px] font-bold text-emerald-400">{timeRemaining.days}d left</span>
              </div>
            </div>

            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-1000"
                style={{ width: '85%' }} // Placeholder progress
              ></div>
            </div>
          </div>
        )}

        {/* User Profile */}
        <div className="p-4">
          <div className="flex items-center gap-3 p-1 rounded-xl hover:bg-white transition-colors cursor-pointer group">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9 ring-2 ring-transparent group-hover:ring-slate-100 transition-all",
                  userButtonTrigger: "hover:opacity-80 transition-opacity"
                }
              }}
            />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-[#0F172A] truncate">
                {currentUser?.name || user?.fullName || "User"}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-medium text-[#64748B] uppercase tracking-wider">
                  {currentUser?.subscriptionTier === "interview_sprint" ? "Pro" : "Free"}
                </span>
                {currentUser?.subscriptionTier === "interview_sprint" && (
                  <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                )}
              </div>
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

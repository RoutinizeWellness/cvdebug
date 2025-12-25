import { FileText, Grid, Sparkles, Briefcase, Code, Share, DollarSign, Palette, BarChart, Users, Settings, File, LayoutTemplate, Linkedin, Mail, LogOut, Shield, LayoutDashboard } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Logo } from "@/components/Logo";
import { useNavigate } from "react-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

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

  const NavItem = ({ active, icon: Icon, label, onClick, className }: any) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
        active 
          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
          : "text-slate-400 hover:bg-slate-800 hover:text-white"
      } ${className}`}
    >
      <Icon className={`h-4 w-4 ${active ? "text-primary-foreground" : "text-slate-500 group-hover:text-white"}`} />
      {label}
    </button>
  );

  return (
    <aside className="w-72 flex-shrink-0 p-4 hidden md:block h-screen sticky top-0">
      <div className="flex h-full flex-col gap-6 rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
        {/* Header */}
        <div className="px-2">
          <Logo />
        </div>
        
        {/* Navigation */}
        <div className="flex flex-col gap-1 overflow-y-auto flex-1 pr-2 custom-scrollbar -mr-2">
          <div className="px-3 pb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Main</p>
          </div>
          
          <NavItem 
            active={currentView === 'mission'}
            icon={LayoutDashboard}
            label="Mission Control"
            onClick={() => setCurrentView('mission')}
          />

          <NavItem 
            active={currentView === 'projects'}
            icon={Briefcase}
            label="My Applications"
            onClick={() => setCurrentView('projects')}
          />

          <NavItem 
            active={currentView === 'master-cvs'}
            icon={FileText}
            label="Master CVs"
            onClick={() => setCurrentView('master-cvs')}
          />

          <div className="px-3 pt-6 pb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tools</p>
          </div>

          <NavItem 
            active={currentView === 'templates'}
            icon={LayoutTemplate}
            label="Templates"
            onClick={() => setCurrentView('templates')}
          />
          <NavItem 
            active={currentView === 'linkedin'}
            icon={Linkedin}
            label="LinkedIn Optimizer"
            onClick={() => setCurrentView('linkedin')}
          />
          <NavItem 
            active={currentView === 'cover-letter'}
            icon={Mail}
            label="Cover Letter"
            onClick={() => setCurrentView('cover-letter')}
          />

          {user?.email === "tiniboti@gmail.com" && (
            <>
              <div className="px-3 pt-6 pb-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Admin</p>
              </div>
              <NavItem 
                active={false}
                icon={Shield}
                label="Admin Panel"
                onClick={() => navigate("/admin")}
              />
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-auto space-y-4">
          <div 
            className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary to-purple-600 p-4 text-primary-foreground shadow-lg cursor-pointer group"
            onClick={() => setShowPricing(true)}
          >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-colors"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-yellow-300 fill-yellow-300 animate-pulse" />
                  <span className="font-bold text-sm">
                    {currentUser?.subscriptionTier === "interview_sprint" 
                      ? "Interview Sprint" 
                      : currentUser?.subscriptionTier === "single_scan"
                      ? "Single Scan"
                      : "Free Preview"}
                  </span>
                </div>
              </div>
              <p className="text-xs text-primary-foreground/80 mb-3 leading-relaxed">
                {currentUser?.subscriptionTier === "interview_sprint"
                  ? "Unlimited scans, AI tools & priority support"
                  : currentUser?.subscriptionTier === "single_scan"
                  ? "Full ATS analysis & formatting fixes"
                  : "Upgrade for full analysis & AI tools"}
              </p>
              <button className="w-full py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-xs font-bold rounded-lg transition-colors border border-white/10">
                {currentUser?.subscriptionTier === "free" || !currentUser?.subscriptionTier ? "View Plans" : "Upgrade Plan"}
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between px-2 pt-2 border-t border-slate-800">
            <UserButton 
              showName={true}
              appearance={{
                elements: {
                  userButtonBox: "flex flex-row-reverse gap-2",
                  userButtonOuterIdentifier: "text-sm font-bold text-slate-200",
                  avatarBox: "h-9 w-9 border-2 border-slate-700"
                }
              }}
            />
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-500 hover:bg-slate-800" onClick={() => signOut()}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
import { Terminal, LayoutDashboard, Briefcase, FileText, Bot, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";

interface SidebarProps {
  userName?: string;
  userPlan?: string;
  userAvatar?: string;
  onLogout?: () => void;
}

export function Sidebar({
  userName = "Alex Chen",
  userPlan = "PRO PLAN",
  userAvatar,
  onLogout,
}: SidebarProps) {
  const navigate = useNavigate();

  const navItems = [
    { icon: LayoutDashboard, label: "Mission Control", href: "/dashboard", active: true },
    { icon: Briefcase, label: "My Jobs", href: "/dashboard/projects", active: false },
    { icon: FileText, label: "Master CVs", href: "/dashboard/resumes", active: false },
    { icon: Bot, label: "AI Tools", href: "/dashboard/tools", active: false },
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r border-[#E2E8F0] bg-[#F8FAFC] hidden md:flex flex-col">
      <div className="h-full flex flex-col justify-between p-4">
        <div className="flex flex-col gap-6">
          {/* Logo Area */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 px-2 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            <Logo iconClassName="h-10 w-auto" />
            <div className="flex flex-col">
              <p className="text-[#64748B] text-xs font-mono pt-1">v2.4.0 stable</p>
            </div>
          </motion.div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item, index) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => navigate(item.href)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                  item.active
                    ? "bg-[#FFFFFF] border border-[#E2E8F0]/50"
                    : "hover:bg-[#F8FAFC]/50"
                }`}
              >
                <item.icon
                  className={`h-5 w-5 transition-colors ${
                    item.active
                      ? "text-primary"
                      : "text-[#64748B] group-hover:text-[#0F172A]"
                  }`}
                />
                <p
                  className={`text-sm font-medium ${
                    item.active ? "text-[#0F172A]" : "text-[#475569]"
                  }`}
                >
                  {item.label}
                </p>
              </motion.button>
            ))}
          </nav>
        </div>

        {/* User Profile & Logout */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col gap-3"
        >
          <div className="glass-panel p-3 rounded-lg flex items-center gap-3">
            <div
              className="h-8 w-8 rounded-full bg-cover bg-center border border-slate-600"
              style={{
                backgroundImage: userAvatar
                  ? `url(${userAvatar})`
                  : "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA63R0GaDQ0d2ub4_OqCWAUSbQh23ccp7ILxN_qXaRGV17KBBxi9Ybg9ds8ukAM2YenIloBWe0OFpq_lA1UsP9iCm47Q72R6plcA1xFpDH-l4s4BeEzwZlXdf0lnVSVRmwzRzoMk1r3D_cJ2INRK7gSFI1y7ekZ0ck7oVDvwtccToE_7lxhBho8Dh1siAohoiFqvOGUeIblAXmH2_mx6QZDT4pjBEqW0HacUWQ0wsiDLy9v4UHDAiE60TK8pg7LavpCu7YHSd3vTQ')",
              }}
            ></div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-semibold text-[#0F172A] truncate">{userName}</span>
              <span className="text-[10px] text-[#64748B] font-mono truncate">{userPlan}</span>
            </div>
          </div>
          <Button
            onClick={onLogout}
            variant="outline"
            className="flex w-full items-center justify-center gap-2 rounded-lg h-9 px-4 border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#475569] hover:text-[#0F172A] text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Log Out</span>
          </Button>
        </motion.div>
      </div>
    </aside>
  );
}

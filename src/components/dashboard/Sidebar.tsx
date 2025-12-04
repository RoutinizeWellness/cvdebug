import { FileText, Grid, Sparkles, Briefcase, Code, Share, DollarSign, Palette, BarChart, Users, Settings, File, LayoutTemplate, Linkedin, Mail } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";

interface SidebarProps {
  categoryFilter: string | null;
  setCategoryFilter: (category: string | null) => void;
  setShowPricing: (show: boolean) => void;
  currentView: string;
  setCurrentView: (view: string) => void;
}

export function Sidebar({ categoryFilter, setCategoryFilter, setShowPricing, currentView, setCurrentView }: SidebarProps) {
  const categories = [
    { id: "Engineering", label: "Engineering", icon: Code },
    { id: "Marketing", label: "Marketing", icon: Share },
    { id: "Sales", label: "Sales", icon: DollarSign },
    { id: "Design", label: "Design", icon: Palette },
    { id: "Product", label: "Product", icon: Briefcase },
    { id: "Finance", label: "Finance", icon: BarChart },
    { id: "HR", label: "HR", icon: Users },
    { id: "Operations", label: "Operations", icon: Settings },
    { id: "Other", label: "Other", icon: File },
  ];

  return (
    <aside className="w-64 flex-shrink-0 p-4 hidden md:block">
      <div className="sticky top-4 flex h-[calc(100vh-2rem)] flex-col gap-4 rounded-xl border border-white/10 bg-card/50 p-4 backdrop-blur-lg">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center shadow-sm">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-foreground text-base font-bold leading-normal tracking-tight">Resume ATS</h1>
            <p className="text-muted-foreground text-xs font-medium leading-normal">Optimizer</p>
          </div>
        </div>
        
        <div className="flex flex-col gap-2 mt-6 overflow-y-auto flex-1 pr-2 custom-scrollbar">
          <div 
            className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium cursor-pointer transition-colors ${currentView === 'resumes' && !categoryFilter ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
            onClick={() => {
              setCurrentView('resumes');
              setCategoryFilter(null);
            }}
          >
            <Grid className="h-4 w-4" />
            <p className="text-sm leading-normal">All Resumes</p>
          </div>

          <div className="pt-4 pb-2">
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tools</p>
          </div>

          <div 
            className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${currentView === 'templates' ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
            onClick={() => setCurrentView('templates')}
          >
            <LayoutTemplate className="h-4 w-4" />
            <p className="text-sm font-medium leading-normal">Templates</p>
          </div>

          <div 
            className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${currentView === 'linkedin' ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
            onClick={() => setCurrentView('linkedin')}
          >
            <Linkedin className="h-4 w-4" />
            <p className="text-sm font-medium leading-normal">LinkedIn Optimizer</p>
          </div>

          <div 
            className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${currentView === 'cover-letter' ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
            onClick={() => setCurrentView('cover-letter')}
          >
            <Mail className="h-4 w-4" />
            <p className="text-sm font-medium leading-normal">Cover Letter</p>
          </div>
          
          <div className="pt-4 pb-2">
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Job Categories</p>
          </div>
          
          {categories.map((cat) => (
            <div 
              key={cat.id}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${currentView === 'resumes' && categoryFilter === cat.id ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
              onClick={() => {
                setCurrentView('resumes');
                setCategoryFilter(cat.id);
              }}
            >
              <cat.icon className="h-4 w-4" />
              <p className="text-sm font-medium leading-normal">{cat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-2">
          <div 
            className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 rounded-xl p-4 cursor-pointer hover:border-primary/30 transition-colors group"
            onClick={() => setShowPricing(true)}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <span className="font-bold text-sm">Upgrade to Pro</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">Get unlimited scans and detailed AI feedback.</p>
            <button className="w-full py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-lg shadow-sm">
              Upgrade Now
            </button>
          </div>
        </div>
        
        <div className="mt-auto flex flex-col gap-1">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">
            <UserButton 
              showName={true}
              appearance={{
                elements: {
                  userButtonBox: "flex flex-row-reverse",
                  userButtonOuterIdentifier: "text-sm font-medium text-foreground",
                }
              }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
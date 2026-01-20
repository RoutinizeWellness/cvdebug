import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Plus, Search, MoreHorizontal, CheckCircle, AlertTriangle, AlertCircle, Clock } from "lucide-react";
import { useState } from "react";
import { CreateProjectDialog } from "./CreateProjectDialog";
import { PricingDialog } from "@/components/PricingDialog";
import { Id, Doc } from "@/convex/_generated/dataModel";
import { useNavigate } from "react-router";

interface ProjectsViewProps {
  onSelectProject: (id: Id<"projects">) => void;
}

export function ProjectsView({ onSelectProject }: ProjectsViewProps) {
  const navigate = useNavigate();
  const projects = useQuery(api.projects.getProjects, { status: "active" });
  const user = useQuery((api as any).users.currentUser);
  const isPaidUser = user?.subscriptionTier === "single_scan" || user?.subscriptionTier === "interview_sprint";
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showPricingDialog, setShowPricingDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "high" | "review" | "archived">("all");

  const getScoreGradient = (score: number) => {
    if (score >= 80) return `conic-gradient(#3B82F6 ${score}%, #334155 0)`;
    if (score >= 60) return `conic-gradient(#8B5CF6 ${score}%, #334155 0)`;
    if (score >= 40) return `conic-gradient(#F59E0B ${score}%, #334155 0)`;
    return `conic-gradient(#EF4444 ${score}%, #334155 0)`;
  };

  const getHealthStatus = (project: Doc<"projects">) => {
    const status = project.healthStatus || 'healthy';
    const score = (project as any).globalScore || 0;
    
    if (status === 'healthy' && score >= 80) {
      return {
        label: "Stable",
        color: "text-emerald-400",
        bgColor: "bg-[#22C55E]/10",
        borderColor: "border-emerald-500/20",
        icon: CheckCircle
      };
    } else if (status === 'warning' || (score >= 40 && score < 80)) {
      return {
        label: "Needs Review",
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/10",
        borderColor: "border-yellow-500/20",
        icon: AlertTriangle
      };
    }
    return {
      label: "Missing Data",
      color: "text-red-400",
      bgColor: "bg-[#EF4444]/10",
      borderColor: "border-red-500/20",
      icon: AlertCircle
    };
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "High Priority";
    if (score >= 60) return "Strong";
    if (score >= 40) return "Moderate";
    return "Low";
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return `${Math.floor(days / 7)}w ago`;
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="hidden md:flex items-center bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg px-3 py-2 w-full sm:w-64 focus-within:ring-1 focus-within:ring-primary transition-all shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
            <Search className="h-4 w-4 text-[#64748B]" />
            <input
              className="bg-transparent border-none text-sm text-[#0F172A] placeholder-slate-500 focus:ring-0 w-full ml-2 p-0 h-auto outline-none"
              placeholder="Search projects, tags..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <Button 
          onClick={() => navigate("/onboarding")}
          className="bg-gradient-to-r from-primary to-secondary hover:brightness-110 text-[#0F172A] font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5 flex items-center gap-2"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Upload New Master CV
        </Button>
      </div>

      {/* Filters & Sort */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              filterStatus === "all"
                ? "bg-[#FFFFFF] text-[#0F172A] border-slate-900"
                : "bg-[#FFFFFF] text-[#64748B] border-[#E2E8F0] hover:text-[#0F172A] hover:border-[#E2E8F0]"
            }`}
          >
            All Projects
          </button>
          <button
            onClick={() => setFilterStatus("high")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              filterStatus === "high"
                ? "bg-[#FFFFFF] text-[#0F172A] border-slate-900"
                : "bg-[#FFFFFF] text-[#64748B] border-[#E2E8F0] hover:text-[#0F172A] hover:border-[#E2E8F0]"
            }`}
          >
            High Match
          </button>
          <button
            onClick={() => setFilterStatus("review")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              filterStatus === "review"
                ? "bg-[#FFFFFF] text-[#0F172A] border-slate-900"
                : "bg-[#FFFFFF] text-[#64748B] border-[#E2E8F0] hover:text-[#0F172A] hover:border-[#E2E8F0]"
            }`}
          >
            Needs Review
          </button>
          <button
            onClick={() => setFilterStatus("archived")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              filterStatus === "archived"
                ? "bg-[#FFFFFF] text-[#0F172A] border-slate-900"
                : "bg-[#FFFFFF] text-[#64748B] border-[#E2E8F0] hover:text-[#0F172A] hover:border-[#E2E8F0]"
            }`}
          >
            Archived
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm text-[#64748B]">
          <span>Sort by:</span>
          <button className="flex items-center gap-1 font-medium text-[#0F172A] hover:text-primary transition-colors">
            Last Updated
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      {projects === undefined ? (
        <div className="text-center py-12 text-[#64748B]">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 bg-[#FFFFFF] border-2 border-dashed border-[#E2E8F0] rounded-2xl">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#E2E8F0]">
            <Plus className="h-8 w-8 text-[#64748B]" />
          </div>
          <h3 className="text-xl font-bold text-[#0F172A] mb-2">No projects yet</h3>
          <p className="text-[#64748B] max-w-sm mx-auto mb-6">
            Create your first project to start tracking applications and optimizing your resume.
          </p>
          <Button
            onClick={() => isPaidUser ? setShowCreateDialog(true) : setShowPricingDialog(true)}
            className="bg-gradient-to-r from-primary to-secondary hover:brightness-110 text-[#0F172A] font-semibold relative"
          >
            Create Your First Project
            {!isPaidUser && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center">
                <span className="material-symbols-outlined text-[12px] text-amber-500">lock</span>
              </span>
            )}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project: Doc<"projects">) => {
            const health = getHealthStatus(project);
            const score = (project as any).globalScore || 0;
            const HealthIcon = health.icon;

            return (
              <div
                key={project._id}
                onClick={() => onSelectProject(project._id)}
                className="group relative bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary p-0.5 flex items-center justify-center">
                      <div className="w-full h-full bg-[#FFFFFF] rounded-lg flex items-center justify-center">
                        <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-[#0F172A] font-bold text-base leading-tight">{project.name}</h3>
                      <p className="text-[#64748B] text-sm">@ {project.targetRole}</p>
                    </div>
                  </div>
                  <button
                    className="text-[#64748B] hover:text-[#0F172A] transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>

                {/* Score Section */}
                <div className="flex items-center justify-between bg-[#F8FAFC] rounded-lg p-3 mb-4 border border-[#E2E8F0]">
                  <div className="flex items-center gap-3">
                    {/* Circular Progress */}
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <div
                        className="w-full h-full rounded-full p-[3px]"
                        style={{ background: getScoreGradient(score) }}
                      >
                        <div className="w-full h-full bg-[#FFFFFF] rounded-full flex items-center justify-center">
                          <span className="text-[#0F172A] text-xs font-bold font-mono">{score}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[#64748B] text-xs">Match Score</span>
                      <span className="text-[#0F172A] text-sm font-semibold">{getScoreLabel(score)}</span>
                    </div>
                  </div>
                  <div className={`px-2.5 py-1 rounded-md ${health.bgColor} border ${health.borderColor} ${health.color} text-xs font-medium flex items-center gap-1`}>
                    <HealthIcon className="h-3.5 w-3.5" />
                    {health.label}
                  </div>
                </div>

                {/* Tags & Footer */}
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {project.description && project.description.split(',').slice(0, 3).map((tag, i) => (
                      <span key={i} className="px-2 py-1 rounded-md bg-slate-100 text-[#475569] text-xs font-mono border border-[#E2E8F0]">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0]">
                    <span className="text-[#64748B] text-xs flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {formatTimeAgo(project._creationTime)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProject(project._id);
                      }}
                      className="text-sm font-medium text-primary hover:text-[#0F172A] transition-colors"
                    >
                      Open Project Board
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* New Project Card */}
          <div
            onClick={() => isPaidUser ? setShowCreateDialog(true) : setShowPricingDialog(true)}
            className="bg-[#FFFFFF] rounded-xl border-2 border-dashed border-[#E2E8F0] p-5 flex flex-col items-center justify-center gap-4 text-center cursor-pointer hover:border-primary hover:bg-[#F8FAFC] transition-all group min-h-[250px] relative"
          >
            {!isPaidUser && (
              <span className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center bg-amber-50 rounded-full border border-amber-200">
                <span className="material-symbols-outlined text-[16px] text-amber-600">lock</span>
              </span>
            )}
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-primary transition-colors border border-[#E2E8F0]">
              <Plus className="h-8 w-8 text-[#64748B] group-hover:text-[#0F172A]" />
            </div>
            <div>
              <h3 className="text-[#0F172A] font-bold text-lg">Create New Project</h3>
              <p className="text-[#64748B] text-sm mt-1 max-w-[200px] mx-auto">
                Start a new mission or upload a CV to analyze.
              </p>
            </div>
          </div>
        </div>
      )}

      <CreateProjectDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
      <PricingDialog
        open={showPricingDialog}
        onOpenChange={setShowPricingDialog}
      />
    </div>
  );
}
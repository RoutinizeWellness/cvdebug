import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, MoreHorizontal, CheckCircle, AlertCircle, AlertTriangle, Sparkles } from "lucide-react";
import { useState } from "react";
import { CreateProjectDialog } from "./CreateProjectDialog";
import { Id, Doc } from "@/convex/_generated/dataModel";

interface ProjectsViewProps {
  onSelectProject: (id: Id<"projects">) => void;
}

export function ProjectsView({ onSelectProject }: ProjectsViewProps) {
  const projects = useQuery(api.projects.getProjects, { status: "active" });
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "high" | "review" | "archived">("all");

  const getScoreColor = (score: number) => {
    if (score >= 80) return "from-blue-500 to-blue-600";
    if (score >= 60) return "from-purple-500 to-purple-600";
    if (score >= 40) return "from-yellow-500 to-yellow-600";
    return "from-red-500 to-red-600";
  };

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
        bgColor: "bg-emerald-500/10",
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
      bgColor: "bg-red-500/10",
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

  return (
    <div className="space-y-6">
      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              filterStatus === "all"
                ? "bg-slate-800 text-white border-slate-700"
                : "bg-transparent text-slate-400 border-slate-800 hover:text-white hover:border-slate-600"
            }`}
          >
            All Projects
          </button>
          <button
            onClick={() => setFilterStatus("high")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              filterStatus === "high"
                ? "bg-slate-800 text-white border-slate-700"
                : "bg-transparent text-slate-400 border-slate-800 hover:text-white hover:border-slate-600"
            }`}
          >
            High Match
          </button>
          <button
            onClick={() => setFilterStatus("review")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              filterStatus === "review"
                ? "bg-slate-800 text-white border-slate-700"
                : "bg-transparent text-slate-400 border-slate-800 hover:text-white hover:border-slate-600"
            }`}
          >
            Needs Review
          </button>
          <button
            onClick={() => setFilterStatus("archived")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              filterStatus === "archived"
                ? "bg-slate-800 text-white border-slate-700"
                : "bg-transparent text-slate-400 border-slate-800 hover:text-white hover:border-slate-600"
            }`}
          >
            Archived
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span>Sort by:</span>
          <button className="flex items-center gap-1 font-medium text-white hover:text-blue-400 transition-colors">
            Last Updated
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      {projects === undefined ? (
        <div className="text-center py-12 text-zinc-500">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/50 border-2 border-dashed border-slate-700 rounded-2xl">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="h-8 w-8 text-slate-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No projects yet</h3>
          <p className="text-slate-400 max-w-sm mx-auto mb-6">
            Create your first project to start tracking applications and optimizing your resume.
          </p>
          <Button 
            onClick={() => setShowCreateDialog(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold"
          >
            Create Your First Project
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
                className="group relative bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-lg hover:border-blue-500/50 hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 p-0.5 flex items-center justify-center">
                      <div className="w-full h-full bg-slate-900 rounded-lg flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-blue-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-base leading-tight">{project.name}</h3>
                      <p className="text-slate-400 text-sm">@ {project.targetRole}</p>
                    </div>
                  </div>
                  <button 
                    className="text-slate-500 hover:text-white transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>

                {/* Score Section */}
                <div className="flex items-center justify-between bg-slate-950/50 rounded-lg p-3 mb-4 border border-slate-800/50">
                  <div className="flex items-center gap-3">
                    {/* Circular Progress */}
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <div 
                        className="w-full h-full rounded-full p-[3px]"
                        style={{ background: getScoreGradient(score) }}
                      >
                        <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold font-mono">{score}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-400 text-xs">Match Score</span>
                      <span className="text-white text-sm font-semibold">{getScoreLabel(score)}</span>
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
                      <span key={i} className="px-2 py-1 rounded-md bg-slate-800 text-slate-300 text-xs font-mono border border-slate-700">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <span className="text-slate-500 text-xs flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {new Date(project._creationTime).toLocaleDateString()}
                    </span>
                    <button className="text-sm font-medium text-blue-400 hover:text-white transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* New Project Card */}
          <div 
            onClick={() => setShowCreateDialog(true)}
            className="bg-slate-900/50 rounded-xl border-2 border-dashed border-slate-700 p-5 flex flex-col items-center justify-center gap-4 text-center cursor-pointer hover:border-blue-500 hover:bg-slate-800 transition-all group min-h-[250px]"
          >
            <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
              <Plus className="h-8 w-8 text-slate-400 group-hover:text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Create New Project</h3>
              <p className="text-slate-500 text-sm mt-1 max-w-[200px] mx-auto">
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
    </div>
  );
}
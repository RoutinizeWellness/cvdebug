import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, FolderOpen, Search, Filter, ArrowUpDown, MoreHorizontal, TrendingUp, Send, Target, Calendar, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
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

  // Calculate stats from projects with real data
  const totalApplications = projects?.reduce((sum: number, p: Doc<"projects">) => {
    // Count actual applications from the applications table
    return sum + ((p as any).applicationCount || 0);
  }, 0) || 0;
  
  const avgScore = projects?.length 
    ? Math.round(projects.reduce((sum: number, p: Doc<"projects">) => {
        // Use actual global score from project
        return sum + ((p as any).globalScore || 0);
      }, 0) / projects.length) 
    : 0;
    
  const totalInterviews = projects?.reduce((sum: number, p: Doc<"projects">) => {
    // Count applications in "interviewing" status
    return sum + ((p as any).interviewCount || 0);
  }, 0) || 0;

  // Calculate trends based on recent activity (last 7 days vs previous 7 days)
  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  const fourteenDaysAgo = now - 14 * 24 * 60 * 60 * 1000;
  
  const recentProjects = projects?.filter((p: Doc<"projects">) => p._creationTime >= sevenDaysAgo) || [];
  const previousProjects = projects?.filter((p: Doc<"projects">) => 
    p._creationTime >= fourteenDaysAgo && p._creationTime < sevenDaysAgo
  ) || [];
  
  const recentApps = recentProjects.reduce((sum: number, p: Doc<"projects">) => sum + ((p as any).applicationCount || 0), 0);
  const previousApps = previousProjects.reduce((sum: number, p: Doc<"projects">) => sum + ((p as any).applicationCount || 0), 0);
  
  const appTrend = previousApps > 0 ? Math.round(((recentApps - previousApps) / previousApps) * 100) : (recentApps > 0 ? 100 : 0);
  
  const recentAvgScore = recentProjects.length > 0
    ? Math.round(recentProjects.reduce((sum: number, p: Doc<"projects">) => sum + ((p as any).globalScore || 0), 0) / recentProjects.length)
    : 0;
  const previousAvgScore = previousProjects.length > 0
    ? Math.round(previousProjects.reduce((sum: number, p: Doc<"projects">) => sum + ((p as any).globalScore || 0), 0) / previousProjects.length)
    : 0;
  
  const scoreTrend = previousAvgScore > 0 ? Math.round(((recentAvgScore - previousAvgScore) / previousAvgScore) * 100) : (recentAvgScore > 0 ? 100 : 0);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-primary";
    if (score >= 60) return "text-orange-400";
    return "text-rose-500";
  };

  const getHealthStatus = (project: Doc<"projects">) => {
    const status = project.healthStatus || 'healthy';
    if (status === 'healthy') {
      return {
        label: "Valid",
        color: "text-emerald-500",
        bgColor: "bg-emerald-500",
        icon: CheckCircle
      };
    } else if (status === 'warning') {
      return {
        label: "Warning",
        color: "text-orange-400",
        bgColor: "bg-orange-400",
        icon: AlertCircle
      };
    }
    return {
      label: "Error",
      color: "text-rose-500",
      bgColor: "bg-rose-500",
      icon: AlertCircle
    };
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return Sparkles;
    if (score >= 80) return CheckCircle;
    return AlertCircle;
  };

  return (
    <div className="space-y-8">
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <span className="hover:text-primary transition-colors cursor-pointer">Dashboard</span>
          <span className="text-zinc-600">/</span>
          <span className="text-white font-medium">All Projects</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">All Projects</h2>
            <p className="text-zinc-500">Manage and track your job search campaigns</p>
          </div>
          <Button 
            onClick={() => setShowCreateDialog(true)}
            className="bg-primary hover:bg-primary/90 text-white font-bold h-11 px-6 rounded-lg shadow-[0_0_20px_-5px_rgba(124,59,237,0.5)] hover:shadow-[0_0_25px_-5px_rgba(124,59,237,0.7)] transition-all group"
          >
            <Plus className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
            Create New Project
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1 p-6 rounded-xl border border-zinc-800 bg-zinc-900/80 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-zinc-400 text-sm font-medium">Total Applications</p>
            <Send className="h-5 w-5 text-zinc-600" />
          </div>
          <div className="flex items-end gap-3 mt-2">
            <p className="text-3xl font-bold text-white">{totalApplications}</p>
            {appTrend > 0 && (
              <span className="text-emerald-500 text-sm font-semibold mb-1 flex items-center">
                <TrendingUp className="h-4 w-4" />
                {appTrend}%
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1 p-6 rounded-xl border border-zinc-800 bg-zinc-900/80 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-zinc-400 text-sm font-medium">Avg Global Score</p>
            <Target className="h-5 w-5 text-zinc-600" />
          </div>
          <div className="flex items-end gap-3 mt-2">
            <p className="text-3xl font-bold text-white">{avgScore}%</p>
            {scoreTrend > 0 && (
              <span className="text-emerald-500 text-sm font-semibold mb-1 flex items-center">
                <TrendingUp className="h-4 w-4" />
                {scoreTrend}%
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1 p-6 rounded-xl border border-zinc-800 bg-zinc-900/80 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-zinc-400 text-sm font-medium">Interviews</p>
            <Calendar className="h-5 w-5 text-zinc-600" />
          </div>
          <div className="flex items-end gap-3 mt-2">
            <p className="text-3xl font-bold text-white">{totalInterviews}</p>
            {totalInterviews > 0 && (
              <span className="text-emerald-500 text-sm font-semibold mb-1 flex items-center">
                <Plus className="h-4 w-4" />
                {Math.min(totalInterviews, 3)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-zinc-400 group-focus-within:text-primary transition-colors" />
          </div>
          <Input
            className="pl-10 pr-3 py-3 border-zinc-800 bg-zinc-900/80 text-white placeholder-zinc-400 focus:ring-1 focus:ring-primary focus:border-primary rounded-xl shadow-sm"
            placeholder="Search projects by name or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          className="px-5 py-3 border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:bg-zinc-800 rounded-xl font-medium shadow-sm"
        >
          <Filter className="h-5 w-5 mr-2" />
          Filters
        </Button>
        <Button
          variant="outline"
          className="px-5 py-3 border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:bg-zinc-800 rounded-xl font-medium shadow-sm"
        >
          <ArrowUpDown className="h-5 w-5 mr-2" />
          Sort
        </Button>
      </div>

      {/* Projects Bento Grid */}
      {projects === undefined ? (
        <div className="text-center py-12 text-zinc-500">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/50 border border-zinc-800 rounded-2xl border-dashed">
          <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="h-8 w-8 text-zinc-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No projects yet</h3>
          <p className="text-zinc-500 max-w-sm mx-auto mb-6">
            Create a project to track your applications and organize your job search.
          </p>
          <Button 
            onClick={() => setShowCreateDialog(true)}
            variant="outline"
            className="border-zinc-700 text-white hover:bg-zinc-800"
          >
            Create Your First Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-10">
          {projects.map((project: Doc<"projects">) => {
            const health = getHealthStatus(project);
            const score = (project as any).globalScore || 0;
            const ScoreIcon = getScoreIcon(score);
            const scorePercentage = Math.min(100, Math.max(0, score));

            return (
              <div 
                key={project._id}
                onClick={() => onSelectProject(project._id)}
                className="group relative flex flex-col justify-between p-6 rounded-xl border border-zinc-800 bg-zinc-900/80 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 cursor-pointer"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                      {project.name}
                    </h3>
                    <div className="inline-flex">
                      <span className="px-2.5 py-1 rounded-md bg-zinc-800 border border-zinc-700 text-xs font-semibold text-zinc-300">
                        {project.targetRole}
                      </span>
                    </div>
                  </div>
                  <button 
                    className="text-zinc-400 hover:text-white transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  {/* CV Health Row */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-black/50 border border-zinc-800">
                    <span className="text-xs font-medium text-zinc-400">Master CV Health</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${health.color}`}>{health.label}</span>
                      <div className="relative flex h-2.5 w-2.5">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${health.bgColor} opacity-75`}></span>
                        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${health.bgColor} shadow-[0_0_8px_rgba(124,59,237,0.6)]`}></span>
                      </div>
                    </div>
                  </div>

                  {/* Metrics Row */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-zinc-400">Applications</span>
                      <div className="flex items-center gap-2">
                        <FolderOpen className="h-[18px] w-[18px] text-zinc-300" />
                        <span className="text-lg font-bold text-white">{(project as any).applicationCount || 0}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs text-zinc-400">Global Score</p>
                        <p className={`text-sm font-bold ${getScoreColor(score)}`}>{score}%</p>
                      </div>
                      {/* Circular Progress */}
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center relative"
                        style={{
                          background: `conic-gradient(${score >= 80 ? '#7c3bed' : score >= 60 ? '#fb923c' : '#f43f5e'} ${scorePercentage}%, #27272a 0)`
                        }}
                      >
                        <div className="w-10 h-10 rounded-full bg-zinc-900 absolute"></div>
                        <ScoreIcon className={`relative z-10 h-5 w-5 ${getScoreColor(score)}`} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* New Project Card */}
          <div 
            onClick={() => setShowCreateDialog(true)}
            className="group relative flex flex-col items-center justify-center p-6 rounded-xl border border-dashed border-zinc-700 bg-zinc-900/30 hover:bg-zinc-900/50 hover:border-primary transition-all duration-300 cursor-pointer min-h-[260px]"
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="h-14 w-14 rounded-full bg-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                <Plus className="h-8 w-8 text-zinc-500 group-hover:text-primary transition-colors" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">New Campaign</h3>
                <p className="text-sm text-zinc-400 max-w-[200px] mt-1">
                  Start a new job hunt with a tailored resume.
                </p>
              </div>
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
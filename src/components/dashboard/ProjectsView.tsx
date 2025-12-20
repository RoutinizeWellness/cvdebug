import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Plus, FolderOpen, ArrowRight, LayoutTemplate, Target } from "lucide-react";
import { useState } from "react";
import { CreateProjectDialog } from "./CreateProjectDialog";
import { ProjectBoard } from "./ProjectBoard";
import { Id, Doc } from "@/convex/_generated/dataModel";

export function ProjectsView() {
  const projects = useQuery(api.projects.getProjects, { status: "active" });
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<Id<"projects"> | null>(null);

  if (selectedProjectId) {
    const project = projects?.find((p: Doc<"projects">) => p._id === selectedProjectId);
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedProjectId(null)}
              className="text-zinc-400 hover:text-white"
            >
              ← Back to Projects
            </Button>
            <div className="h-6 w-px bg-zinc-800" />
            <div>
              <h2 className="text-2xl font-bold text-white">{project?.name}</h2>
              <p className="text-sm text-zinc-500">{project?.targetRole}</p>
            </div>
          </div>
          <Button className="bg-primary text-black hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Application
          </Button>
        </div>
        <div className="flex-1 overflow-hidden">
          <ProjectBoard projectId={selectedProjectId} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Project Hub</h2>
          <p className="text-zinc-500">Manage your job search campaigns</p>
        </div>
        <Button 
          onClick={() => setShowCreateDialog(true)}
          className="bg-primary text-black hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {projects === undefined ? (
        <div className="text-center py-12 text-zinc-500">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 bg-[#0A0A0A] border border-zinc-800 rounded-2xl border-dashed">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project: Doc<"projects">) => (
            <div 
              key={project._id}
              onClick={() => setSelectedProjectId(project._id)}
              className="group bg-[#0A0A0A] border border-zinc-800 hover:border-primary/50 rounded-xl p-6 cursor-pointer transition-all hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <Target className="h-5 w-5" />
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  project.healthStatus === 'healthy' ? 'bg-green-500/10 text-green-500' : 
                  project.healthStatus === 'warning' ? 'bg-yellow-500/10 text-yellow-500' : 
                  'bg-red-500/10 text-red-500'
                }`}>
                  {project.healthStatus?.toUpperCase() || 'HEALTHY'}
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">
                {project.name}
              </h3>
              <p className="text-sm text-zinc-500 mb-4">{project.targetRole}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                <span className="text-xs text-zinc-500">
                  Last active {new Date(project._creationTime).toLocaleDateString()}
                </span>
                <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateProjectDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog} 
      />
    </div>
  );
}
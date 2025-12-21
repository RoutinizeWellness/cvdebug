import { FileText, Loader2, Eye, Trash2, RefreshCw, MoreVertical, Plus, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ResumeGridProps {
  resumes: any[] | undefined;
  setSelectedResume: (resume: any) => void;
  handleDelete: (id: any) => void;
  categoryFilter?: string | null;
  onUpload?: () => void;
  onCreateProject?: () => void;
}

export function ResumeGrid({ resumes, setSelectedResume, handleDelete, categoryFilter, onUpload, onCreateProject }: ResumeGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  if (resumes === undefined) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium animate-pulse">Loading your resumes...</p>
      </div>
    );
  }

  const filteredResumes = resumes.filter(resume => 
    searchQuery === "" || 
    resume.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resume.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getHealthBadge = (score: number, status: string) => {
    if (status === 'processing') {
      return (
        <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-700/20 text-slate-400 border border-slate-700/30">
          <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
          Analyzing...
        </div>
      );
    }
    
    if (status === 'failed') {
      return (
        <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/20">
          <span className="mr-1.5 text-[8px]">●</span>
          Error
        </div>
      );
    }

    if (score >= 80) {
      return (
        <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          <span className="mr-1.5 text-[8px]">●</span>
          {score}% Excellent
        </div>
      );
    } else if (score >= 50) {
      return (
        <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
          <span className="mr-1.5 text-[8px]">●</span>
          {score}% Moderate
        </div>
      );
    } else {
      return (
        <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/20">
          <span className="mr-1.5 text-[8px]">●</span>
          {score}% Critical
        </div>
      );
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType === 'application/pdf') {
      return <FileText className="h-5 w-5 text-red-500" />;
    }
    return <FileText className="h-5 w-5 text-blue-500" />;
  };

  const getFileSize = (url: string) => {
    // Mock file size - in production, this would come from storage metadata
    return "2.4 MB";
  };

  if (filteredResumes.length === 0 && searchQuery === "") {
    return (
      <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-border rounded-3xl bg-muted/10">
        <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-6 shadow-inner">
          <FileText className="h-10 w-10 text-muted-foreground/50" />
        </div>
        <h3 className="text-xl font-bold mb-2">No resumes found</h3>
        <p className="text-muted-foreground max-w-sm text-center mb-8">
          Upload your resume to get an instant ATS score and AI-powered feedback.
        </p>
        <div className="flex gap-3">
          {onUpload && (
            <Button onClick={onUpload} className="font-bold">
              <Plus className="h-4 w-4 mr-2" />
              Upload Resume
            </Button>
          )}
          {onCreateProject && (
            <Button onClick={onCreateProject} variant="outline" className="font-bold">
              <FolderPlus className="h-4 w-4 mr-2" />
              Create Project
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-20">
      {/* Header & Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Search */}
        <div className="relative w-full lg:w-96">
          <Input
            type="text"
            placeholder="Search resumes by name, skill, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
          />
          <Eye className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {onCreateProject && (
            <Button
              onClick={onCreateProject}
              className="bg-primary text-white font-bold hover:bg-primary/90"
            >
              <FolderPlus className="h-4 w-4 mr-2" />
              Create Project
            </Button>
          )}
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="font-medium"
          >
            List View
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="font-medium"
          >
            Grid View
          </Button>
        </div>
      </div>

      {/* Table View */}
      {viewMode === "list" ? (
        <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/30">
          <table className="min-w-full divide-y divide-zinc-800">
            <thead className="bg-zinc-900">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Resume Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider hidden sm:table-cell">
                  Upload Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider hidden md:table-cell">
                  Last Analyzed
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Health Score
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 bg-transparent">
              {filteredResumes.map((resume) => (
                <tr key={resume._id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-zinc-800">
                        {getFileIcon(resume.mimeType)}
                      </div>
                      <div className="ml-4">
                        <div 
                          className="text-sm font-medium text-white group-hover:text-primary transition-colors cursor-pointer"
                          onClick={() => setSelectedResume(resume)}
                        >
                          {resume.title}
                        </div>
                        <div className="text-xs text-zinc-500">
                          {getFileSize(resume.url)} • {resume.mimeType === 'application/pdf' ? 'PDF' : 'DOCX'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400 font-mono hidden sm:table-cell">
                    {formatDate(resume._creationTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300 font-mono hidden md:table-cell">
                    {resume.status === 'completed' ? (
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        Just now
                      </span>
                    ) : resume.status === 'processing' ? (
                      '--'
                    ) : (
                      formatDate(resume._creationTime)
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getHealthBadge(resume.score || 0, resume.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setSelectedResume(resume)}
                        className="text-zinc-400 hover:text-white p-1.5 hover:bg-white/10 rounded-md transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setSelectedResume(resume)}
                        className="text-primary hover:text-primary/80 p-1.5 hover:bg-primary/10 rounded-md transition-colors"
                        title="Re-Analyze"
                        disabled={resume.status === 'processing'}
                      >
                        <RefreshCw className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(resume._id);
                        }}
                        className="text-rose-500 hover:text-rose-400 p-1.5 hover:bg-rose-500/10 rounded-md transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800">
            <div className="text-sm text-zinc-500">
              Showing <span className="font-medium text-zinc-300">1</span> to{" "}
              <span className="font-medium text-zinc-300">{Math.min(filteredResumes.length, 10)}</span> of{" "}
              <span className="font-medium text-zinc-300">{filteredResumes.length}</span> results
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled
                className="text-zinc-400 bg-zinc-900 border-zinc-800"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={filteredResumes.length <= 10}
                className="text-zinc-400 bg-zinc-900 border-zinc-800"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // Grid View (existing implementation)
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredResumes.map((resume) => (
            <motion.div 
              key={resume._id} 
              className="group relative flex flex-col rounded-2xl border-2 border-zinc-700 bg-zinc-900/80 shadow-lg overflow-hidden cursor-pointer"
              onClick={() => setSelectedResume(resume)}
              whileHover={{ 
                y: -4, 
                borderColor: "rgba(163, 127, 188, 0.7)",
                backgroundColor: "rgba(39, 39, 42, 0.9)",
                boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.5)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Preview Area */}
              <div className="relative w-full aspect-[3/4] bg-zinc-800 overflow-hidden">
                {resume.mimeType.startsWith("image/") ? (
                  <img 
                    src={resume.url} 
                    alt={resume.title}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900 p-6 text-center">
                    <div className="h-16 w-16 bg-zinc-700 rounded-2xl shadow-sm flex items-center justify-center mb-4">
                      {getFileIcon(resume.mimeType)}
                    </div>
                    <p className="text-xs font-medium text-zinc-300 line-clamp-2 px-4">
                      {resume.title}
                    </p>
                  </div>
                )}
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="font-bold shadow-lg bg-white text-black hover:bg-zinc-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedResume(resume);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" /> View Analysis
                  </Button>
                </div>

                {/* Score Badge */}
                <div className="absolute top-3 right-3">
                  {getHealthBadge(resume.score || 0, resume.status)}
                </div>
              </div>

              {/* Content Area */}
              <div className="p-4 flex flex-col gap-3 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white truncate" title={resume.title}>
                      {resume.title}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1">
                      {formatDate(resume._creationTime)}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-zinc-400 hover:text-white" onClick={(e) => e.stopPropagation()}>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(resume._id);
                      }}>
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-auto pt-3 border-t border-zinc-700 flex items-center justify-between">
                  <span className={`
                    inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider
                    ${resume.category ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}
                  `}>
                    {resume.category || 'Uncategorized'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {filteredResumes.length === 0 && searchQuery !== "" && (
        <div className="text-center py-12 text-zinc-400">
          <p>No resumes match your search query.</p>
        </div>
      )}
    </div>
  );
}
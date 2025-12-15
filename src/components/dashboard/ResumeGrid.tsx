import { FileText, Loader2, Star, Trash2, File, MoreVertical, Eye, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ResumeGridProps {
  resumes: any[] | undefined;
  setSelectedResume: (resume: any) => void;
  handleDelete: (id: any) => void;
}

export function ResumeGrid({ resumes, setSelectedResume, handleDelete }: ResumeGridProps) {
  if (resumes === undefined) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium animate-pulse">Loading your resumes...</p>
      </div>
    );
  }

  if (resumes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-border rounded-3xl bg-muted/10">
        <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-6 shadow-inner">
          <FileText className="h-10 w-10 text-muted-foreground/50" />
        </div>
        <h3 className="text-xl font-bold mb-2">No resumes found</h3>
        <p className="text-muted-foreground max-w-sm text-center mb-8">
          Upload your resume to get an instant ATS score and AI-powered feedback.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
      {resumes.map((resume) => (
        <div 
          key={resume._id} 
          className="group relative flex flex-col rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:border-primary/50 hover:-translate-y-1 overflow-hidden"
          onClick={() => setSelectedResume(resume)}
        >
          {/* Preview Area */}
          <div className="relative w-full aspect-[3/4] bg-muted overflow-hidden">
            {resume.mimeType.startsWith("image/") ? (
              <img 
                src={resume.url} 
                alt={resume.title}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-muted to-muted/50 p-6 text-center">
                <div className="h-16 w-16 bg-background rounded-2xl shadow-sm flex items-center justify-center mb-4">
                  {resume.mimeType === "application/pdf" ? (
                    <FileText className="h-8 w-8 text-red-500" />
                  ) : (
                    <File className="h-8 w-8 text-blue-500" />
                  )}
                </div>
                <p className="text-xs font-medium text-muted-foreground line-clamp-2 px-4">
                  {resume.title}
                </p>
              </div>
            )}
            
            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3 backdrop-blur-[2px]">
              <Button 
                size="sm" 
                variant="secondary" 
                className="font-bold shadow-lg"
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
              {resume.status === 'processing' ? (
                <div className="bg-background/80 backdrop-blur-md text-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 border border-border/50">
                  <Loader2 className="h-3 w-3 animate-spin" /> Processing
                </div>
              ) : resume.status === 'failed' ? (
                <div className="bg-red-500/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 border border-white/10">
                  <AlertCircle className="h-3 w-3" /> Parsing Error
                </div>
              ) : (
                <div className={`
                  backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 border border-white/10
                  ${(resume.score || 0) >= 80 ? 'bg-green-500/90' : (resume.score || 0) >= 50 ? 'bg-yellow-500/90' : 'bg-red-500/90'}
                `}>
                  <span className="text-lg leading-none">{resume.score || 0}</span>
                  <span className="opacity-80 font-medium text-[10px] uppercase tracking-wide">Score</span>
                </div>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="p-4 flex flex-col gap-3 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-foreground truncate" title={resume.title}>
                  {resume.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(resume._creationTime).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-muted-foreground hover:text-foreground" onClick={(e) => e.stopPropagation()}>
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

            <div className="mt-auto pt-3 border-t border-border/50 flex items-center justify-between">
              <span className={`
                inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider
                ${resume.category ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}
              `}>
                {resume.category || 'Uncategorized'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
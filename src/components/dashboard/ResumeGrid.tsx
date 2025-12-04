import { FileText, Loader2, Star, Trash2, File } from "lucide-react";

interface ResumeGridProps {
  resumes: any[] | undefined;
  setSelectedResume: (resume: any) => void;
  handleDelete: (id: any) => void;
}

export function ResumeGrid({ resumes, setSelectedResume, handleDelete }: ResumeGridProps) {
  if (resumes === undefined) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (resumes.length === 0) {
    return (
      <div className="text-center py-20 border-2 border-dashed border-border rounded-xl bg-card/50">
        <div className="h-12 w-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-1">No resumes yet</h3>
        <p className="text-muted-foreground mb-4">Upload your first resume image to get an ATS score</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {resumes.map((resume) => (
        <div 
          key={resume._id} 
          className="group relative flex flex-col gap-3 rounded-xl border border-transparent bg-card p-3 transition-all hover:border-primary/50 hover:bg-accent/50 cursor-pointer"
          onClick={() => setSelectedResume(resume)}
        >
          <div className="relative w-full overflow-hidden rounded-lg aspect-[3/4] bg-secondary">
            {resume.mimeType.startsWith("image/") ? (
              <img 
                src={resume.url} 
                alt={resume.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-90 group-hover:opacity-100"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                {resume.mimeType === "application/pdf" ? (
                  <FileText className="h-16 w-16" />
                ) : (
                  <File className="h-16 w-16" />
                )}
              </div>
            )}
            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded-md">
              {resume.score ? `Score: ${resume.score}` : 'Analyzing...'}
            </div>
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
              <button className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition-colors">
                <Star className="h-5 w-5" />
              </button>
              <button 
                className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(resume._id);
                }}
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div>
            <p className="text-foreground text-base font-medium leading-normal truncate" title={resume.title}>
              {resume.title}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                resume.status === 'processing' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-primary/20 text-primary'
              }`}>
                {resume.category || (resume.status === 'processing' ? 'Processing...' : 'Uncategorized')}
              </span>
              <p className="text-muted-foreground text-sm font-normal leading-normal ml-auto">
                {new Date(resume._creationTime).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

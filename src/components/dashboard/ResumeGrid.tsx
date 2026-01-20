import { FileText, Loader2, Eye, Trash2, RefreshCw, MoreVertical, Plus, FolderPlus, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { useI18n } from "@/contexts/I18nContext";

interface ResumeGridProps {
  resumes: any[] | undefined;
  setSelectedResume: (resume: any) => void;
  handleDelete: (id: any) => void;
  categoryFilter?: string | null;
  onUpload?: () => void;
  onCreateProject?: () => void;
  onCreateManual?: () => void;
}

export function ResumeGrid({ resumes, setSelectedResume, handleDelete, categoryFilter, onUpload, onCreateProject, onCreateManual }: ResumeGridProps) {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  if (resumes === undefined) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium animate-pulse">{t.resumeGrid.loadingResumes}</p>
      </div>
    );
  }

  // Memoize filtered resumes with debouncing effect
  const filteredResumes = useMemo(() => {
    if (!resumes) return [];
    return resumes.filter(resume =>
      searchQuery === "" ||
      resume.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resume.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [resumes, searchQuery]);

  const getHealthBadge = (score: number, status: string) => {
    if (status === 'processing') {
      return (
        <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-700/20 text-[#64748B] border border-[#E2E8F0]/30">
          <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
          {t.resumeGrid.analyzing}
        </div>
      );
    }

    if (status === 'failed') {
      return (
        <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/20">
          <span className="mr-1.5 text-[8px]">●</span>
          {t.resumeGrid.error}
        </div>
      );
    }

    if (score >= 80) {
      return (
        <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#22C55E]/10 text-[#22C55E] border border-emerald-500/20">
          <span className="mr-1.5 text-[8px]">●</span>
          {score}% {t.resumeGrid.excellent}
        </div>
      );
    } else if (score >= 50) {
      return (
        <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F59E0B]/10 text-[#F59E0B] border border-amber-500/20">
          <span className="mr-1.5 text-[8px]">●</span>
          {score}% {t.resumeGrid.moderate}
        </div>
      );
    } else {
      return (
        <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/20">
          <span className="mr-1.5 text-[8px]">●</span>
          {score}% {t.resumeGrid.critical}
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
      return <FileText className="h-5 w-5 text-[#EF4444]" />;
    }
    return <FileText className="h-5 w-5 text-[#3B82F6]" />;
  };

  // File size will be displayed if available from storage metadata
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return null;
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  if (filteredResumes.length === 0 && searchQuery === "") {
    return (
      <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-border rounded-3xl bg-muted/10">
        <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
          <FileText className="h-10 w-10 text-muted-foreground/50" />
        </div>
        <h3 className="text-xl font-bold mb-2">{t.resumeGrid.noResumesFound}</h3>
        <p className="text-muted-foreground max-w-sm text-center mb-8">
          {t.resumeGrid.noResumesDesc}
        </p>
        <div className="flex gap-3">
          {onUpload && (
            <Button onClick={onUpload} className="font-bold">
              <Plus className="h-4 w-4 mr-2" />
              {t.resumeGrid.uploadResume}
            </Button>
          )}
          {onCreateManual && (
            <Button onClick={onCreateManual} variant="outline" className="font-bold">
              <Edit className="h-4 w-4 mr-2" />
              {t.resumeGrid.createManually}
            </Button>
          )}
          {onCreateProject && (
            <Button onClick={onCreateProject} variant="outline" className="font-bold">
              <FolderPlus className="h-4 w-4 mr-2" />
              {t.resumeGrid.createProject}
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
            placeholder={t.resumeGrid.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#FFFFFF] border-[#E2E8F0] text-[#0F172A] placeholder:text-[#64748B]"
          />
          <Eye className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {onCreateManual && (
            <Button
              onClick={onCreateManual}
              className="bg-primary text-[#0F172A] font-bold hover:bg-primary/90"
            >
              <Edit className="h-4 w-4 mr-2" />
              {t.resumeGrid.createManually}
            </Button>
          )}
          {onCreateProject && (
            <Button
              onClick={onCreateProject}
              variant="outline"
              className="font-bold"
            >
              <FolderPlus className="h-4 w-4 mr-2" />
              {t.resumeGrid.createProject}
            </Button>
          )}
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="font-medium"
          >
            {t.resumeGrid.listView}
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="font-medium"
          >
            {t.resumeGrid.gridView}
          </Button>
        </div>
      </div>

      {/* Table View */}
      {viewMode === "list" ? (
        <div className="border border-[#E2E8F0] rounded-xl overflow-hidden bg-[#FFFFFF] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-[#F8FAFC]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  {t.resumeGrid.resumeName}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider hidden sm:table-cell">
                  {t.resumeGrid.uploadDate}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider hidden md:table-cell">
                  {t.resumeGrid.lastAnalyzed}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  {t.resumeGrid.healthScore}
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  {t.resumeGrid.actions}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-[#FFFFFF]">
              {filteredResumes.map((resume) => (
                <tr key={resume._id} className="hover:bg-[#F8FAFC] transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-slate-100 border border-[#E2E8F0]">
                        {getFileIcon(resume.mimeType)}
                      </div>
                      <div className="ml-4">
                        <div
                          className="text-sm font-medium text-[#0F172A] group-hover:text-primary transition-colors cursor-pointer"
                          onClick={() => setSelectedResume(resume)}
                        >
                          {resume.title}
                        </div>
                        <div className="text-xs text-[#64748B]">
                          {resume.mimeType === 'application/pdf' ? 'PDF' : 'DOCX'}
                          {resume.fileSize && ` • ${formatFileSize(resume.fileSize)}`}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#64748B] font-mono hidden sm:table-cell">
                    {formatDate(resume._creationTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#475569] font-mono hidden md:table-cell">
                    {resume.status === 'completed' ? (
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span>
                        {t.resumeGrid.justNow}
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
                        className="text-[#64748B] hover:text-[#0F172A] p-1.5 hover:bg-slate-100 rounded-md transition-colors"
                        title={t.resumeGrid.viewDetails}
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setSelectedResume(resume)}
                        className="text-primary hover:text-primary/80 p-1.5 hover:bg-primary/10 rounded-md transition-colors"
                        title={t.resumeGrid.reAnalyze}
                        disabled={resume.status === 'processing'}
                      >
                        <RefreshCw className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(resume._id);
                        }}
                        className="text-rose-500 hover:text-rose-600 p-1.5 hover:bg-rose-50 rounded-md transition-colors"
                        title={t.resumeGrid.delete}
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
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC]">
            <div className="text-sm text-[#64748B]">
              {t.resumeGrid.showing} <span className="font-medium text-[#0F172A]">1</span> {t.resumeGrid.to}{" "}
              <span className="font-medium text-[#0F172A]">{Math.min(filteredResumes.length, 10)}</span> {t.resumeGrid.of}{" "}
              <span className="font-medium text-[#0F172A]">{filteredResumes.length}</span> {t.resumeGrid.results}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled
                className="text-[#64748B] bg-[#FFFFFF] border-[#E2E8F0]"
              >
                {t.resumeGrid.previous}
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={filteredResumes.length <= 10}
                className="text-[#64748B] bg-[#FFFFFF] border-[#E2E8F0]"
              >
                {t.resumeGrid.next}
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
              className="group relative flex flex-col rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] overflow-hidden cursor-pointer"
              onClick={() => setSelectedResume(resume)}
              whileHover={{
                y: -4,
                borderColor: "rgba(100, 116, 139, 0.3)",
                boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.1)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Preview Area */}
              <div className="relative w-full aspect-[3/4] bg-[#F8FAFC] overflow-hidden">
                {resume.mimeType.startsWith("image/") ? (
                  <img
                    src={resume.url}
                    alt={resume.title}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-[#F8FAFC] p-6 text-center border-b border-[#E2E8F0]">
                    <div className="h-16 w-16 bg-slate-100 rounded-2xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] flex items-center justify-center mb-4 border border-[#E2E8F0]">
                      {getFileIcon(resume.mimeType)}
                    </div>
                    <p className="text-xs font-medium text-[#475569] line-clamp-2 px-4">
                      {resume.title}
                    </p>
                  </div>
                )}

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-[#FFFFFF]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="font-bold shadow-lg bg-[#FFFFFF] text-[#0F172A] hover:bg-slate-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedResume(resume);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" /> {t.resumeGrid.viewDetails}
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
                    <h4 className="font-bold text-[#0F172A] truncate" title={resume.title}>
                      {resume.title}
                    </h4>
                    <p className="text-xs text-[#64748B] mt-1">
                      {formatDate(resume._creationTime)}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-[#64748B] hover:text-[#0F172A]" onClick={(e) => e.stopPropagation()}>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="text-[#EF4444] focus:text-[#EF4444]" onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(resume._id);
                      }}>
                        <Trash2 className="h-4 w-4 mr-2" /> {t.resumeGrid.delete}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-auto pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                  <span className={`
                    inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider
                    ${resume.category ? 'bg-primary/10 text-primary border border-primary/30' : 'bg-slate-100 text-[#64748B] border border-[#E2E8F0]'}
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
        <div className="text-center py-12 text-[#64748B]">
          <p>{t.resumeGrid.noSearchResults}</p>
        </div>
      )}
    </div>
  );
}
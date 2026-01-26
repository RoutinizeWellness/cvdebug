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
    const queryLower = searchQuery.toLowerCase();
    return resumes.filter(resume =>
      searchQuery === "" ||
      (resume.title || '').toLowerCase().includes(queryLower) ||
      (resume.category || '').toLowerCase().includes(queryLower)
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
    return <FileText className="h-5 w-5 text-[#64748B]" />;
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
    <div className="flex flex-col gap-4 pb-20 md:pb-8">
      {/* Header & Filters */}
      <div className="flex flex-col gap-3 md:gap-4">
        {/* Search - Full width on mobile */}
        <div className="relative w-full">
          <Input
            type="text"
            placeholder={t.resumeGrid.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#FFFFFF] border-[#E2E8F0] text-[#0F172A] placeholder:text-[#64748B] h-11"
          />
          <Eye className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
        </div>

        {/* Action Buttons - Responsive layout */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <div className="flex gap-2 flex-1 sm:flex-initial">
            {onCreateManual && (
              <Button
                onClick={onCreateManual}
                className="flex-1 sm:flex-initial bg-primary text-white font-bold hover:bg-primary/90 h-11"
              >
                <Edit className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{t.resumeGrid.createManually}</span>
                <span className="sm:hidden">Create</span>
              </Button>
            )}
            {onCreateProject && (
              <Button
                onClick={onCreateProject}
                variant="outline"
                className="flex-1 sm:flex-initial font-bold h-11"
              >
                <FolderPlus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{t.resumeGrid.createProject}</span>
                <span className="sm:hidden">Project</span>
              </Button>
            )}
          </div>
          <div className="hidden md:flex gap-2 ml-auto">
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
      </div>

      {/* Mobile Card View (always on mobile, table view on desktop if selected) */}
      {viewMode === "list" ? (
        <>
          {/* Desktop Table View - Hidden on mobile */}
          <div className="hidden md:block border border-[#E2E8F0] rounded-xl overflow-hidden bg-[#FFFFFF] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
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
                      <div className="ml-4 min-w-0">
                        <div
                          className="text-sm font-medium text-[#0F172A] group-hover:text-primary transition-colors cursor-pointer truncate max-w-[200px]"
                          onClick={() => setSelectedResume(resume)}
                          title={resume.title}
                        >
                          {resume.title}
                        </div>
                        <div className="text-xs text-[#64748B] truncate max-w-[200px]">
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

          {/* Mobile Card View - Shown only on mobile */}
          <div className="md:hidden flex flex-col gap-3">
            {filteredResumes.map((resume) => (
              <motion.div
                key={resume._id}
                className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-4 shadow-sm active:scale-[0.98] transition-transform"
                onClick={() => setSelectedResume(resume)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Header with icon and actions */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-lg bg-slate-50 border border-[#E2E8F0]">
                      {getFileIcon(resume.mimeType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-[#0F172A] truncate">
                        {resume.title}
                      </h3>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        {resume.mimeType === 'application/pdf' ? 'PDF' : 'DOCX'}
                        {resume.fileSize && ` • ${formatFileSize(resume.fileSize)}`}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="p-2 hover:bg-slate-50 rounded-lg transition-colors flex-shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-4 w-4 text-[#64748B]" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedResume(resume)}>
                        <Eye className="h-4 w-4 mr-2" />
                        {t.resumeGrid.viewDetails}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setSelectedResume(resume)}
                        disabled={resume.status === 'processing'}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        {t.resumeGrid.reAnalyze}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(resume._id);
                        }}
                        className="text-rose-500"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {t.resumeGrid.delete}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Score Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[#64748B]">
                    <span>{formatDate(resume._creationTime)}</span>
                  </div>
                  {getHealthBadge(resume.score || 0, resume.status)}
                </div>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        // Enhanced Grid View - Larger scores, better visual hierarchy
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredResumes.map((resume) => {
            const score = resume.score || 0;
            const status = resume.status;

            // Determine card style based on score
            const getScoreStyle = () => {
              if (status === 'processing') {
                return {
                  bgClass: 'bg-gradient-to-br from-slate-50 to-slate-100',
                  borderClass: 'border-slate-300',
                  textClass: 'text-slate-600',
                  label: 'ANALYZING'
                };
              }
              if (score >= 80) {
                return {
                  bgClass: 'bg-gradient-to-br from-green-50 to-emerald-100',
                  borderClass: 'border-green-300',
                  textClass: 'text-green-700',
                  label: 'EXCELLENT'
                };
              } else if (score >= 60) {
                return {
                  bgClass: 'bg-gradient-to-br from-yellow-50 to-amber-100',
                  borderClass: 'border-yellow-300',
                  textClass: 'text-yellow-700',
                  label: 'GOOD'
                };
              } else {
                return {
                  bgClass: 'bg-gradient-to-br from-red-50 to-rose-100',
                  borderClass: 'border-red-300',
                  textClass: 'text-red-700',
                  label: 'CRITICAL'
                };
              }
            };

            const scoreStyle = getScoreStyle();

            return (
              <motion.div
                key={resume._id}
                className={`group relative flex flex-col rounded-2xl border-2 ${scoreStyle.borderClass} ${scoreStyle.bgClass} shadow-lg overflow-hidden cursor-pointer`}
                onClick={() => setSelectedResume(resume)}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {/* Large Score Circle at Top */}
                <div className="relative w-full p-6 flex flex-col items-center justify-center">
                  {/* Circular Score Badge */}
                  <div className={`relative w-32 h-32 rounded-full border-8 ${scoreStyle.borderClass} bg-white shadow-xl flex flex-col items-center justify-center mb-3`}>
                    {status === 'processing' ? (
                      <>
                        <Loader2 className="h-8 w-8 animate-spin text-slate-600 mb-1" />
                        <span className="text-xs font-bold text-slate-600">...</span>
                      </>
                    ) : (
                      <>
                        <span className={`text-4xl font-black ${scoreStyle.textClass}`}>
                          {score}%
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${scoreStyle.textClass}`}>
                          {scoreStyle.label}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Title */}
                  <h4 className="font-bold text-[#0F172A] text-center line-clamp-2 px-2 min-h-[2.5rem]" title={resume.title}>
                    {resume.title}
                  </h4>
                </div>

                {/* Content Area - White Background */}
                <div className="bg-white p-4 flex flex-col gap-3 flex-1 border-t-2 border-slate-200">
                  {/* Date */}
                  <div className="flex items-center justify-center gap-2 text-xs text-[#64748B]">
                    <span className="font-mono">{formatDate(resume._creationTime)}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-[#64748B] to-[#1E293B] hover:opacity-90 text-white font-bold shadow-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedResume(resume);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      <span className="text-xs">View</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-2 hover:bg-red-50 hover:border-red-300 text-red-600 font-bold"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(resume._id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Hover Overlay with Quick Stats */}
                <div className="absolute inset-0 bg-white/95 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-3 p-6 backdrop-blur-sm">
                  <div className="text-center">
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Quick Stats</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                        <p className="text-blue-900 font-bold">{resume.matchedKeywords?.length || 0}</p>
                        <p className="text-blue-600 text-[10px]">Keywords</p>
                      </div>
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-2">
                        <p className="text-purple-900 font-bold">{resume.iterations || 1}</p>
                        <p className="text-purple-600 text-[10px]">Iterations</p>
                      </div>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 text-white font-bold shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedResume(resume);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Open Analysis
                  </Button>
                </div>
              </motion.div>
            );
          })}
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
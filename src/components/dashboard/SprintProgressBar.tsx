import { CheckCircle2, Circle, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const apiAny = api as any;

interface SprintStage {
  id: string;
  label: string;
  completed: boolean;
}

export function SprintProgressBar() {
  const currentUser = useQuery(apiAny.users.currentUser);
  const resumes = useQuery(apiAny.resumes.getResumes);
  const jobHistory = useQuery(apiAny.jobTracker.getJobHistory);
  const linkedinProfile = useQuery(apiAny.linkedinProfile.getProfile);

  const stages: SprintStage[] = useMemo(() => {
    const hasValidatedCV = resumes && resumes.some((r: any) => r.status === 'completed' && r.score >= 70);
    const hasMatchedKeywords = jobHistory && jobHistory.some((j: any) => j.score >= 70);
    const hasCoverLetter = jobHistory && jobHistory.some((j: any) => j.coverLetter);
    const hasLinkedInOptimized = linkedinProfile && linkedinProfile.score >= 70;
    const isReadyToApply = hasValidatedCV && hasMatchedKeywords && hasCoverLetter;

    return [
      { id: 'cv', label: 'CV Validado', completed: hasValidatedCV },
      { id: 'keywords', label: 'Keywords Ajustadas', completed: hasMatchedKeywords },
      { id: 'cover', label: 'Carta Lista', completed: hasCoverLetter },
      { id: 'linkedin', label: 'LinkedIn Optimizado', completed: hasLinkedInOptimized },
      { id: 'ready', label: 'Listo para Aplicar', completed: isReadyToApply },
    ];
  }, [resumes, jobHistory, linkedinProfile]);

  const completedCount = stages.filter(s => s.completed).length;
  const progressPercentage = (completedCount / stages.length) * 100;

  // Calculate time remaining
  const timeRemaining = useMemo(() => {
    if (!currentUser?.sprintExpiresAt) return null;
    
    const now = Date.now();
    const expiresAt = currentUser.sprintExpiresAt;
    const diff = expiresAt - now;
    
    if (diff <= 0) return "Expirado";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${days}d ${hours}h ${minutes}m`;
  }, [currentUser?.sprintExpiresAt]);

  if (!currentUser?.sprintExpiresAt) return null;

  return (
    <motion.div 
      className="bg-gradient-to-r from-primary/10 to-teal-500/10 border border-primary/30 rounded-xl p-6 space-y-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
            Progreso del Sprint de Entrevistas
          </h3>
          <p className="text-sm text-[#64748B] mt-1">
            Completa todas las etapas para maximizar tu tasa de éxito
          </p>
        </div>
        {timeRemaining && (
          <div className="flex items-center gap-2 px-3 py-2 bg-primary/20 border border-primary/30 rounded-lg">
            <Clock className="h-4 w-4 text-primary" />
            <div className="text-right">
              <div className="text-xs text-[#64748B]">Expira en</div>
              <div className="text-sm font-bold text-[#0F172A] font-mono">{timeRemaining}</div>
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-[#64748B]">
          <span>Progreso General</span>
          <span className="font-mono">{completedCount}/{stages.length} Completado</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Stages */}
      <div className="flex items-center justify-between gap-2">
        {stages.map((stage, index) => (
          <div key={stage.id} className="flex flex-col items-center gap-2 flex-1">
            <div className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
              stage.completed
                ? 'bg-[#22C55E] border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                : 'bg-[#FFFFFF] border-[#E2E8F0]'
            }`}>
              {stage.completed ? (
                <CheckCircle2 className="h-5 w-5 text-[#0F172A]" />
              ) : (
                <Circle className="h-5 w-5 text-[#64748B]" />
              )}
              {index < stages.length - 1 && (
                <div className={`absolute left-full w-full h-0.5 ${
                  stage.completed && stages[index + 1].completed
                    ? 'bg-[#22C55E]'
                    : 'bg-slate-700'
                }`} style={{ width: 'calc(100% + 0.5rem)' }} />
              )}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider text-center ${
              stage.completed ? 'text-emerald-400' : 'text-[#64748B]'
            }`}>
              {stage.label}
            </span>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {progressPercentage === 100 && (
          <motion.div 
            className="p-4 bg-[#22C55E]/10 border border-emerald-500/30 rounded-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <p className="text-sm font-bold text-emerald-400 text-center">
              🎉 ¡Todas las etapas completadas! Estás listo para dominar tu búsqueda de empleo.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

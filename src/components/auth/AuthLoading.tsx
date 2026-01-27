import { Loader2 } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

export function AuthLoading() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-[#1E293B]/20 blur-xl rounded-full"></div>
          <Loader2 className="h-12 w-12 animate-spin text-[#1E293B] relative z-10" />
        </div>
        <p className="text-slate-500 font-medium animate-pulse">{t.auth.loading}</p>
      </div>
    </div>
  );
}

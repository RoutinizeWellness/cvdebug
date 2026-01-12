import { Button } from "@/components/ui/button";
import { Briefcase, Plus } from "lucide-react";

interface BoardEmptyStateProps {
  onCreateClick: () => void;
}

export function BoardEmptyState({ onCreateClick }: BoardEmptyStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center max-w-md space-y-6">
        <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-teal-500/20 flex items-center justify-center border border-primary/30">
          <Briefcase className="h-10 w-10 text-primary" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Start Tracking Applications</h3>
          <p className="text-slate-400 text-sm">
            Add your first job application to this project and track it through the interview process.
          </p>
        </div>
        <div className="space-y-3">
          <Button 
            size="lg"
            className="w-full bg-primary hover:bg-primary/90 text-black font-semibold gap-2"
            onClick={onCreateClick}
          >
            <Plus className="h-5 w-5" />
            Add First Application
          </Button>
          <p className="text-xs text-slate-500">
            Track company, role, status, and match score all in one place
          </p>
        </div>
      </div>
    </div>
  );
}

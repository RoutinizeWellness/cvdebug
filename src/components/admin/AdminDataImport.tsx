import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { UploadCloud, Loader2, FileSpreadsheet } from "lucide-react";

export function AdminDataImport() {
  const [isImporting, setIsImporting] = useState(false);
  // Cast to any to avoid type issues if the API types haven't regenerated yet
  const importUsers = useMutation((api as any).admin.importUsersFromCSV);

  const handleImport = async () => {
    setIsImporting(true);
    try {
      const response = await fetch("/assets/ins_369YkH2hmhXpy2iTZpDsZFns7bO.csv");
      if (!response.ok) throw new Error("Failed to fetch CSV file");
      
      const text = await response.text();
      const result = await importUsers({ csvData: text });
      toast.success("Import Successful", { description: result });
    } catch (error: any) {
      console.error(error);
      toast.error("Import Failed", { description: error.message });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="glass-panel p-5 rounded-xl border border-slate-700/50 bg-slate-900/50">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <FileSpreadsheet className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-base font-display font-bold text-white">Clerk User Migration</h3>
            <p className="text-slate-400 text-xs">Import users from the system CSV export.</p>
          </div>
        </div>
        <Button 
          onClick={handleImport} 
          disabled={isImporting} 
          variant="outline" 
          className="border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white"
        >
          {isImporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
          Run Migration
        </Button>
      </div>
    </div>
  );
}

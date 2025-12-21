import { MessageSquare, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

export function DMGenerator() {
  const [recruiterType, setRecruiterType] = useState("Internal HR");
  const [tone, setTone] = useState("Professional");

  const dmText = "Hi [Name], I saw you're hiring for [Role] and wanted to connect. My background in React and Node seems like a great fit for your tech stack.";

  const handleCopy = () => {
    navigator.clipboard.writeText(dmText);
    toast.success("DM copied to clipboard!");
  };

  return (
    <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/50 rounded-xl p-6 flex flex-col">
      <div className="mb-4">
        <h3 className="text-white font-semibold text-lg flex items-center gap-2 mb-1">
          <MessageSquare className="h-5 w-5 text-secondary" />
          DM Generator
        </h3>
        <p className="text-zinc-400 text-sm">Draft ice-breakers for recruiters</p>
      </div>

      <div className="space-y-4 flex-1 flex flex-col">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Recruiter Type</label>
            <div className="relative">
              <select 
                value={recruiterType}
                onChange={(e) => setRecruiterType(e.target.value)}
                className="w-full appearance-none bg-zinc-800 border border-zinc-700 text-white text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-secondary"
              >
                <option>Internal HR</option>
                <option>Agency Recruiter</option>
                <option>Hiring Manager</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-2.5 text-zinc-400 pointer-events-none text-sm">
                expand_more
              </span>
            </div>
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Tone</label>
            <div className="relative">
              <select 
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full appearance-none bg-zinc-800 border border-zinc-700 text-white text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-secondary"
              >
                <option>Professional</option>
                <option>Casual</option>
                <option>Direct</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-2.5 text-zinc-400 pointer-events-none text-sm">
                expand_more
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-zinc-900/40 border border-zinc-800 rounded-lg p-4 relative flex flex-col">
          <div className="flex gap-3 mb-2">
            <div className="size-8 rounded-full bg-zinc-700 flex-shrink-0"></div>
            <div className="bg-primary/20 text-blue-100 p-3 rounded-2xl rounded-tl-none text-sm font-mono leading-relaxed border border-primary/20">
              {dmText}
            </div>
          </div>
        </div>

        <Button
          onClick={handleCopy}
          className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-white font-medium"
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy to Clipboard
        </Button>
      </div>
    </div>
  );
}

import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnhancedRobotTerminalView } from "./scan-results/EnhancedRobotTerminalView";
import { KeywordAnalysis } from "./KeywordAnalysis";
import { FormattingAudit } from "./analysis/FormattingAudit";
import { Cpu, Target, FileSearch } from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel";

interface ATSAnalysisTabProps {
  resume: any;
  user: any;
  isPaidUser: boolean;
  onUpgrade: () => void;
}

export function ATSAnalysisTab({ resume, user, isPaidUser, onUpgrade }: ATSAnalysisTabProps) {
  return (
    <div className="flex-1 overflow-auto p-0 m-0 bg-[#F8FAFC]">
      {/* Sub-tabs for Robot View, Keywords, and Format */}
      <Tabs defaultValue="robot" className="h-full flex flex-col">
        <div className="bg-white border-b border-[#E2E8F0] px-6 py-3">
          <TabsList className="bg-slate-100 p-1">
            <TabsTrigger value="robot" className="flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              <span>Robot View</span>
            </TabsTrigger>
            <TabsTrigger value="keywords" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>Keywords</span>
            </TabsTrigger>
            <TabsTrigger value="format" className="flex items-center gap-2">
              <FileSearch className="h-4 w-4" />
              <span>Format</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="robot" className="flex-1 overflow-auto m-0 p-0">
          <div className="h-full">
            {resume && (
              <EnhancedRobotTerminalView
                resumeId={resume._id}
                autoAnimate={true}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="keywords" className="flex-1 overflow-auto m-0 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {resume && (
              <KeywordAnalysis
                matchedKeywords={resume.foundKeywords || []}
                missingKeywords={resume.missingKeywords || []}
                matchRate={resume.keywordMatchRate}
                onUpgrade={onUpgrade}
                resumeText={resume.ocrText || ''}
                jobDescription={resume.jobDescription || ''}
                category={resume.category || ''}
                seniorityLevel={resume.seniorityLevel || 'mid'}
                isPaidUser={isPaidUser}
              />
            )}
          </motion.div>
        </TabsContent>

        <TabsContent value="format" className="flex-1 overflow-auto m-0 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-5xl mx-auto"
          >
            <h2 className="text-2xl font-black text-[#0F172A] mb-4">Formatting Analysis</h2>
            {resume && (
              <FormattingAudit
                items={resume.formatIssues || []}
              />
            )}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

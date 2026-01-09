import { NicheLandingPage } from "@/components/programmatic/NicheLandingPage";
import { getNicheTemplate } from "@/data/nicheTemplates";

export default function FinancialAnalystATSOptimizer() {
  const template = getNicheTemplate("financial-analyst-ats-optimizer");
  if (!template) return <div>Template not found</div>;
  return <NicheLandingPage template={template} />;
}

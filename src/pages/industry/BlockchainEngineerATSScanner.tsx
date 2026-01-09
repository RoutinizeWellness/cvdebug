import { NicheLandingPage } from "@/components/programmatic/NicheLandingPage";
import { getNicheTemplate } from "@/data/nicheTemplates";

export default function BlockchainEngineerATSScanner() {
  const template = getNicheTemplate("blockchain-engineer-ats-scanner");
  if (!template) return <div>Template not found</div>;
  return <NicheLandingPage template={template} />;
}

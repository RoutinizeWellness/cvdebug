import { NicheLandingPage } from "@/components/programmatic/NicheLandingPage";
import { getNicheTemplate } from "@/data/nicheTemplates";

export default function CloudArchitectAWSATSScanner() {
  const template = getNicheTemplate("cloud-architect-aws-ats-scanner");
  if (!template) return <div>Template not found</div>;
  return <NicheLandingPage template={template} />;
}

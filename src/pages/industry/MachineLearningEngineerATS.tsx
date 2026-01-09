import { NicheLandingPage } from "@/components/programmatic/NicheLandingPage";
import { getNicheTemplate } from "@/data/nicheTemplates";

export default function MachineLearningEngineerATS() {
  const template = getNicheTemplate("machine-learning-engineer-ats");
  if (!template) return <div>Template not found</div>;
  return <NicheLandingPage template={template} />;
}

import { NicheLandingPage } from "@/components/programmatic/NicheLandingPage";
import { getNicheTemplate } from "@/data/nicheTemplates";

export default function DevOpsEngineerKubernetesATS() {
  const template = getNicheTemplate("devops-engineer-kubernetes-ats");

  if (!template) {
    return <div>Template not found</div>;
  }

  return <NicheLandingPage template={template} />;
}

import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Phase 3, 4, and 5 pages to generate (20 total)
const newPages = [
  // Phase 3 - Nursing (5)
  { slug: 'rehab-nurse-ats-optimizer', name: 'RehabNurseATSOptimizer' },
  { slug: 'wound-care-nurse-ats-optimizer', name: 'WoundCareNurseATSOptimizer' },
  { slug: 'pain-management-nurse-ats', name: 'PainManagementNurseATS' },
  { slug: 'ambulatory-care-nurse-ats', name: 'AmbulatoryCareNurseATS' },
  { slug: 'radiology-nurse-ats-scanner', name: 'RadiologyNurseATSScanner' },

  // Phase 3 - Tech (5)
  { slug: 'qa-engineer-automation-ats', name: 'QAEngineerAutomationATS' },
  { slug: 'security-engineer-ats-optimizer', name: 'SecurityEngineerATSOptimizer' },
  { slug: 'blockchain-engineer-ats-scanner', name: 'BlockchainEngineerATSScanner' },
  { slug: 'mobile-engineer-react-native-ats', name: 'MobileEngineerReactNativeATS' },
  { slug: 'embedded-systems-engineer-ats', name: 'EmbeddedSystemsEngineerATS' },

  // Phase 4 - Nursing (4)
  { slug: 'transplant-nurse-ats-optimizer', name: 'TransplantNurseATSOptimizer' },
  { slug: 'cardiology-nurse-ats-scanner', name: 'CardiologyNurseATSScanner' },
  { slug: 'neurology-nurse-ats-optimizer', name: 'NeurologyNurseATSOptimizer' },
  { slug: 'endoscopy-nurse-ats-scanner', name: 'EndoscopyNurseATSScanner' },

  // Phase 4 - Tech (4)
  { slug: 'golang-backend-engineer-ats', name: 'GolangBackendEngineerATS' },
  { slug: 'rust-systems-engineer-ats', name: 'RustSystemsEngineerATS' },
  { slug: 'platform-engineer-ats-optimizer', name: 'PlatformEngineerATSOptimizer' },
  { slug: 'solutions-architect-ats-scanner', name: 'SolutionsArchitectATSScanner' },

  // Phase 4 - Other (2)
  { slug: 'financial-analyst-ats-optimizer', name: 'FinancialAnalystATSOptimizer' },
  { slug: 'marketing-manager-ats-scanner', name: 'MarketingManagerATSScanner' },
];

const generatePageFile = (slug: string, componentName: string): string => {
  return `import { NicheLandingPage } from "@/components/programmatic/NicheLandingPage";
import { getNicheTemplate } from "@/data/nicheTemplates";

export default function ${componentName}() {
  const template = getNicheTemplate("${slug}");
  if (!template) return <div>Template not found</div>;
  return <NicheLandingPage template={template} />;
}
`;
};

const main = () => {
  const outputDir = resolve(__dirname, '../src/pages/industry');

  let created = 0;
  let skipped = 0;

  newPages.forEach(({ slug, name }) => {
    const filename = `${name}.tsx`;
    const filepath = resolve(outputDir, filename);

    try {
      const content = generatePageFile(slug, name);
      writeFileSync(filepath, content, 'utf-8');
      console.log(`✅ Created: ${filename}`);
      created++;
    } catch (error) {
      console.log(`⚠️  Skipped: ${filename} (${error})`);
      skipped++;
    }
  });

  console.log(`\n📊 Summary:`);
  console.log(`   Created: ${created} files`);
  console.log(`   Skipped: ${skipped} files`);
  console.log(`   Total new pages: ${newPages.length}`);
  console.log(`\n🎯 Total pages now: 50 (30 previous + 20 new)`);
};

main();

import { internalAction } from "../_generated/server";
import { classifyRole, RoleCategory } from "./config/keywords";

export const evaluateRoleClassification = internalAction({
  args: {},
  handler: async (ctx) => {
    const testCases: { text: string; expected: RoleCategory }[] = [
      {
        text: "Experienced Structural Engineer with 10 years in steel design using ETABS and SAP2000. PE licensed.",
        expected: "Engineering"
      },
      {
        text: "Senior Frontend Developer specializing in React, TypeScript, and Tailwind CSS. Built responsive web apps.",
        expected: "Software Engineering"
      },
      {
        text: "Digital Marketing Manager focused on SEO, SEM, and Google Analytics. Increased ROI by 50%.",
        expected: "Marketing"
      },
      {
        text: "Product Manager leading cross-functional teams to launch mobile apps. Expert in Agile and Jira.",
        expected: "Product Management"
      },
      {
        text: "Data Scientist with PhD in Machine Learning. Proficient in Python, TensorFlow, and PyTorch.",
        expected: "Data Science"
      },
      {
        text: "Project Manager with PMP certification. Managed construction projects.",
        expected: "Engineering"
      },
      {
        text: "Sales Associate with strong communication skills and customer service experience.",
        expected: "General"
      },
      {
        text: "Full Stack Engineer with Node.js, Express, and MongoDB experience. Deployed on AWS.",
        expected: "Software Engineering"
      },
      {
        text: "Civil Engineer specializing in transportation and highway design using Civil 3D and MicroStation.",
        expected: "Engineering"
      },
      {
        text: "Growth Marketer with expertise in user acquisition, A/B testing, and retention strategies.",
        expected: "Marketing"
      },
      {
        text: "DevOps Engineer with strong background in AWS, Terraform, and CI/CD pipelines using Jenkins and GitHub Actions.",
        expected: "Software Engineering"
      },
      {
        text: "Creative Director with 15 years experience in brand strategy, visual identity, and leading design teams for global campaigns.",
        expected: "Marketing"
      },
      {
        text: "Technical Product Manager bridging the gap between engineering and business. Expert in API product strategy and developer experience.",
        expected: "Product Management"
      },
      {
        text: "Bioinformatics Scientist skilled in Python, R, and genomic data analysis. PhD in Computational Biology.",
        expected: "Data Science"
      },
      {
        text: "Sales Director with a track record of closing enterprise deals worth $5M+ annually. Expert in CRM and pipeline management.",
        expected: "General"
      },
      {
        text: "Full Stack Designer who codes. Proficient in Figma, React, and Tailwind CSS. Focus on UX/UI and frontend implementation.",
        expected: "Software Engineering"
      },
      {
        text: "Mechanical Engineer focused on HVAC systems and energy efficiency for LEED certified buildings. Trane Trace and Revit MEP expert.",
        expected: "Engineering"
      },
      {
        text: "Social Media Manager and Content Creator. Grew TikTok following to 500k. Expert in viral content strategy.",
        expected: "Marketing"
      },
      {
        text: "Operations Manager with Six Sigma Black Belt. Streamlined supply chain logistics and reduced overhead by 20%.",
        expected: "General"
      },
      {
        text: "Quantitative Analyst (Quant) using C++ and Python for high-frequency trading algorithms and risk modeling.",
        expected: "Data Science"
      },
      {
        text: "Customer Success Manager dedicated to onboarding and retention. Reduced churn by 15% through proactive account management.",
        expected: "General"
      }
    ];

    let correct = 0;
    const results = [];

    for (const test of testCases) {
      const { category, confidence } = classifyRole(test.text);
      const isCorrect = category === test.expected;
      if (isCorrect) correct++;
      
      results.push({
        text: test.text.substring(0, 50) + "...",
        expected: test.expected,
        actual: category,
        confidence: confidence.toFixed(2),
        pass: isCorrect
      });
    }

    const accuracy = (correct / testCases.length) * 100;
    
    console.log(`[Evaluation] Role Classification Accuracy: ${accuracy.toFixed(1)}%`);
    console.table(results);

    return {
      accuracy,
      results
    };
  }
});
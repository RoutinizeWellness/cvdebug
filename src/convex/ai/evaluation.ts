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

"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";

export const generateBattlePlan = action({
  args: {
    resumeText: v.string(),
    jobDescription: v.string(),
    targetRole: v.string(),
  },
  handler: async (ctx, args) => {
    const { resumeText, jobDescription, targetRole } = args;

    // In production, this would call an AI API
    // For now, return a mock battle plan structure

    const systemPrompt = `You are a FAANG Interview Coach and Career Strategist.

Analyze the gap between this candidate's resume and the job description.
Generate a comprehensive "Interview Battle Plan" that includes:

1. THE 3 HARDEST QUESTIONS: Based on gaps or weak points in the resume
2. STRATEGIC POSITIONING: The candidate's strongest points to leverage
3. THE KILLER QUESTION: A high-impact question for the candidate to ask the interviewer

Be specific, tactical, and confidence-building. Focus on competitive positioning.

Return ONLY valid JSON in this format:
{
  "hardestQuestions": [
    {
      "question": "...",
      "why": "...",
      "howToAnswer": "..."
    }
  ],
  "strategicPoints": [
    {
      "strength": "...",
      "positioning": "...",
      "deflectionTactic": "..."
    }
  ],
  "killerQuestion": {
    "question": "...",
    "why": "...",
    "timing": "..."
  }
}`;

    // Mock response
    return {
      success: true,
      battlePlan: {
        role: targetRole,
        generatedAt: Date.now(),

        hardestQuestions: [
          {
            question: "I see you don't have experience with AWS. How would you handle our cloud migration to AWS?",
            why: "Your resume shows primarily Azure experience, but the role requires AWS expertise",
            howToAnswer: "Acknowledge the gap honestly, then pivot to your strong cloud fundamentals: 'While my hands-on AWS experience is limited, I architected and managed a complete Azure infrastructure serving 5M users. Cloud principles are transferable—compute, storage, networking, security. I'm already AWS certified and have been running personal projects on EC2 and Lambda to accelerate my learning. My Azure experience means I can compare services critically and make informed architectural decisions.'",
            severity: "high"
          },
          {
            question: "Can you walk me through a time you had to make a technical decision without complete information?",
            why: "Testing your judgment under uncertainty—critical for senior roles",
            howToAnswer: "Use the STAR format with a specific example: 'During a critical production incident affecting 100K users, we had incomplete logs. I made the call to roll back the deployment immediately rather than debug further, accepting 2 hours of lost features to restore stability. We then did a thorough post-mortem which revealed a race condition. The quick decision prevented $50K in SLA penalties.'",
            severity: "medium"
          },
          {
            question: "How do you handle technical disagreements with other senior engineers?",
            why: "Assessing your collaboration and communication skills at a senior level",
            howToAnswer: "Show maturity and ego-less engineering: 'I document both approaches with pros/cons, then propose we run a small spike or A/B test with concrete metrics. Recently, I disagreed with our architect on database sharding strategy. We ran benchmarks for a week—his approach won. I learned something valuable and we shipped faster than if we'd debated endlessly. Data over opinions.'",
            severity: "medium"
          }
        ],

        strategicPoints: [
          {
            strength: "Proven track record of scaling systems",
            positioning: "You've scaled systems to 10M+ users—emphasize this early and often. Most candidates talk about features; you talk about scale and reliability.",
            deflectionTactic: "When asked about gaps (like AWS), deflect to your scaling experience: 'What I bring is battle-tested scaling experience. I've debugged performance issues at 10M QPS—that pattern recognition transfers across any cloud.'",
            icon: "rocket_launch",
            color: "#8B5CF6"
          },
          {
            strength: "Cross-functional leadership",
            positioning: "You've led teams of 12+ across engineering, product, and design. This is rare for IC roles and shows senior+ potential.",
            deflectionTactic: "If they probe your technical depth vs breadth, pivot to impact: 'I can code and architect, but what multiplies my impact is aligning 3 teams toward the same goal. That's how we shipped on time.'",
            icon: "groups",
            color: "#22C55E"
          },
          {
            strength: "Quantified business impact",
            positioning: "Your bullets show $500K+ cost savings and 40% efficiency gains. This is executive language and shows you think beyond code.",
            deflectionTactic: "Anchor every technical answer to business outcomes: 'This refactor wasn't about clean code—it cut our cloud bill by $80K annually, which funded 2 more headcount.'",
            icon: "trending_up",
            color: "#3B82F6"
          }
        ],

        killerQuestion: {
          question: "What's the biggest technical or organizational challenge your team is facing right now that you'd want me to help solve in my first 90 days?",
          why: "This question does 4 things: (1) Shows you're already thinking about impact, (2) Reveals what success looks like, (3) Helps you assess if you want the job, (4) Positions you as a problem-solver, not just a code writer",
          timing: "Ask the hiring manager or skip-level. Save it for near the end when you've built credibility.",
          followUp: "Based on their answer, you can then say: 'That's interesting—I faced something similar when...' and tell a relevant story."
        },

        confidence: {
          matchScore: 82,
          strengths: 5,
          gaps: 2,
          recommendation: "Strong match. Lean into your scaling and leadership experience. Address AWS gap proactively."
        }
      }
    };
  }
});

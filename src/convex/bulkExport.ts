import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";

const internalAny = require("./_generated/api").internal;

export const generateBulkExport = action({
  args: {
    applicationId: v.id("applications"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.runQuery(internalAny.users.currentUser);
    if (!user) throw new Error("User not found");

    const hasActiveSprint = user.sprintExpiresAt && user.sprintExpiresAt > Date.now();
    if (!hasActiveSprint) {
      throw new Error("Bulk export is only available for Career Sprint subscribers");
    }

    const application = await ctx.runQuery(internalAny.applications.getApplication, {
      applicationId: args.applicationId,
    });

    if (!application || application.userId !== identity.subject) {
      throw new Error("Application not found");
    }

    const project = await ctx.runQuery(internalAny.projects.getProject, {
      projectId: application.projectId,
    });

    if (!project) throw new Error("Project not found");

    const exportData = {
      companyName: application.companyName,
      jobTitle: application.jobTitle,
      files: [] as Array<{ name: string; content: string; type: string }>,
    };

    if (project.masterCvId) {
      const resume = await ctx.runQuery(internalAny.resumes.getResumeInternal, {
        id: project.masterCvId,
      });

      if (resume && resume.rewrittenText) {
        exportData.files.push({
          name: `${application.companyName}_Optimized_Resume.txt`,
          content: resume.rewrittenText,
          type: "resume",
        });
      }
    }

    if (application.coverLetterId) {
      const coverLetter = await ctx.runQuery(internalAny.coverLetters.getCoverLetter, {
        coverLetterId: application.coverLetterId,
      });

      if (coverLetter) {
        exportData.files.push({
          name: `${application.companyName}_Cover_Letter.txt`,
          content: coverLetter.content,
          type: "cover_letter",
        });
      }
    }

    const interviewGuide = `
INTERVIEW PREPARATION GUIDE
Company: ${application.companyName}
Position: ${application.jobTitle}
Match Score: ${application.matchScore}%

KEY TALKING POINTS:
${application.matchedKeywords?.slice(0, 5).map((kw: string) => `- Emphasize your experience with ${kw}`).join('\n') || '- Review your matched skills'}

GAPS TO ADDRESS:
${application.missingKeywords?.slice(0, 3).map((kw: string) => `- Be ready to discuss ${kw} (currently missing from your resume)`).join('\n') || '- No critical gaps detected'}

QUESTIONS TO ASK:
- What does success look like in this role after 90 days?
- How does this team collaborate with other departments?
- What are the biggest challenges facing the team right now?

Good luck! 🚀
    `.trim();

    exportData.files.push({
      name: `${application.companyName}_Interview_Guide.txt`,
      content: interviewGuide,
      type: "guide",
    });

    return exportData;
  },
});

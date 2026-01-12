"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";

// Use any to avoid type instantiation issues with Convex API
const apiAny = require("./_generated/api").api;

// Topics pool for generating diverse blog posts
const blogTopics = [
  // ATS & Resume Optimization
  "How to optimize your resume for Applicant Tracking Systems (ATS) in 2026",
  "Common ATS mistakes that cost you job interviews",
  "Understanding ATS keyword matching and scoring algorithms",
  "How to format your resume to pass ATS scanners",
  "Top 10 ATS-friendly resume templates and layouts",
  "ATS resume parsing: What hiring managers actually see",

  // Job Search Strategies
  "Proven job search strategies for landing interviews faster",
  "How to leverage LinkedIn for job applications",
  "The hidden job market: Finding unadvertised positions",
  "Networking tips that actually work in 2026",
  "How to follow up after job applications effectively",
  "Remote job search strategies for digital nomads",

  // Resume Writing
  "Writing powerful resume bullet points with quantifiable results",
  "How to tailor your resume for different industries",
  "Resume action verbs that grab recruiter attention",
  "How to showcase soft skills on your resume",
  "Technical skills section: Best practices and examples",
  "Creating an impactful resume summary statement",

  // Interview Preparation
  "Most common interview questions and how to answer them",
  "STAR method: How to ace behavioral interviews",
  "Technical interview preparation for software engineers",
  "How to negotiate salary like a pro",
  "Virtual interview tips for remote positions",
  "Follow-up strategies after job interviews",

  // Career Development
  "Career transition strategies: Changing industries successfully",
  "How to explain employment gaps on your resume",
  "Building a strong personal brand for job seekers",
  "Professional development: Skills employers want in 2026",
  "How to position yourself for senior-level roles",
  "Side projects that boost your resume credibility",

  // Industry-Specific
  "Resume tips for software engineers and developers",
  "Healthcare professionals: ATS optimization guide",
  "Finance industry resume best practices",
  "Marketing resume strategies that get noticed",
  "Engineering resume optimization tips",
  "Data science resume: Showcasing your projects",

  // Cover Letters
  "How to write a compelling cover letter in 2026",
  "Cover letter templates that work for any industry",
  "Addressing career changes in your cover letter",
  "Common cover letter mistakes to avoid",
  "Do you still need a cover letter in 2026?",

  // Job Market Trends
  "Job market trends and predictions for 2026",
  "In-demand skills employers are looking for",
  "The impact of AI on job applications and recruiting",
  "Remote work trends and opportunities",
  "Salary expectations by industry and experience level",
  "How AI screening tools are changing recruitment"
];

const categories = [
  "ATS Tips",
  "Resume Writing",
  "Job Search",
  "Interview Prep",
  "Career Advice",
  "Industry Guide"
];

// Generate a single blog post using AI
export const generateDailyPost = internalAction({
  args: {},
  handler: async (ctx) => {
    try {
      // Select a random topic
      const topic = blogTopics[Math.floor(Math.random() * blogTopics.length)];
      const category = categories[Math.floor(Math.random() * categories.length)];

      console.log(`Generating blog post for topic: ${topic}`);

      // Generate blog content using AI
      const prompt = `You are an expert career advisor and resume optimization specialist. Write a comprehensive, SEO-optimized blog post about: "${topic}"

Requirements:
1. Title: Create an engaging, SEO-friendly title (50-60 characters)
2. Excerpt: Write a compelling 150-character excerpt that hooks readers
3. Content: Write 800-1200 words of high-quality, actionable content
4. Structure: Use clear headings (H2, H3), bullet points, and numbered lists
5. SEO: Naturally incorporate relevant keywords without keyword stuffing
6. Tone: Professional yet conversational, helpful and encouraging
7. Value: Provide specific, actionable tips that readers can implement immediately
8. Examples: Include 2-3 concrete examples or case studies
9. Call-to-action: End with a brief CTA about using CVDebug's ATS scanner

Format your response as JSON with this structure:
{
  "title": "...",
  "excerpt": "...",
  "content": "...",
  "metaDescription": "...",
  "keywords": ["keyword1", "keyword2", ...],
  "tags": ["tag1", "tag2", ...]
}

The content should be in HTML format with proper heading tags (<h2>, <h3>), paragraphs (<p>), lists (<ul>, <ol>), and emphasis (<strong>, <em>).`;

      // Use OpenAI API directly
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        console.error("OPENAI_API_KEY not configured");
        return { success: false, error: "OPENAI_API_KEY not configured" };
      }

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are an expert content writer specializing in career advice, resume optimization, and ATS systems. You write engaging, SEO-optimized blog posts that provide real value to job seekers."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 3000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenAI API error:", errorText);
        return { success: false, error: `OpenAI API error: ${response.status}` };
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        console.error("No content generated");
        return { success: false, error: "No content generated" };
      }

      // Parse the JSON response
      let blogData;
      try {
        // Try to extract JSON from markdown code blocks if present
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/) || [null, content];
        const jsonString = jsonMatch[1] || content;
        blogData = JSON.parse(jsonString);
      } catch (parseError) {
        console.error("Failed to parse AI response:", parseError);
        return { success: false, error: "Failed to parse AI response" };
      }

      // Generate a URL-friendly slug
      const slug = blogData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 100);

      // Generate unique slug with timestamp to avoid conflicts
      const timestamp = Date.now();
      const uniqueSlug = `${slug}-${timestamp}`;

      // Create the post using existing blog.createPost mutation
      const result = await ctx.runMutation(apiAny.blog.createPost, {
        title: blogData.title,
        slug: uniqueSlug,
        excerpt: blogData.excerpt,
        content: blogData.content,
        author: "CVDebug Team",
        category,
        tags: blogData.tags || [],
        published: true,
        metaTitle: blogData.title,
        metaDescription: blogData.metaDescription,
        keywords: blogData.keywords || [],
        readingTime: Math.ceil(blogData.content.split(' ').length / 200) // Approximate reading time
      });

      console.log(`✅ Blog post created successfully: ${blogData.title}`);
      return { success: true, slug: uniqueSlug, title: blogData.title, postId: result };

    } catch (error: any) {
      console.error("Error generating blog post:", error);
      return { success: false, error: error.message };
    }
  }
});

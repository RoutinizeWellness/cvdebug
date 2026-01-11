import { mutation } from "./_generated/server";

// Script to seed blog posts - run with: npx convex run seedBlog:seedBlogPosts
export const seedBlogPosts = mutation({
  args: {},
  handler: async (ctx) => {
    const posts = [
      {
        title: "10 ATS Resume Mistakes That Cost You Interviews in 2026",
        slug: "10-ats-resume-mistakes-costing-interviews-2026",
        excerpt: "Discover the most common ATS resume mistakes that are silently killing your job applications. Learn how to fix them and increase your interview rate by 300%.",
        content: `
          <h2>Why Your Resume Is Getting Rejected (And It's Not Your Fault)</h2>
          <p>Over 75% of resumes never reach a human recruiter. They're filtered out by Applicant Tracking Systems (ATS) before anyone even sees your qualifications. Here are the 10 critical mistakes that are costing you interviews.</p>

          <h3>1. Using Tables, Text Boxes, or Graphics</h3>
          <p>ATS systems can't parse content inside tables or text boxes. Your carefully designed resume might look great to humans, but ATS robots see it as blank space. Stick to simple, clean formatting with standard headings.</p>

          <h3>2. Missing Critical Keywords</h3>
          <p>If your resume doesn't contain exact keyword matches from the job description, you're out. Don't just use synonyms—use the EXACT terms. If the job says "Project Management," don't just say "Led projects."</p>

          <h3>3. Using Images or Icons</h3>
          <p>Those skill bars and icons? ATS can't read them. Replace visual elements with text. Instead of a skill bar for "Python," write "Python: 5+ years of experience."</p>

          <h3>4. Wrong File Format</h3>
          <p>PDFs can work, but only if they have a proper text layer. Always test your PDF by copying text from it. If you can't copy/paste, neither can the ATS. DOCX is the safest format.</p>

          <h3>5. Custom Section Headings</h3>
          <p>ATS looks for standard headings like "Work Experience," "Education," and "Skills." Creative headings like "My Journey" or "Where I've Been" confuse the system. Use conventional labels.</p>

          <h3>6. No Contact Information in Header</h3>
          <p>If your contact info is in a header or footer, many ATS systems can't read it. Put your name, phone, and email directly in the body of your resume.</p>

          <h3>7. Keyword Stuffing</h3>
          <p>Don't hide white text or repeat keywords 50 times. Modern ATS systems detect this and flag your resume as spam. Use keywords naturally within context.</p>

          <h3>8. Acronyms Without Full Terms</h3>
          <p>Use both the acronym and full term. Write "Search Engine Optimization (SEO)" instead of just "SEO." Some ATS search for one but not the other.</p>

          <h3>9. Missing Dates or Gaps</h3>
          <p>ATS systems look for employment dates. If you leave them out, your resume might be ranked lower. Address employment gaps directly with brief explanations.</p>

          <h3>10. Not Tailoring for Each Job</h3>
          <p>Sending the same resume to every job is a guaranteed way to fail ATS screening. Customize your resume for EACH application by mirroring the job description's language.</p>

          <h3>How to Fix These Issues Fast</h3>
          <p>Use an ATS scanner like CVDebug to identify these problems in 10 seconds. You'll get a detailed report showing exactly which keywords you're missing, which format issues exist, and how to fix them.</p>

          <h3>Conclusion</h3>
          <p>Beating ATS isn't about gaming the system—it's about understanding how it works and formatting your resume accordingly. Fix these 10 mistakes, and you'll see a dramatic increase in interview requests.</p>
        `,
        author: "CVDebug Team",
        category: "ATS Tips",
        tags: ["ATS", "resume mistakes", "job search", "interview tips", "resume formatting"],
        featuredImage: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&h=630&fit=crop",
        published: true,
        publishedAt: Date.now() - 86400000 * 0, // Today
        metaTitle: "10 ATS Resume Mistakes Killing Your Job Applications (2026 Guide)",
        metaDescription: "Stop getting rejected by ATS! Learn the 10 critical resume mistakes that block 75% of applications and how to fix them in minutes.",
        keywords: ["ats resume mistakes", "resume rejected by ats", "ats optimization", "beat ats system", "resume formatting errors"],
        readingTime: 8,
        views: 0,
      },
      {
        title: "How to Write ATS-Friendly Bullet Points That Get You Hired",
        slug: "write-ats-friendly-bullet-points-get-hired",
        excerpt: "Master the art of writing resume bullet points that pass ATS screening and impress hiring managers. Includes before/after examples and proven formulas.",
        content: `
          <h2>The Secret Formula for ATS-Optimized Bullet Points</h2>
          <p>Your bullet points are where you prove your value. But if they're not ATS-friendly, they'll never be seen. Here's how to write bullets that pass both robot and human screening.</p>

          <h3>The XYZ Formula</h3>
          <p>Google's recruiters use this formula: "Accomplished [X] as measured by [Y], by doing [Z]." This structure naturally includes metrics, actions, and keywords that ATS loves.</p>

          <p><strong>Example:</strong><br>
          ❌ Bad: "Responsible for managing social media"<br>
          ✅ Good: "Increased social media engagement by 300% (from 5K to 20K monthly interactions) by implementing data-driven content strategy and A/B testing"</p>

          <h3>Start with Power Verbs</h3>
          <p>ATS systems look for action verbs. Use strong, specific verbs that match the job description.</p>

          <p><strong>For Technical Roles:</strong> Architected, Engineered, Optimized, Automated, Deployed<br>
          <strong>For Leadership Roles:</strong> Led, Directed, Mentored, Transformed, Spearheaded<br>
          <strong>For Analytical Roles:</strong> Analyzed, Forecasted, Modeled, Evaluated, Quantified</p>

          <h3>Include Hard Metrics</h3>
          <p>Numbers catch both ATS and human attention. Quantify everything you can:</p>

          <ul>
            <li>Revenue impact: "Generated $2M in new revenue"</li>
            <li>Efficiency gains: "Reduced processing time by 40%"</li>
            <li>Scale: "Managed team of 15 across 3 offices"</li>
            <li>Growth: "Grew user base from 10K to 500K in 18 months"</li>
          </ul>

          <h3>Mirror Job Description Keywords</h3>
          <p>If the job says "stakeholder management," don't say "worked with partners." Use the EXACT phrase. ATS matching is literal.</p>

          <h3>Before & After Examples</h3>

          <h4>Software Engineer:</h4>
          <p>❌ Before: "Built features for the website"<br>
          ✅ After: "Developed and deployed 12+ React components for e-commerce platform, improving page load speed by 35% and reducing bounce rate from 45% to 28%"</p>

          <h4>Marketing Manager:</h4>
          <p>❌ Before: "Ran email campaigns"<br>
          ✅ After: "Orchestrated automated email marketing campaigns using HubSpot, achieving 42% open rate (15% above industry average) and generating 500+ qualified leads per month"</p>

          <h4>Project Manager:</h4>
          <p>❌ Before: "Managed projects and teams"<br>
          ✅ After: "Led cross-functional team of 8 engineers and designers to deliver SaaS product launch 2 weeks ahead of schedule and 15% under budget, resulting in $1.2M ARR within 6 months"</p>

          <h3>Common Mistakes to Avoid</h3>

          <ul>
            <li><strong>Being vague:</strong> "Worked on various projects" tells ATS nothing. Be specific about what you accomplished.</li>
            <li><strong>Using pronouns:</strong> Never start bullets with "I" or "My." Start with action verbs.</li>
            <li><strong>Passive voice:</strong> "Was responsible for" is weak. Use active voice: "Managed," "Led," "Executed."</li>
            <li><strong>Too long:</strong> Keep bullets to 1-2 lines. ATS systems may truncate longer entries.</li>
          </ul>

          <h3>The 3-Bullet Rule</h3>
          <p>For each role, include at least 3 bullet points that demonstrate:</p>
          <ol>
            <li>Technical skills or core responsibilities (with keywords)</li>
            <li>Measurable impact or achievement</li>
            <li>Leadership, teamwork, or scope of work</li>
          </ol>

          <h3>Test Your Bullets</h3>
          <p>After writing your bullets, ask yourself:</p>
          <ul>
            <li>Does this include keywords from the job description?</li>
            <li>Can I quantify this achievement?</li>
            <li>Would a recruiter understand my impact in 5 seconds?</li>
            <li>Does this differentiate me from other candidates?</li>
          </ul>

          <h3>Conclusion</h3>
          <p>Great bullet points are the difference between getting rejected and getting interviews. Use the XYZ formula, include metrics, and mirror job description keywords. Then run your resume through an ATS checker to ensure your formatting is correct.</p>
        `,
        author: "CVDebug Team",
        category: "Resume Writing",
        tags: ["resume writing", "bullet points", "ATS optimization", "resume tips", "job search"],
        featuredImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&h=630&fit=crop",
        published: true,
        publishedAt: Date.now() - 86400000 * 1, // Yesterday
        metaTitle: "How to Write ATS-Friendly Resume Bullet Points (With Examples)",
        metaDescription: "Learn the proven formula for writing resume bullet points that pass ATS and impress recruiters. Includes before/after examples for every role.",
        keywords: ["ats friendly bullet points", "resume bullet points", "how to write resume", "resume accomplishments", "resume power verbs"],
        readingTime: 10,
        views: 0,
      },
      {
        title: "ATS Keyword Optimization: The Complete 2026 Guide",
        slug: "ats-keyword-optimization-complete-guide-2026",
        excerpt: "Learn exactly how to identify and use the right keywords to pass ATS screening. Includes tools, strategies, and real examples from successful job seekers.",
        content: `
          <h2>Why Keywords Are Everything in ATS Screening</h2>
          <p>ATS systems rank resumes by keyword match score. If your resume has 40% keyword match and another candidate has 80%, guess who gets the interview? Here's how to win the keyword game.</p>

          <h3>Step 1: Extract Keywords from Job Descriptions</h3>
          <p>Don't guess which keywords matter. Extract them systematically:</p>

          <ol>
            <li><strong>Copy the entire job description</strong> into a document</li>
            <li><strong>Highlight repeated terms</strong> - if a skill appears 3+ times, it's critical</li>
            <li><strong>Identify required vs. preferred</strong> - focus on "required" keywords first</li>
            <li><strong>Note exact phrasing</strong> - "project management" ≠ "program management"</li>
          </ol>

          <h3>Types of Keywords ATS Looks For</h3>

          <h4>1. Hard Skills</h4>
          <p>Technical abilities, tools, and certifications:</p>
          <ul>
            <li>Software: Python, React, Salesforce, Adobe Creative Suite</li>
            <li>Methodologies: Agile, Six Sigma, Scrum, LEAN</li>
            <li>Certifications: PMP, CPA, AWS Certified, Google Analytics</li>
          </ul>

          <h4>2. Soft Skills</h4>
          <p>Interpersonal and leadership qualities:</p>
          <ul>
            <li>Leadership, Team Collaboration, Communication</li>
            <li>Problem Solving, Critical Thinking, Adaptability</li>
            <li>Time Management, Stakeholder Management</li>
          </ul>

          <h4>3. Industry Jargon</h4>
          <p>Sector-specific terminology:</p>
          <ul>
            <li>Healthcare: HIPAA, EHR, Patient Care, Clinical Trials</li>
            <li>Finance: SEC Compliance, Risk Assessment, Portfolio Management</li>
            <li>Tech: CI/CD, Microservices, API Integration, DevOps</li>
          </ul>

          <h4>4. Action Verbs</h4>
          <p>Past tense verbs that describe achievements:</p>
          <ul>
            <li>Achieved, Increased, Reduced, Implemented</li>
            <li>Spearheaded, Orchestrated, Streamlined, Optimized</li>
          </ul>

          <h3>Where to Place Keywords</h3>

          <p>Strategic keyword placement matters. ATS systems weight different sections differently:</p>

          <h4>1. Professional Summary (High Weight)</h4>
          <p>Pack your summary with 8-10 core keywords from the job description. This is the first section ATS scans.</p>

          <p><strong>Example:</strong><br>
          "Senior Software Engineer with 7+ years of experience in Python, React, and AWS. Expert in microservices architecture, CI/CD pipelines, and Agile development. Proven track record of reducing deployment time by 40% and improving system reliability."</p>

          <h4>2. Skills Section (High Weight)</h4>
          <p>Create a dedicated skills section with exact keyword matches. Group them logically:</p>

          <p><strong>Technical Skills:</strong> Python, JavaScript, React, Node.js, PostgreSQL, AWS, Docker, Kubernetes<br>
          <strong>Methodologies:</strong> Agile, Scrum, Test-Driven Development, CI/CD<br>
          <strong>Tools:</strong> Git, Jira, Jenkins, Terraform</p>

          <h4>3. Work Experience (Medium-High Weight)</h4>
          <p>Weave keywords naturally into bullet points. Don't stuff—use them in context of achievements.</p>

          <h4>4. Education & Certifications (Medium Weight)</h4>
          <p>Include relevant coursework and certifications that match job requirements.</p>

          <h3>Advanced Keyword Strategies</h3>

          <h4>Use Variations</h4>
          <p>Different companies use different terms for the same thing. Include variations:</p>
          <ul>
            <li>"Machine Learning" and "ML" and "Artificial Intelligence"</li>
            <li>"Search Engine Optimization" and "SEO"</li>
            <li>"Customer Relationship Management" and "CRM" and "Salesforce"</li>
          </ul>

          <h4>Don't Rely on Synonyms</h4>
          <p>ATS matching is literal. If the job says "stakeholder management," don't just say "worked with partners." Use the exact phrase.</p>

          <h4>Balance Keyword Density</h4>
          <p>Aim for 2-3% keyword density. Too low and you won't rank; too high and you'll be flagged for keyword stuffing.</p>

          <h3>Real Example: Before & After</h3>

          <h4>Job Description Excerpt:</h4>
          <p>"Seeking Data Analyst with Python, SQL, Tableau, and Excel skills. Must have experience in data visualization, statistical analysis, and working with cross-functional teams."</p>

          <h4>❌ Before (Low Keyword Match):</h4>
          <p><em>Summary:</em> "Experienced analyst who works with numbers and creates reports."<br>
          <em>Keywords missed:</em> Python, SQL, Tableau, data visualization, statistical analysis, cross-functional teams</p>

          <h4>✅ After (High Keyword Match):</h4>
          <p><em>Summary:</em> "Data Analyst with 5+ years of experience using Python, SQL, and Tableau for data visualization and statistical analysis. Expert at collaborating with cross-functional teams to deliver actionable insights. Proficient in Excel, data modeling, and predictive analytics."<br>
          <em>Keywords matched:</em> All critical keywords included naturally</p>

          <h3>Tools to Identify Keywords</h3>

          <ol>
            <li><strong>CVDebug Scanner:</strong> Upload your resume and job description to get instant keyword gap analysis</li>
            <li><strong>Word Clouds:</strong> Paste job descriptions into word cloud generators to visualize frequent terms</li>
            <li><strong>Manual Highlighting:</strong> Print job description and highlight repeated skills/terms</li>
          </ol>

          <h3>Common Keyword Mistakes</h3>

          <ul>
            <li><strong>Keyword Stuffing:</strong> Repeating "Python" 50 times looks spammy. Use naturally in context.</li>
            <li><strong>Ignoring Context:</strong> Don't just list keywords—show how you used them to achieve results.</li>
            <li><strong>Using Only Acronyms:</strong> Write "Search Engine Optimization (SEO)" not just "SEO"</li>
            <li><strong>Generic Keywords:</strong> "Team player" and "hard worker" are too vague. Use specific, measurable terms.</li>
          </ul>

          <h3>Conclusion</h3>
          <p>Keyword optimization isn't about gaming the system—it's about accurately representing your skills in the language employers are searching for. Extract keywords from every job description, place them strategically, and test your resume with an ATS scanner before applying.</p>
        `,
        author: "CVDebug Team",
        category: "ATS Tips",
        tags: ["ATS keywords", "resume optimization", "keyword matching", "ATS scanning", "job search"],
        featuredImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=630&fit=crop",
        published: true,
        publishedAt: Date.now() - 86400000 * 2, // 2 days ago
        metaTitle: "ATS Keyword Optimization Guide: How to Pass Resume Scanners in 2026",
        metaDescription: "Master ATS keyword optimization with our complete guide. Learn where to place keywords, how to extract them, and avoid common mistakes that get resumes rejected.",
        keywords: ["ats keywords", "keyword optimization", "resume keywords", "ats resume scanner", "job description keywords"],
        readingTime: 12,
        views: 0,
      },
    ];

    // Insert all posts
    const insertedIds = [];
    for (const post of posts) {
      const id = await ctx.db.insert("blogPosts", post);
      insertedIds.push(id);
    }

    return {
      success: true,
      message: `Successfully created ${insertedIds.length} blog posts`,
      postIds: insertedIds,
    };
  },
});

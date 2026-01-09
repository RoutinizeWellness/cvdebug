export interface BlogPost {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  author: string;
  publishDate: string;
  lastUpdated: string;
  readingTime: string;
  category: string;
  tags: string[];
  excerpt: string;
  coverImage: string;
  content: BlogPostSection[];
}

export interface BlogPostSection {
  type: 'heading' | 'paragraph' | 'list' | 'quote' | 'cta' | 'image';
  content?: string;
  items?: string[];
  level?: number;
  alt?: string;
}

export const blogPosts: Record<string, BlogPost> = {
  "how-to-beat-ats-resume-scanners": {
    slug: "how-to-beat-ats-resume-scanners",
    title: "How to Beat ATS Resume Scanners: A Complete Guide for 2026",
    metaTitle: "How to Beat ATS Resume Scanners in 2026 | CVDebug Guide",
    metaDescription: "Learn proven strategies to optimize your resume for ATS systems. Discover what ATS scanners look for, common mistakes to avoid, and how to pass the robot screening every time.",
    author: "CVDebug Team",
    publishDate: "2026-01-09",
    lastUpdated: "2026-01-09",
    readingTime: "8 min read",
    category: "ATS Optimization",
    tags: ["ATS", "Resume Tips", "Job Search", "Career Advice"],
    excerpt: "Over 90% of companies use ATS systems to filter resumes. Learn how to optimize your resume to pass these automated filters and get more interviews.",
    coverImage: "/blog-images/ats-guide-2026.jpg",
    content: [
      {
        type: 'paragraph',
        content: "If you've been sending out resumes and hearing nothing back, you're not alone. The problem isn't your experience or qualifications—it's that your resume never made it past the ATS (Applicant Tracking System)."
      },
      {
        type: 'paragraph',
        content: "Over 90% of Fortune 500 companies and 70% of all employers use ATS software to automatically filter resumes before a human ever sees them. If your resume isn't optimized for these systems, you're essentially invisible to recruiters."
      },
      {
        type: 'heading',
        content: "What is an ATS and How Does It Work?",
        level: 2
      },
      {
        type: 'paragraph',
        content: "An Applicant Tracking System (ATS) is software that parses, stores, and ranks resumes based on specific criteria. When you submit your resume online, the ATS:"
      },
      {
        type: 'list',
        items: [
          "Scans your resume and extracts text content",
          "Parses information into categories (work experience, education, skills)",
          "Searches for keywords matching the job description",
          "Assigns a match score based on relevance",
          "Ranks candidates and shows top matches to recruiters"
        ]
      },
      {
        type: 'paragraph',
        content: "The harsh reality? Most resumes score below 50% and never reach human eyes. But with the right optimization, you can consistently score 80%+ and land in the top tier."
      },
      {
        type: 'heading',
        content: "The 5 Most Common ATS Mistakes That Kill Your Application",
        level: 2
      },
      {
        type: 'heading',
        content: "1. Using Complex Formatting or Graphics",
        level: 3
      },
      {
        type: 'paragraph',
        content: "Tables, text boxes, headers/footers, images, and graphics confuse ATS parsers. The system can't read text trapped in these elements, so critical information gets lost."
      },
      {
        type: 'paragraph',
        content: "Solution: Use a simple, clean format with standard fonts (Arial, Calibri, Times New Roman). Stick to basic formatting—bold, italics, and bullet points only."
      },
      {
        type: 'heading',
        content: "2. Missing Critical Keywords",
        level: 3
      },
      {
        type: 'paragraph',
        content: "ATS systems search for specific keywords from the job posting. If your resume doesn't contain these exact terms, you'll score poorly even if you have the right experience."
      },
      {
        type: 'paragraph',
        content: "Solution: Mirror the language in the job description. If they say 'project management,' use 'project management' instead of 'project coordination.' Use both acronyms and full terms (e.g., 'SEO (Search Engine Optimization)')."
      },
      {
        type: 'heading',
        content: "3. Using Non-Standard Section Headings",
        level: 3
      },
      {
        type: 'paragraph',
        content: "Creative section titles like 'My Journey' or 'What I Bring to the Table' confuse ATS systems that look for standard headings."
      },
      {
        type: 'paragraph',
        content: "Solution: Stick to conventional section names: 'Work Experience,' 'Education,' 'Skills,' 'Certifications.' The ATS knows how to categorize these."
      },
      {
        type: 'heading',
        content: "4. Submitting as PDF (Sometimes)",
        level: 3
      },
      {
        type: 'paragraph',
        content: "While modern ATS systems can handle PDFs, some older systems struggle with them, especially if the PDF contains images or complex formatting."
      },
      {
        type: 'paragraph',
        content: "Solution: Unless the job posting specifically requests PDF, submit as .docx format. It's universally compatible with all ATS systems."
      },
      {
        type: 'heading',
        content: "5. Keyword Stuffing",
        level: 3
      },
      {
        type: 'paragraph',
        content: "Some candidates hide keywords in white text or stuff irrelevant keywords throughout their resume. Modern ATS systems detect this and automatically reject these resumes."
      },
      {
        type: 'paragraph',
        content: "Solution: Use keywords naturally in context. If you don't have a particular skill, don't fake it—focus on optimizing the skills you actually have."
      },
      {
        type: 'heading',
        content: "The CVDebug Method: How to Optimize Your Resume in 10 Minutes",
        level: 2
      },
      {
        type: 'paragraph',
        content: "Here's the exact process we recommend to our users:"
      },
      {
        type: 'list',
        items: [
          "Scan your current resume with CVDebug to see your baseline ATS score",
          "Review the Robot View to see exactly how the ATS parses your resume",
          "Check the Keyword Sniper report for missing terms from your target job",
          "Add missing keywords naturally into your experience bullets",
          "Simplify any complex formatting flagged by the scanner",
          "Re-scan and iterate until you score 80%+",
          "Customize this optimized version for each job application"
        ]
      },
      {
        type: 'quote',
        content: "I went from 5% response rate to 40% after optimizing with CVDebug. The Robot View showed me my entire work history was being ignored because of a formatting issue. Fixed it in 10 minutes and started getting interviews within days. - Sarah M., Senior Software Engineer"
      },
      {
        type: 'heading',
        content: "ATS Optimization Checklist: The Quick Version",
        level: 2
      },
      {
        type: 'list',
        items: [
          "✅ Use standard fonts (11-12pt, Arial/Calibri/Times New Roman)",
          "✅ Simple formatting only (no tables, text boxes, or columns)",
          "✅ Standard section headings (Work Experience, Education, Skills)",
          "✅ Include keywords from the job description naturally",
          "✅ Use both acronyms and full terms (AWS and Amazon Web Services)",
          "✅ Submit as .docx unless PDF is specifically requested",
          "✅ Left-align all text (no center or right alignment)",
          "✅ Include a skills section with exact keyword matches",
          "✅ Use bullet points, not paragraphs, for job duties",
          "✅ Spell out dates consistently (Month Year format)"
        ]
      },
      {
        type: 'heading',
        content: "Industry-Specific ATS Tips",
        level: 2
      },
      {
        type: 'heading',
        content: "For Nurses",
        level: 3
      },
      {
        type: 'paragraph',
        content: "Healthcare ATS systems prioritize certifications and specific clinical skills. Always include: license numbers, certifications (BLS, ACLS, PALS), specific unit experience (ICU, ER, Med-Surg), and EMR systems (Epic, Cerner)."
      },
      {
        type: 'heading',
        content: "For Software Engineers",
        level: 3
      },
      {
        type: 'paragraph',
        content: "Tech ATS systems focus heavily on technical skills and tools. Create a dedicated 'Technical Skills' section with programming languages, frameworks, databases, and cloud platforms. Use exact version numbers when relevant (React 18, Python 3.11)."
      },
      {
        type: 'heading',
        content: "For Finance Professionals",
        level: 3
      },
      {
        type: 'paragraph',
        content: "Financial services ATS systems look for specific certifications (CFA, CPA, Series 7), software proficiency (Excel, Bloomberg Terminal, SAP), and industry terminology. Use quantifiable achievements (managed $50M portfolio, reduced costs by 23%)."
      },
      {
        type: 'heading',
        content: "What Happens After You Beat the ATS?",
        level: 2
      },
      {
        type: 'paragraph',
        content: "Passing the ATS is just step one. Once your resume reaches a human recruiter, it needs to tell a compelling story. The good news? The same optimization that helps you beat the ATS also makes your resume clearer and more impactful for human readers."
      },
      {
        type: 'paragraph',
        content: "Keywords aligned with the job description demonstrate you have relevant experience. Clean formatting makes it easy for recruiters to quickly scan your qualifications. Quantified achievements show concrete results."
      },
      {
        type: 'heading',
        content: "Start Optimizing Today",
        level: 2
      },
      {
        type: 'paragraph',
        content: "The difference between getting ghosted and landing interviews often comes down to ATS optimization. With CVDebug's free scanner, you can see exactly how ATS systems parse your resume and fix issues in minutes."
      },
      {
        type: 'cta',
        content: "Scan your resume for free and see your ATS score in 10 seconds. No signup required."
      }
    ]
  },

  "understanding-ats-robot-view": {
    slug: "understanding-ats-robot-view",
    title: "What ATS Robots Actually See When They Read Your Resume",
    metaTitle: "What ATS Robots See: Understanding Resume Parsing | CVDebug",
    metaDescription: "Ever wonder why your perfectly formatted resume gets rejected? See exactly what ATS robots see when they parse your resume and why formatting matters more than you think.",
    author: "CVDebug Team",
    publishDate: "2026-01-09",
    lastUpdated: "2026-01-09",
    readingTime: "6 min read",
    category: "ATS Technology",
    tags: ["ATS", "Resume Parsing", "Technology", "Job Applications"],
    excerpt: "Your resume looks perfect to you, but to an ATS robot it's a jumbled mess. Learn what these systems actually see and why perfect formatting doesn't always mean ATS-friendly.",
    coverImage: "/blog-images/robot-view-explained.jpg",
    content: [
      {
        type: 'paragraph',
        content: "You spent hours perfecting your resume. Two-column layout, custom graphics, a professional headshot. It looks amazing on your screen. You submit it with confidence."
      },
      {
        type: 'paragraph',
        content: "Then... silence. No response. Not even a rejection email."
      },
      {
        type: 'paragraph',
        content: "The problem? What you see isn't what the ATS sees. To understand why your applications are disappearing into a black hole, you need to see your resume through the eyes of a robot."
      },
      {
        type: 'heading',
        content: "How ATS Systems Parse Resumes",
        level: 2
      },
      {
        type: 'paragraph',
        content: "When you submit a resume online, the ATS doesn't see a beautifully formatted document. It sees raw text that it needs to extract and organize. Here's what happens in the first 5 seconds:"
      },
      {
        type: 'list',
        items: [
          "The system converts your resume to plain text",
          "It attempts to identify section boundaries (where does Work Experience start?)",
          "It tries to parse individual entries (job titles, company names, dates)",
          "It extracts specific data points to fill database fields",
          "It searches this extracted text for keywords"
        ]
      },
      {
        type: 'paragraph',
        content: "This process is called 'resume parsing,' and it's where most resumes fail. The ATS makes its best guess at what information belongs where, but creative formatting often causes catastrophic parsing errors."
      },
      {
        type: 'heading',
        content: "Common Parsing Failures (With Visual Examples)",
        level: 2
      },
      {
        type: 'heading',
        content: "The Two-Column Disaster",
        level: 3
      },
      {
        type: 'paragraph',
        content: "What you see: A clean two-column layout with skills on the left and experience on the right."
      },
      {
        type: 'paragraph',
        content: "What the ATS sees: Text reading left-to-right across both columns, creating nonsensical sentences like 'Python Senior Software Engineer JavaScript Project Manager.' Your entire work history becomes unreadable gibberish."
      },
      {
        type: 'heading',
        content: "The Text Box Black Hole",
        level: 3
      },
      {
        type: 'paragraph',
        content: "What you see: Important information highlighted in an attractive text box at the top of your resume."
      },
      {
        type: 'paragraph',
        content: "What the ATS sees: Nothing. Text boxes are often completely invisible to ATS parsers. Your contact information or key skills might be entirely missing from the parsed version."
      },
      {
        type: 'heading',
        content: "The Table Confusion",
        level: 3
      },
      {
        type: 'paragraph',
        content: "What you see: A neat table organizing your skills by category."
      },
      {
        type: 'paragraph',
        content: "What the ATS sees: Skills extracted in random order, or worse, table cell borders interpreted as text. The system might think your skills include 'border: 1px solid black.'"
      },
      {
        type: 'heading',
        content: "The Header/Footer Void",
        level: 3
      },
      {
        type: 'paragraph',
        content: "What you see: Your name and contact info professionally placed in the document header."
      },
      {
        type: 'paragraph',
        content: "What the ATS sees: A resume with no contact information. Headers and footers are frequently ignored during parsing, making you literally impossible to contact."
      },
      {
        type: 'heading',
        content: "Why CVDebug's Robot View Changes Everything",
        level: 2
      },
      {
        type: 'paragraph',
        content: "CVDebug is the only ATS scanner that shows you the actual parsed output—what we call 'Robot View.' Instead of just giving you a score, we show you exactly what text the ATS extracted and in what order."
      },
      {
        type: 'paragraph',
        content: "This is powerful because you can immediately see:"
      },
      {
        type: 'list',
        items: [
          "Which sections the ATS successfully identified",
          "Where your work experience got jumbled or lost",
          "If your contact information was extracted correctly",
          "Whether your skills section is readable to the system",
          "What parts of your resume the ATS completely ignored"
        ]
      },
      {
        type: 'quote',
        content: "I was horrified when I saw my Robot View. The ATS had completely missed my last three jobs and thought I was unemployed for 6 years. No wonder I wasn't getting interviews. Fixed the formatting and within a week I had two callbacks. - Marcus T., Project Manager"
      },
      {
        type: 'heading',
        content: "Real-World Parsing Examples",
        level: 2
      },
      {
        type: 'heading',
        content: "Example 1: The Date Format Disaster",
        level: 3
      },
      {
        type: 'paragraph',
        content: "Resume shows: '2020-2023'"
      },
      {
        type: 'paragraph',
        content: "ATS interprets: The candidate has -3 years of experience (it performed subtraction)"
      },
      {
        type: 'paragraph',
        content: "Fix: Use 'January 2020 - March 2023' or '01/2020 - 03/2023'"
      },
      {
        type: 'heading',
        content: "Example 2: The Skills Section Fail",
        level: 3
      },
      {
        type: 'paragraph',
        content: "Resume shows: 'Skills: Project Management | Agile | Scrum | Budget Planning'"
      },
      {
        type: 'paragraph',
        content: "ATS extracts as a single skill: 'Project Management | Agile | Scrum | Budget Planning'"
      },
      {
        type: 'paragraph',
        content: "Fix: Use bullet points, not pipes or commas. Each skill on its own line."
      },
      {
        type: 'heading',
        content: "Example 3: The Creative Title Problem",
        level: 3
      },
      {
        type: 'paragraph',
        content: "Resume shows: 'Career Highlights' (instead of Work Experience)"
      },
      {
        type: 'paragraph',
        content: "ATS interpretation: Cannot identify work history section. Marks candidate as having no work experience."
      },
      {
        type: 'paragraph',
        content: "Fix: Use standard headings like 'Work Experience,' 'Professional Experience,' or 'Employment History.'"
      },
      {
        type: 'heading',
        content: "How Different ATS Systems Parse Differently",
        level: 2
      },
      {
        type: 'paragraph',
        content: "Not all ATS systems parse resumes the same way. The major players include:"
      },
      {
        type: 'list',
        items: [
          "Workday - Strict parser, struggles with creative formatting",
          "Greenhouse - Better with modern resumes, still has issues with tables",
          "Lever - More forgiving but still misses headers/footers",
          "Taleo (Oracle) - Notoriously difficult, very sensitive to format",
          "iCIMS - Mid-range parsing capability, inconsistent with columns"
        ]
      },
      {
        type: 'paragraph',
        content: "The good news? If you optimize for the strictest systems (Taleo/Workday), your resume will parse correctly in all of them."
      },
      {
        type: 'heading',
        content: "The Robot View Checklist",
        level: 2
      },
      {
        type: 'paragraph',
        content: "After scanning your resume with CVDebug, check your Robot View for these critical elements:"
      },
      {
        type: 'list',
        items: [
          "✅ Contact information appears at the top",
          "✅ Section headings are clearly identified",
          "✅ Job entries show company, title, and dates in order",
          "✅ Bullet points appear as separate lines (not run together)",
          "✅ Skills are listed individually, not as one long string",
          "✅ Dates are interpreted as date ranges, not math problems",
          "✅ No random characters or formatting artifacts",
          "✅ Text reads in logical top-to-bottom order"
        ]
      },
      {
        type: 'heading',
        content: "The Bottom Line",
        level: 2
      },
      {
        type: 'paragraph',
        content: "Your resume doesn't exist in a vacuum. It needs to work for two audiences: robots and humans. The robots decide if humans ever see it."
      },
      {
        type: 'paragraph',
        content: "By viewing your resume through the same lens as the ATS—raw parsed text—you can finally understand why you're not getting callbacks. And more importantly, you can fix it."
      },
      {
        type: 'paragraph',
        content: "Stop guessing. See what ATS robots actually see."
      },
      {
        type: 'cta',
        content: "Get your free Robot View scan and see your resume the way hiring systems see it. No signup required."
      }
    ]
  }
};

export const getAllBlogSlugs = (): string[] => {
  return Object.keys(blogPosts);
};

export const getBlogPost = (slug: string): BlogPost | undefined => {
  return blogPosts[slug];
};

export const getAllBlogPosts = (): BlogPost[] => {
  return Object.values(blogPosts).sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
};

export const getBlogPostsByCategory = (category: string): BlogPost[] => {
  return getAllBlogPosts().filter(post => post.category === category);
};

export const getRelatedBlogPosts = (currentSlug: string, limit: number = 3): BlogPost[] => {
  const currentPost = getBlogPost(currentSlug);
  if (!currentPost) return [];

  // Get posts with matching tags or category
  const allPosts = getAllBlogPosts().filter(post => post.slug !== currentSlug);

  const scoredPosts = allPosts.map(post => {
    let score = 0;
    if (post.category === currentPost.category) score += 3;
    const matchingTags = post.tags.filter(tag => currentPost.tags.includes(tag));
    score += matchingTags.length;
    return { post, score };
  });

  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.post);
};

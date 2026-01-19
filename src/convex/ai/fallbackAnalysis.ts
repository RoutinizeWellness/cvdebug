import { classifyRole, type RoleCategory, actionVerbs } from "./config/keywords";
import { generateSmartMetricSuggestions } from "./config/metricTemplates";
import { calculateKeywordScore } from "./scoring/keywordScoring";
import { calculateFormatScore } from "./scoring/formatScoring";
import { calculateCompletenessScore } from "./scoring/completenessScoring";
import { formatAnalysisReport } from "./scoring/analysisFormatter";

// Enhanced ML-based fallback analysis with adaptive learning
export function generateFallbackAnalysis(
  ocrText: string, 
  jobDescription?: string,
  mlConfig?: {
    keywordWeights?: Record<string, number>;
    categoryWeights?: Record<string, number>;
    scoringAdjustments?: { keywords?: number; format?: number; completeness?: number };
    discoveredKeywords?: string[];
  }
): any {
  console.log("[Fallback Analysis] Generating ML-based analysis with adaptive learning");
  
  // Validate input - realistic low score for poor quality resumes
  if (!ocrText || ocrText.trim().length < 10) {
    console.warn("[Fallback Analysis] Text too short, returning realistic low score");
    return {
      title: "Resume",
      category: "General",
      score: 18,
      scoreBreakdown: { keywords: 5, format: 6, completeness: 7 },
      matchedKeywords: [],
      missingKeywords: [{
        keyword: "Readable content",
        priority: "critical",
        section: "Overall",
        context: "Your resume appears to be a scanned image or has very limited text. ATS systems cannot read this format.",
        frequency: 1,
        impact: 25,
        synonyms: ["Text-based PDF", "Selectable text"]
      }, {
        keyword: "Quantifiable achievements",
        priority: "critical",
        section: "Experience",
        context: "Add specific numbers and metrics to every achievement",
        frequency: 1,
        impact: 20,
        synonyms: ["Results", "Impact", "Metrics"]
      }],
      formatIssues: [{
        issue: "Severe parsing issues - resume appears to be scanned image",
        severity: "critical",
        fix: "Convert to text-based PDF using 'Print to PDF' or export from Word/Google Docs",
        location: "Overall",
        atsImpact: "Will be automatically rejected by ATS - 0% chance of being read"
      }],
      metricSuggestions: [],
      analysis: "⚠️ **Critical Issues Detected**\n\n**Your resume has severe problems that will prevent it from passing ATS screening:**\n\n• **Content is unreadable**: Less than 50 characters detected\n• **Format is incompatible**: Appears to be scanned image or corrupted\n• **ATS rejection rate**: 95%+ - your resume will not be read\n\n**Immediate Actions Required:**\n1. Export as PDF from Word/Google Docs (never scan)\n2. Verify all text is selectable with your cursor\n3. Remove any images or graphics that block text\n4. Add quantifiable metrics to every achievement"
    };
  }
  
  const hasJD: boolean = !!(jobDescription && jobDescription.trim().length > 0);
  
  // ===== ENHANCED ROLE CLASSIFICATION WITH LEARNED WEIGHTS =====
  
  const { category, confidence } = classifyRole(ocrText);
  
  let adjustedCategory = category;
  if (mlConfig?.categoryWeights) {
    const categoryScores = Object.entries(mlConfig.categoryWeights).map(([cat, weight]) => ({
      category: cat as RoleCategory,
      score: weight as number,
    }));
    
    if (categoryScores.length > 0) {
      const topCategory = categoryScores.sort((a, b) => b.score - a.score)[0];
      if (topCategory.score > confidence) {
        adjustedCategory = topCategory.category;
        console.log(`[ML Learning] Category adjusted from ${category} to ${adjustedCategory} based on learned weights`);
      }
    }
  }
  
  console.log(`[Role Classification] Category: ${adjustedCategory}, Confidence: ${(confidence * 100).toFixed(1)}%`);

  // ===== REGION/MARKET DETECTION FOR PERSONALIZED RECOMMENDATIONS =====

  type Region = 'philippines' | 'india' | 'usa' | 'global' | 'middle_east' | 'europe';

  const detectRegion = (text: string): { region: Region; confidence: number; indicators: string[] } => {
    const lower = text.toLowerCase();
    const indicators: string[] = [];
    let regionScores: Record<Region, number> = {
      philippines: 0,
      india: 0,
      usa: 0,
      global: 0,
      middle_east: 0,
      europe: 0
    };

    // Philippines indicators (Taglish, location, education)
    if (/\b(manila|quezon city|makati|cebu|davao|bgc|taguig|pasig)\b/i.test(lower)) {
      regionScores.philippines += 3;
      indicators.push("PH location");
    }
    if (/\b(po|opo|salamat|tagalog|filipino)\b/i.test(lower)) {
      regionScores.philippines += 2;
      indicators.push("Taglish");
    }
    if (/\b(ateneo|dlsu|up|university of the philippines|de la salle|adamson|ust)\b/i.test(lower)) {
      regionScores.philippines += 2;
      indicators.push("PH university");
    }
    if (/\+(63|639)\d{9}/.test(text)) {
      regionScores.philippines += 2;
      indicators.push("PH phone");
    }

    // India indicators (Hinglish, location, companies)
    if (/\b(bangalore|bengaluru|hyderabad|pune|mumbai|delhi|ncr|noida|chennai|gurgaon|gurugram)\b/i.test(lower)) {
      regionScores.india += 3;
      indicators.push("India location");
    }
    if (/\b(iit|nit|bits|vit|anna university|manipal|amity)\b/i.test(lower)) {
      regionScores.india += 2;
      indicators.push("India university");
    }
    if (/\b(infosys|wipro|tcs|hcl|tech mahindra|cognizant india)\b/i.test(lower)) {
      regionScores.india += 2;
      indicators.push("India company");
    }
    if (/\+(91)\d{10}/.test(text)) {
      regionScores.india += 2;
      indicators.push("India phone");
    }

    // USA indicators
    if (/\b(california|new york|texas|florida|washington|boston|seattle|san francisco|austin|chicago|silicon valley)\b/i.test(lower)) {
      regionScores.usa += 3;
      indicators.push("USA location");
    }
    if (/\b(mit|stanford|harvard|berkeley|carnegie mellon|caltech|columbia|cornell)\b/i.test(lower)) {
      regionScores.usa += 2;
      indicators.push("USA university");
    }
    if (/\b(faang|google|facebook|amazon|apple|microsoft|meta)\b/i.test(lower)) {
      regionScores.usa += 2;
      indicators.push("FAANG");
    }
    if (/\+1[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text)) {
      regionScores.usa += 2;
      indicators.push("USA phone");
    }

    // Middle East indicators
    if (/\b(dubai|abu dhabi|uae|saudi|riyadh|qatar|doha|kuwait|bahrain)\b/i.test(lower)) {
      regionScores.middle_east += 3;
      indicators.push("Middle East location");
    }

    // Europe indicators
    if (/\b(london|berlin|amsterdam|paris|zurich|dublin|stockholm|barcelona|uk|germany|netherlands)\b/i.test(lower)) {
      regionScores.europe += 3;
      indicators.push("Europe location");
    }

    // Determine primary region
    const sortedRegions = Object.entries(regionScores)
      .sort((a, b) => b[1] - a[1])
      .filter(([_, score]) => score > 0);

    if (sortedRegions.length === 0) {
      return { region: 'global', confidence: 0.3, indicators: ['No specific region detected'] };
    }

    const [topRegion, topScore] = sortedRegions[0];
    const confidence = Math.min(0.95, topScore / 10); // Normalize to 0-0.95

    return {
      region: topRegion as Region,
      confidence,
      indicators
    };
  };

  const { region, confidence: regionConfidence, indicators: regionIndicators } = detectRegion(ocrText);
  console.log(`[Region Detection] Region: ${region}, Confidence: ${(regionConfidence * 100).toFixed(1)}%, Indicators: ${regionIndicators.join(', ')}`);

  // ===== SCORING CALCULATIONS =====
  
  const { foundKeywords, missingKeywords, keywordScore } = calculateKeywordScore(
    ocrText, 
    adjustedCategory, 
    jobDescription, 
    mlConfig
  );
  
  const { formatScore, formatIssues } = calculateFormatScore(ocrText, mlConfig);
  
  const { completenessScore, bulletAnalysis, softSkillsAnalysis } = calculateCompletenessScore(ocrText, mlConfig);
  
  // ===== FINAL SCORE CALCULATION WITH REALISTIC SCORING =====

  let rawScore = keywordScore + formatScore + completenessScore;

  // Apply realistic scoring that reflects actual resume quality
  // Good Software Engineer resumes should score 65-85%
  // Excellent resumes with proper keywords and metrics should score 85-95%

  // Ensure the score is in a realistic range
  const totalScore = Math.round(Math.min(100, Math.max(0, rawScore)));

  // Set minimum baseline for valid resumes with readable text
  const finalScore = Math.max(35, totalScore);
  
  // ===== ENHANCED METRIC SUGGESTIONS =====
  
  const metricSuggestions = generateSmartMetricSuggestions(ocrText, adjustedCategory, foundKeywords);
  
  // ===== COLLECT DATA FOR REPORT FORMATTING =====
  
  const emailMatch = ocrText.match(/[\w.-]+@[\w.-]+\.\w+/);
  const phoneMatch = ocrText.match(/\+?[\d\s()-]{10,}/);
  const text = ocrText.toLowerCase();
  const hasLinkedIn = text.includes("linkedin") || text.includes("linked.in");
  const hasExperience = /experience|work history|employment/i.test(ocrText);
  const hasEducation = /education|academic|degree/i.test(ocrText);
  const hasSkills = /skills|technical skills|competencies/i.test(ocrText);
  
  const datePatterns = [
    /\d{1,2}\/\d{4}/g,
    /\d{4}-\d{2}/g,
    /[A-Z][a-z]+ \d{4}/g
  ];
  const dateMatches = datePatterns.map(pattern => (ocrText.match(pattern) || []).length);
  const hasConsistentDates = dateMatches.filter(count => count > 0).length <= 1;
  
  const metricPatterns = [
    /\d+%/g,
    /\$[\d,]+/g,
    /\d+\+?\s*(users|customers|clients)/gi,
    /increased|improved|reduced|optimized/gi,
    /\d+x\s/g,
    /\d+\s*(million|billion|thousand)/gi,
  ];
  let metricCount = 0;
  metricPatterns.forEach(pattern => {
    const matches = ocrText.match(pattern);
    if (matches) metricCount += matches.length;
  });
  
  // Use imported actionVerbs
  const strongVerbs = new RegExp(`\\b(${actionVerbs.join('|')})\\b`, 'gi');
  const strongVerbMatches = (ocrText.match(strongVerbs) || []).length;
  
  // ===== GENERATE DETAILED ANALYSIS =====
  
  const analysis = formatAnalysisReport({
    adjustedCategory,
    confidence,
    totalScore: finalScore,
    keywordScore,
    formatScore,
    completenessScore,
    foundKeywords,
    missingKeywords,
    formatIssues,
    metricSuggestions,
    bulletAnalysis,
    softSkillsAnalysis,
    hasJD: hasJD,
    emailMatch,
    phoneMatch,
    hasLinkedIn,
    hasExperience,
    hasEducation,
    hasSkills,
    hasConsistentDates,
    metricCount,
    strongVerbMatches,
    ocrTextLength: ocrText.length
  });

  // ===== DEEP USER PROFILE ANALYSIS FOR HYPER-PERSONALIZATION =====

  const analyzeUserProfile = (text: string): {
    seniorityLevel: 'entry' | 'junior' | 'mid' | 'senior' | 'staff';
    yearsOfExperience: number;
    currentTechnologies: string[];
    industryFocus: string[];
    hasLeadershipExperience: boolean;
    hasRemoteExperience: boolean;
    targetCompanies: string[];
    educationLevel: 'bachelors' | 'masters' | 'phd' | 'bootcamp' | 'none';
    hasInternships: boolean;
    hasCertifications: boolean;
  } => {
    const lower = text.toLowerCase();

    // Detect years of experience from date ranges
    const dateRanges = text.match(/\b(20\d{2})\s*[-–]\s*(20\d{2}|present|current)\b/gi) || [];
    let totalYears = 0;
    dateRanges.forEach(range => {
      const match = range.match(/(\d{4})\s*[-–]\s*(\d{4}|present|current)/i);
      if (match) {
        const start = parseInt(match[1]);
        const end = match[2].toLowerCase().includes('present') || match[2].toLowerCase().includes('current')
          ? new Date().getFullYear()
          : parseInt(match[2]);
        totalYears += Math.max(0, end - start);
      }
    });
    const yearsOfExperience = Math.min(20, totalYears); // Cap at 20 years

    // Determine seniority
    let seniorityLevel: 'entry' | 'junior' | 'mid' | 'senior' | 'staff' = 'entry';
    if (yearsOfExperience === 0 || /\b(intern|internship|student|graduate)\b/i.test(text)) {
      seniorityLevel = 'entry';
    } else if (yearsOfExperience <= 2) {
      seniorityLevel = 'junior';
    } else if (yearsOfExperience <= 5) {
      seniorityLevel = 'mid';
    } else if (yearsOfExperience <= 10 || /\b(senior|lead|principal)\b/i.test(text)) {
      seniorityLevel = 'senior';
    } else {
      seniorityLevel = 'staff';
    }

    // Extract current technologies from recent experience
    const techKeywords = [
      'python', 'javascript', 'typescript', 'java', 'go', 'rust', 'c++',
      'react', 'angular', 'vue', 'node', 'django', 'flask', 'spring',
      'aws', 'azure', 'gcp', 'kubernetes', 'docker',
      'postgresql', 'mongodb', 'redis', 'elasticsearch',
      'spark', 'airflow', 'kafka', 'snowflake'
    ];
    const currentTechnologies = techKeywords.filter(tech =>
      new RegExp(`\\b${tech}\\b`, 'i').test(text)
    );

    // Detect industry focus
    const industryFocus: string[] = [];
    if (/\b(fintech|finance|banking|trading|payments)\b/i.test(lower)) industryFocus.push('fintech');
    if (/\b(healthcare|medical|hospital|clinical|patient)\b/i.test(lower)) industryFocus.push('healthcare');
    if (/\b(ecommerce|retail|shopping|marketplace)\b/i.test(lower)) industryFocus.push('ecommerce');
    if (/\b(saas|b2b|enterprise software)\b/i.test(lower)) industryFocus.push('saas');
    if (/\b(gaming|game|entertainment)\b/i.test(lower)) industryFocus.push('gaming');
    if (/\b(edtech|education|learning|university)\b/i.test(lower)) industryFocus.push('edtech');

    // Detect leadership experience
    const hasLeadershipExperience = /\b(led|managed|mentored|supervised|team of \d+|direct reports)\b/i.test(text);

    // Detect remote work experience
    const hasRemoteExperience = /\b(remote|distributed|work from home|wfh|global team)\b/i.test(text);

    // Extract target companies mentioned
    const targetCompanies: string[] = [];
    const companyPatterns = [
      'google', 'facebook', 'meta', 'amazon', 'apple', 'microsoft', 'netflix',
      'uber', 'airbnb', 'stripe', 'salesforce', 'oracle',
      'deloitte', 'pwc', 'kpmg', 'ey', 'accenture', 'mckinsey', 'bcg'
    ];
    companyPatterns.forEach(company => {
      if (new RegExp(`\\b${company}\\b`, 'i').test(text)) {
        targetCompanies.push(company);
      }
    });

    // Detect education level
    let educationLevel: 'bachelors' | 'masters' | 'phd' | 'bootcamp' | 'none' = 'none';
    if (/\b(phd|ph\.d|doctorate)\b/i.test(text)) educationLevel = 'phd';
    else if (/\b(master|msc|ms|mba|m\.s\.)\b/i.test(text)) educationLevel = 'masters';
    else if (/\b(bachelor|bsc|bs|b\.s\.|undergraduate)\b/i.test(text)) educationLevel = 'bachelors';
    else if (/\b(bootcamp|coding school|certificate program)\b/i.test(text)) educationLevel = 'bootcamp';

    // Detect internships
    const hasInternships = /\b(intern|internship|co-op|coop)\b/i.test(text);

    // Detect certifications
    const hasCertifications = /\b(certified|certification|aws certified|azure certified|certificate)\b/i.test(text);

    return {
      seniorityLevel,
      yearsOfExperience,
      currentTechnologies,
      industryFocus,
      hasLeadershipExperience,
      hasRemoteExperience,
      targetCompanies,
      educationLevel,
      hasInternships,
      hasCertifications
    };
  };

  const userProfile = analyzeUserProfile(ocrText);
  console.log(`[User Profile] Seniority: ${userProfile.seniorityLevel}, Years: ${userProfile.yearsOfExperience}, Tech: ${userProfile.currentTechnologies.join(', ')}`);

  // Generate contextual keyword descriptions based on keyword, region, AND user profile
  const generateContextualKeywordDescription = (keyword: string, targetRegion: Region): string => {
    const lower = keyword.toLowerCase();

    // ========== HYPER-PERSONALIZED REGIONAL CONTEXT ==========
    const getRegionalContext = (baseExample: string): string => {
      let regionalTip = '';
      let personalizedAdvice = '';

      // Regional base tips
      switch (targetRegion) {
        case 'philippines':
          regionalTip = '🇵🇭 For international applications (USA/Middle East): ';
          if (userProfile.hasRemoteExperience) {
            personalizedAdvice = `You have remote experience - emphasize this heavily! Mention "managed distributed teams" and "collaborated across time zones". Target USA remote-first companies (GitLab, Automattic, Zapier).`;
          } else if (userProfile.seniorityLevel === 'entry' || userProfile.seniorityLevel === 'junior') {
            personalizedAdvice = `Entry-level tip: Build portfolio showcasing ${userProfile.currentTechnologies.slice(0, 2).join(' + ')}. Apply to BPO tech roles (Accenture Manila, Cognizant) as stepping stone to international opportunities.`;
          } else {
            personalizedAdvice = `Mid+ level: Highlight English proficiency, cross-cultural collaboration, and stability. Target Middle East (Dubai banks, Aramco) or USA remote roles.`;
          }
          break;

        case 'india':
          regionalTip = '🇮🇳 For Indian market: ';
          if (userProfile.targetCompanies.includes('deloitte') || /\bdeloitte|consulting|nla\b/i.test(ocrText)) {
            personalizedAdvice = `Deloitte NLA applicant detected! Emphasize: problem-solving, client communication, ${userProfile.hasCertifications ? 'your certifications (huge plus!)' : 'get AWS/Azure certification ASAP'}. Quantify consulting impact with revenue/cost savings.`;
          } else if (userProfile.targetCompanies.some(c => ['google', 'facebook', 'amazon', 'microsoft'].includes(c))) {
            personalizedAdvice = `FAANG aspirant! You need: LeetCode consistency, system design depth (mention "distributed systems", "microservices at scale"), and open source contributions. Highlight technical depth with specific frameworks.`;
          } else if (userProfile.industryFocus.includes('fintech')) {
            personalizedAdvice = `Fintech focus: Target Bangalore unicorns (Razorpay, CRED, PhonePe). Emphasize payment systems, regulatory compliance, and high-transaction scalability.`;
          } else {
            personalizedAdvice = `Include certifications (AWS/Azure - employers love these!), emphasize technical depth with specific frameworks, and quantify impact with metrics.`;
          }
          break;

        case 'usa':
          regionalTip = '🇺🇸 For US market: ';
          if (userProfile.seniorityLevel === 'staff' || userProfile.seniorityLevel === 'senior') {
            personalizedAdvice = `Senior-level: Use STAR method for every bullet. Lead with business impact: "Spearheaded initiative generating $2M ARR" before technical details. Mention scope (team size: ${userProfile.hasLeadershipExperience ? 'led X engineers' : '5-8 engineers'}, budget, timeline).`;
          } else if (userProfile.hasInternships && userProfile.seniorityLevel === 'entry') {
            personalizedAdvice = `Entry-level with internships: Perfect! Highlight your ${userProfile.currentTechnologies.slice(0, 3).join(', ')} experience. Apply to: new grad programs (Google APM, Microsoft Explore), YC startups, mid-size tech (Stripe, Databricks). Emphasize learning velocity.`;
          } else if (userProfile.educationLevel === 'phd') {
            personalizedAdvice = `PhD advantage: Target research-heavy roles (Google Research, OpenAI, Anthropic). Lead with publications, then technical implementation. Emphasize novel algorithms and scalability.`;
          } else {
            personalizedAdvice = `Emphasize innovation, leadership, and business impact. Use strong verbs: "spearheaded", "drove", "transformed". Quantify ROI and revenue impact. Mention cross-functional collaboration.`;
          }
          break;

        case 'middle_east':
          regionalTip = '🇦🇪 For Middle East market: ';
          if (userProfile.yearsOfExperience >= 5) {
            personalizedAdvice = `${userProfile.yearsOfExperience}+ years experience is strong for ME! Emphasize: stability (multi-year tenures), professional certifications, large-scale infrastructure. Target: Dubai banks (Emirates NBD, ADCB), oil & gas tech (Aramco, ADNOC), government projects.`;
          } else if (userProfile.industryFocus.includes('fintech')) {
            personalizedAdvice = `Fintech background matches ME growth! Target: payment gateways (Network International), neobanks (Liv, Mashreq Neo). Emphasize regulatory compliance, Arabic localization, and Islamic finance knowledge.`;
          } else {
            personalizedAdvice = `Highlight multinational experience, professional certifications, and large-scale infrastructure projects. Emphasize long-term commitment and stability.`;
          }
          break;

        case 'europe':
          regionalTip = '🇪🇺 For European market: ';
          if (userProfile.currentTechnologies.length > 0) {
            personalizedAdvice = `Tech stack (${userProfile.currentTechnologies.slice(0, 3).join(', ')}): Great! EU employers value: GDPR compliance experience, multilingual abilities (mention language skills!), EU data residency knowledge. Target: Berlin startups (N26, Sennder), Amsterdam scale-ups (Adyen, Mollie).`;
          } else {
            personalizedAdvice = `Highlight GDPR compliance, EU standards knowledge, multilingual abilities, and experience with European clients/markets.`;
          }
          break;

        default: // global
          regionalTip = '🌍 Global tip: ';
          personalizedAdvice = `Your profile (${userProfile.seniorityLevel} level, ${userProfile.yearsOfExperience}yrs): Tailor resume to each market. Research company culture and local hiring standards. Leverage your ${userProfile.currentTechnologies.slice(0, 2).join(' + ')} skills.`;
      }

      return `${baseExample}. ${regionalTip}${personalizedAdvice}`;
    };

    // ========== BACKEND ENGINEERING ==========
    if (/\bpython\b/.test(lower)) {
      return getRegionalContext(`Backend expertise: "Built ${keyword} REST API handling 100K+ requests/day" or "Developed ${keyword} microservices reducing latency by 45%"`);
    }
    if (/\bgo\b|golang/.test(lower)) {
      return getRegionalContext(`Backend performance: "Engineered ${keyword} service processing 50K concurrent requests" or "Built ${keyword} distributed system with 99.99% uptime"`);
    }
    if (/node\.?js|nodejs/.test(lower)) {
      return getRegionalContext(`Backend scalability: "Developed ${keyword} API serving 200K+ users" or "Built ${keyword} real-time system handling 10K+ connections"`);
    }
    if (/express|fastify|nest\.?js/.test(lower)) {
      return getRegionalContext(`Backend framework: "Built ${keyword} REST API with 300ms avg response time" or "Architected ${keyword} backend processing $2M+ transactions"`);
    }
    if (/django|flask|fastapi/.test(lower)) {
      return getRegionalContext(`Python backend: "Developed ${keyword} application serving 50K+ daily users" or "Built ${keyword} API reducing processing time by 60%"`);
    }
    if (/spring|spring boot/.test(lower)) {
      return getRegionalContext(`Java backend: "Engineered ${keyword} microservices handling 100K+ transactions/day" or "Built ${keyword} enterprise system with 99.9% reliability"`);
    }

    // ========== FRONTEND ENGINEERING ==========
    if (/\breact\b|react\.?js/.test(lower)) {
      return getRegionalContext(`Frontend development: "Built ${keyword} SPA serving 100K+ monthly users" or "Developed ${keyword} components reducing load time by 40%"`);
    }
    if (/angular/.test(lower)) {
      return getRegionalContext(`Frontend framework: "Engineered ${keyword} enterprise app used by 5K+ employees" or "Built ${keyword} dashboard processing real-time data"`);
    }
    if (/vue|vue\.?js/.test(lower)) {
      return getRegionalContext(`Frontend expertise: "Developed ${keyword} interface improving UX scores by 35%" or "Built ${keyword} app with 2s load time"`);
    }
    if (/rxjs|ngrx|redux/.test(lower)) {
      return getRegionalContext(`State management: "Implemented ${keyword} reducing API calls by 50%" or "Architected ${keyword} store managing 100+ concurrent actions"`);
    }
    if (/typescript/.test(lower)) {
      return getRegionalContext(`Type safety: "Migrated codebase to ${keyword} reducing bugs by 60%" or "Built ${keyword} SDK used by 50+ developers"`);
    }
    if (/next\.?js|nextjs/.test(lower)) {
      return getRegionalContext(`Full-stack framework: "Built ${keyword} app with SSR improving SEO by 80%" or "Developed ${keyword} platform serving 200K+ users"`);
    }

    // ========== DATABASES ==========
    if (/\bsql\b|mysql|postgresql|postgres/.test(lower)) {
      return getRegionalContext(`Database optimization: "Optimized ${keyword} queries reducing latency by 40%" or "Managed ${keyword} database processing 2M+ daily records"`);
    }
    if (/mongodb|nosql|dynamodb|cassandra/.test(lower)) {
      return getRegionalContext(`NoSQL expertise: "Designed ${keyword} schema handling 5M+ documents" or "Optimized ${keyword} queries improving throughput by 3x"`);
    }
    if (/redis|memcached|cache/.test(lower)) {
      return getRegionalContext(`Caching strategy: "Implemented ${keyword} reducing database load by 70%" or "Built ${keyword} layer improving response time by 200ms"`);
    }
    if (/elasticsearch|elastic/.test(lower)) {
      return getRegionalContext(`Search infrastructure: "Built ${keyword} cluster indexing 10M+ documents" or "Optimized ${keyword} queries reducing search time by 50%"`);
    }

    // ========== DATA ENGINEERING ==========
    if (/etl|data pipeline/.test(lower)) {
      return getRegionalContext(`Data engineering: "Built ${keyword} processing 500GB daily" or "Designed ${keyword} architecture handling 10M+ records/hour"`);
    }
    if (/airflow|luigi|prefect/.test(lower)) {
      return getRegionalContext(`Workflow orchestration: "Built ${keyword} pipelines processing 2TB+ data" or "Automated ${keyword} workflows saving 20 hours/week"`);
    }
    if (/data warehouse|snowflake|redshift|bigquery/.test(lower)) {
      return getRegionalContext(`Data warehouse: "Designed ${keyword} architecture storing 100TB+ data" or "Optimized ${keyword} queries reducing costs by $50K/year"`);
    }
    if (/hadoop|spark|hive|pig/.test(lower)) {
      return getRegionalContext(`Big data processing: "Developed ${keyword} jobs processing 2TB+ daily" or "Optimized ${keyword} cluster reducing runtime by 60%"`);
    }
    if (/kafka|kinesis|streaming/.test(lower)) {
      return getRegionalContext(`Stream processing: "Built ${keyword} pipeline handling 100K+ events/sec" or "Designed ${keyword} system with <100ms latency"`);
    }
    if (/dbt|data transformation/.test(lower)) {
      return getRegionalContext(`Data transformation: "Built ${keyword} models transforming 50M+ rows" or "Automated ${keyword} pipelines improving data quality by 95%"`);
    }

    // ========== CLOUD & DEVOPS ==========
    if (/\baws\b|amazon web services/.test(lower)) {
      return getRegionalContext(`Cloud infrastructure: "Deployed ${keyword} architecture serving 100K+ users" or "Managed ${keyword} environment saving $80K/year in costs"`);
    }
    if (/azure|microsoft azure/.test(lower)) {
      return getRegionalContext(`Cloud platform: "Built ${keyword} infrastructure with 99.9% uptime" or "Migrated to ${keyword} reducing operational costs by 40%"`);
    }
    if (/gcp|google cloud/.test(lower)) {
      return getRegionalContext(`Cloud services: "Architected ${keyword} platform processing 1M+ requests/day" or "Deployed ${keyword} infrastructure with auto-scaling"`);
    }
    if (/kubernetes|k8s/.test(lower)) {
      return getRegionalContext(`Container orchestration: "Managed ${keyword} cluster running 100+ microservices" or "Deployed ${keyword} reducing downtime by 95%"`);
    }
    if (/docker|containerization/.test(lower)) {
      return getRegionalContext(`Containerization: "Built ${keyword} images reducing deployment time by 70%" or "Dockerized ${keyword} apps improving CI/CD by 3x"`);
    }
    if (/terraform|infrastructure as code/.test(lower)) {
      return getRegionalContext(`IaC automation: "Built ${keyword} modules managing 200+ resources" or "Automated ${keyword} deployment reducing setup time by 80%"`);
    }
    if (/jenkins|gitlab ci|github actions|ci\/?cd/.test(lower)) {
      return getRegionalContext(`CI/CD automation: "Built ${keyword} pipelines deploying 50+ times/day" or "Automated ${keyword} reducing release time by 60%"`);
    }

    // ========== AI/ML ==========
    if (/machine learning|ml|ai|artificial intelligence/.test(lower)) {
      return getRegionalContext(`ML engineering: "Developed ${keyword} model achieving 95% accuracy" or "Deployed ${keyword} system improving predictions by 35%"`);
    }
    if (/deep learning|neural network|tensorflow|pytorch/.test(lower)) {
      return getRegionalContext(`Deep learning: "Built ${keyword} model processing 1M+ images" or "Trained ${keyword} achieving 98% accuracy on production data"`);
    }
    if (/nlp|natural language/.test(lower)) {
      return getRegionalContext(`NLP expertise: "Developed ${keyword} model analyzing 500K+ documents" or "Built ${keyword} system with 92% F1 score"`);
    }
    if (/computer vision|cv|image processing/.test(lower)) {
      return getRegionalContext(`Computer vision: "Built ${keyword} model detecting objects with 95% accuracy" or "Deployed ${keyword} system processing 10K+ images/day"`);
    }

    // ========== DATA ANALYSIS & BI ==========
    if (/excel|microsoft excel|spreadsheet/.test(lower)) {
      return getRegionalContext(`Data analysis: "Created ${keyword} dashboards tracking $2M+ revenue" or "Automated ${keyword} reports saving 15 hours/week"`);
    }
    if (/tableau|power bi|looker|visualization/.test(lower)) {
      return getRegionalContext(`BI analytics: "Built ${keyword} dashboards used by 500+ stakeholders" or "Created ${keyword} reports driving $1M+ decisions"`);
    }
    if (/\bsql\b.*analytics|data analytics/.test(lower)) {
      return getRegionalContext(`Data analytics: "Analyzed ${keyword} datasets identifying $500K+ revenue opportunities" or "Built ${keyword} models improving forecasts by 40%"`);
    }

    // ========== CONSULTING & FINANCE ==========
    if (/deloitte|consulting|nla|analyst/.test(lower)) {
      return getRegionalContext(`Consulting expertise: "Delivered ${keyword} projects for 10+ Fortune 500 clients" or "Led ${keyword} initiatives generating $5M+ value"`);
    }
    if (/accounting|audit|big 4|financial/.test(lower)) {
      return getRegionalContext(`Financial expertise: "Conducted ${keyword} for companies with $100M+ revenue" or "Led ${keyword} projects ensuring 100% compliance"`);
    }
    if (/business analyst|ba|requirements/.test(lower)) {
      return getRegionalContext(`Business analysis: "Gathered ${keyword} for projects impacting 50K+ users" or "Delivered ${keyword} reducing scope changes by 60%"`);
    }
    if (/strategy|strategic planning/.test(lower)) {
      return getRegionalContext(`Strategic planning: "Developed ${keyword} initiatives generating $2M+ revenue" or "Led ${keyword} transforming business operations"`);
    }

    // ========== TESTING & QA ==========
    if (/testing|qa|quality assurance/.test(lower)) {
      return getRegionalContext(`Quality assurance: "Built ${keyword} automation reducing testing time by 70%" or "Led ${keyword} achieving 98% test coverage"`);
    }
    if (/selenium|cypress|playwright/.test(lower)) {
      return getRegionalContext(`Test automation: "Built ${keyword} suite with 500+ tests" or "Automated ${keyword} tests reducing manual QA by 80%"`);
    }
    if (/jest|mocha|pytest|junit/.test(lower)) {
      return getRegionalContext(`Unit testing: "Achieved ${keyword} coverage of 95%+" or "Built ${keyword} suite with 1000+ tests running in <5min"`);
    }

    // ========== MOBILE DEVELOPMENT ==========
    if (/android|kotlin|java.*mobile/.test(lower)) {
      return getRegionalContext(`Android development: "Built ${keyword} app with 100K+ downloads" or "Developed ${keyword} feature improving ratings from 3.5→4.7"`);
    }
    if (/ios|swift|objective-c/.test(lower)) {
      return getRegionalContext(`iOS development: "Launched ${keyword} app with 50K+ users" or "Built ${keyword} features reducing crashes by 90%"`);
    }
    if (/react native|flutter|mobile/.test(lower)) {
      return getRegionalContext(`Cross-platform mobile: "Developed ${keyword} app for iOS+Android with single codebase" or "Built ${keyword} features used by 200K+ users"`);
    }

    // ========== AGILE & PROJECT MANAGEMENT ==========
    if (/agile|scrum|kanban/.test(lower)) {
      return getRegionalContext(`Agile methodology: "Led ${keyword} sprints increasing velocity by 40%" or "Managed ${keyword} team delivering 20+ features/quarter"`);
    }
    if (/jira|confluence|project management/.test(lower)) {
      return getRegionalContext(`Project management: "Tracked ${keyword} for 10+ concurrent projects" or "Managed ${keyword} workflows improving delivery by 30%"`);
    }

    // ========== SOFT SKILLS & LEADERSHIP ==========
    if (/leadership|team lead|technical lead/.test(lower)) {
      return getRegionalContext(`Team leadership: "Led ${keyword} team of 8 engineers delivering $2M+ project" or "Mentored ${keyword} 5 junior developers improving productivity by 50%"`);
    }
    if (/mentoring|coaching/.test(lower)) {
      return getRegionalContext(`Mentorship: "Provided ${keyword} to 10+ team members" or "Led ${keyword} program improving retention by 40%"`);
    }
    if (/communication|stakeholder/.test(lower)) {
      return getRegionalContext(`Stakeholder management: "Led ${keyword} with C-level executives on $5M+ initiatives" or "Presented ${keyword} to 100+ stakeholders"`);
    }

    // ========== SALES & CUSTOMER SUCCESS ==========
    if (/sales|revenue|account management/.test(lower)) {
      return getRegionalContext(`Sales achievement: "Generated ${keyword} of $500K+ closing 20+ enterprise deals" or "Increased ${keyword} by 120% YoY"`);
    }
    if (/customer success|client success|account/.test(lower)) {
      return getRegionalContext(`Customer success: "Managed ${keyword} for 50+ enterprise clients worth $10M+ ARR" or "Improved ${keyword} retention by 35%"`);
    }
    if (/crm|salesforce|hubspot/.test(lower)) {
      return getRegionalContext(`CRM expertise: "Managed ${keyword} tracking 500+ leads/month" or "Automated ${keyword} workflows improving conversion by 40%"`);
    }

    // ========== HEALTHCARE & NURSING ==========
    if (/nursing|healthcare|medical|clinical/.test(lower)) {
      return getRegionalContext(`Healthcare expertise: "Provided ${keyword} care to 100+ patients/week" or "Led ${keyword} initiatives improving patient satisfaction by 30%"`);
    }
    if (/patient care|bedside/.test(lower)) {
      return getRegionalContext(`Patient care: "Delivered ${keyword} maintaining 98% patient satisfaction" or "Managed ${keyword} for 50+ patients in ICU setting"`);
    }

    // ========== ACADEMIC & RESEARCH ==========
    if (/research|reu|nsf|academic/.test(lower)) {
      return getRegionalContext(`Research experience: "Conducted ${keyword} published in peer-reviewed journals" or "Led ${keyword} project with $50K+ funding"`);
    }
    if (/publication|paper|journal/.test(lower)) {
      return getRegionalContext(`Academic publications: "Authored ${keyword} cited 50+ times" or "Presented ${keyword} at international conferences"`);
    }

    // ========== SECURITY ==========
    if (/security|cybersecurity|infosec/.test(lower)) {
      return getRegionalContext(`Security expertise: "Implemented ${keyword} measures preventing 100+ incidents" or "Led ${keyword} audit achieving 100% compliance"`);
    }
    if (/penetration testing|ethical hacking/.test(lower)) {
      return getRegionalContext(`Security testing: "Conducted ${keyword} identifying 50+ vulnerabilities" or "Led ${keyword} improving security posture by 80%"`);
    }

    // ========== GENERIC BUT CONTEXTUAL ==========
    return getRegionalContext(`Integrate "${keyword}" into experience with measurable outcomes: specific scale (users/data volume), performance improvements (%), or business impact ($revenue/time saved)`);
  };

  return {
    title: `${adjustedCategory} Resume`,
    category: adjustedCategory,
    score: finalScore,
    scoreBreakdown: {
      keywords: Math.round(keywordScore),
      format: Math.round(formatScore),
      completeness: Math.round(completenessScore)
    },
    matchedKeywords: foundKeywords.map(kw => kw.keyword).slice(0, 50),
    missingKeywords: missingKeywords.slice(0, 10).map(kw => ({
      keyword: kw.keyword,
      priority: kw.priority,
      section: "Experience",
      context: generateContextualKeywordDescription(kw.keyword, region),
      frequency: kw.frequency,
      impact: kw.impact,
      synonyms: kw.synonyms || []
    })),
    formatIssues,
    metricSuggestions,
    analysis,
    // ML data for training - Region Detection
    detectedRegion: region,
    regionConfidence: regionConfidence,
    regionIndicators: regionIndicators,
    // ML data for training - User Profile (Hyper-Personalization)
    userProfile: {
      seniorityLevel: userProfile.seniorityLevel,
      yearsOfExperience: userProfile.yearsOfExperience,
      currentTechnologies: userProfile.currentTechnologies,
      industryFocus: userProfile.industryFocus,
      hasLeadershipExperience: userProfile.hasLeadershipExperience,
      hasRemoteExperience: userProfile.hasRemoteExperience,
      targetCompanies: userProfile.targetCompanies,
      educationLevel: userProfile.educationLevel,
      hasInternships: userProfile.hasInternships,
      hasCertifications: userProfile.hasCertifications
    }
  };
}
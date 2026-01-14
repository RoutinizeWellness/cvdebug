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
  
  // ===== FINAL SCORE CALCULATION WITH STRICT REALISM CURVE =====

  let rawScore = keywordScore + formatScore + completenessScore;

  // Apply STRICT "Realism Curve" - much harder to get high scores
  // Average resume should get 55-65%, not 80-90%
  if (rawScore > 50) {
    // Dramatically reduce scores above 50
    rawScore = 50 + (rawScore - 50) * 0.4;
  }
  if (rawScore > 70) {
    // Even more dramatic reduction for scores above 70
    rawScore = 70 + (rawScore - 70) * 0.3;
  }

  const totalScore = Math.round(Math.min(100, Math.max(0, rawScore)));

  // CRITICAL: Realistic minimum score of 20 for any valid resume text
  // This is honest and creates urgency for users to improve
  const finalScore = Math.max(20, totalScore);
  
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

  // Generate contextual keyword descriptions based on the keyword AND region
  const generateContextualKeywordDescription = (keyword: string, targetRegion: Region): string => {
    const lower = keyword.toLowerCase();

    // ========== REGION-SPECIFIC ADAPTATIONS ==========
    const getRegionalContext = (baseExample: string): string => {
      switch (targetRegion) {
        case 'philippines':
          // Philippines: Emphasize international applications, OFW readiness, Middle East/USA markets
          return `${baseExample}. 🇵🇭 For international applications (USA/Middle East): Highlight English proficiency, remote work experience, and cross-cultural collaboration.`;

        case 'india':
          // India: Emphasize Deloitte NLA, FAANG, Big 4, technical depth
          return `${baseExample}. 🇮🇳 For Indian market: Perfect for Deloitte NLA, FAANG applications. Include certifications (AWS, Azure) and emphasize technical depth with specific frameworks.`;

        case 'usa':
          // USA: Emphasize leadership, innovation, quantifiable business impact
          return `${baseExample}. 🇺🇸 For US market: Emphasize leadership, innovation, and business impact. Use action verbs like "spearheaded", "drove", "transformed". Quantify ROI and revenue impact.`;

        case 'middle_east':
          // Middle East: Emphasize multinational experience, certifications, large-scale projects
          return `${baseExample}. 🇦🇪 For Middle East market: Highlight multinational experience, professional certifications, and large-scale infrastructure projects. Emphasize stability and long-term commitment.`;

        case 'europe':
          // Europe: Emphasize GDPR, compliance, multilingual skills, EU standards
          return `${baseExample}. 🇪🇺 For European market: Highlight GDPR compliance, EU standards knowledge, multilingual abilities, and experience with European clients/markets.`;

        default: // global
          return `${baseExample}. 🌍 Global tip: Tailor your resume to each target market. Research company culture and local hiring standards.`;
      }
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
    // ML data for training
    detectedRegion: region,
    regionConfidence: regionConfidence,
    regionIndicators: regionIndicators
  };
}
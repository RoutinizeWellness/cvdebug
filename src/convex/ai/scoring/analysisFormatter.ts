import type { RoleCategory } from "../config/keywords";

export function formatAnalysisReport(params: {
  adjustedCategory: RoleCategory;
  confidence: number;
  totalScore: number;
  keywordScore: number;
  formatScore: number;
  completenessScore: number;
  foundKeywords: any[];
  missingKeywords: any[];
  formatIssues: any[];
  metricSuggestions: any[];
  bulletAnalysis: any;
  softSkillsAnalysis: any;
  hasJD: boolean;
  emailMatch: any;
  phoneMatch: any;
  hasLinkedIn: boolean;
  hasExperience: boolean;
  hasEducation: boolean;
  hasSkills: boolean;
  hasConsistentDates: boolean;
  metricCount: number;
  strongVerbMatches: number;
  ocrTextLength: number;
}): string {
  const {
    adjustedCategory, confidence, totalScore, keywordScore, formatScore, completenessScore,
    foundKeywords, missingKeywords, formatIssues, metricSuggestions, bulletAnalysis, softSkillsAnalysis,
    hasJD, emailMatch, phoneMatch, hasLinkedIn, hasExperience, hasEducation, hasSkills,
    hasConsistentDates, metricCount, strongVerbMatches, ocrTextLength
  } = params;

  return `
### 🤖 ATS Parsing Report

**Parsing Quality: ${formatScore > 20 ? 'Excellent ✅' : formatScore > 10 ? 'Good ⚠️' : 'Needs Improvement 🚨'}**

${hasJD ? '**Analysis Mode:** 🎯 Tailored to job description with advanced keyword matching' : '**Analysis Mode:** 📊 Industry-standard analysis with intelligent classification'}

**Role Classification:** ${adjustedCategory} (Confidence: ${(confidence * 100).toFixed(0)}%)
**Contact Information:** ${emailMatch && phoneMatch ? '✅ Complete' : '⚠️ Incomplete'}
**Section Headers:** ${hasExperience && hasEducation ? '✅ Present' : '⚠️ Some Missing'}
**Date Formats:** ${hasConsistentDates ? '✅ Consistent' : '⚠️ Inconsistent'}

---

### 📊 Detailed Score Breakdown

**Keywords & Content Match: ${Math.round(keywordScore)}/40 points**
- Found ${foundKeywords.length} relevant keywords with weighted scoring
- Keyword density: ${foundKeywords.length > 0 ? 'Good ✅' : 'Low 🚨'}
${hasJD ? `- Missing ${missingKeywords.length} critical JD keywords` : ''}
${foundKeywords.slice(0, 5).map(k => `  • ${k.keyword} (freq: ${k.frequency}, weight: ${k.weight.toFixed(1)})`).join('\n')}

**Format & Parseability: ${Math.round(formatScore)}/30 points**
- Contact info: ${emailMatch ? '✅' : '❌'} Email, ${phoneMatch ? '✅' : '❌'} Phone, ${hasLinkedIn ? '✅' : '❌'} LinkedIn
- Section headers: ${hasExperience ? '✅' : '❌'} Experience, ${hasEducation ? '✅' : '❌'} Education, ${hasSkills ? '✅' : '❌'} Skills
- Date consistency: ${hasConsistentDates ? '✅' : '❌'}

**Completeness & Impact: ${Math.round(completenessScore)}/30 points**
- **Bullet Point Quality:** ${bulletAnalysis.score > 70 ? 'Strong ✅' : bulletAnalysis.score > 50 ? 'Good ⚠️' : 'Needs Improvement 🚨'}
  - ${bulletAnalysis.strongBullets.length} high-impact bullets found
  - ${bulletAnalysis.weakBullets.length} weak bullets detected
- **Soft Skills:** ${softSkillsAnalysis.found.length} detected (${softSkillsAnalysis.found.slice(0, 3).join(', ')})
- **Quantified achievements:** ${metricCount} metrics found (Target: 8+ for scores >80)
- **Strong action verbs:** ${strongVerbMatches} detected
- **Resume length:** ${ocrTextLength > 1500 ? 'Adequate ✅' : 'Could be expanded ⚠️'}

---

### 🔑 Critical Missing Keywords (TF-IDF Weighted)

${missingKeywords.slice(0, 5).map((kw, i) => `
${i + 1}. **${kw.keyword}** (Priority: ${kw.priority.toUpperCase()})
   - Frequency in JD: ${kw.frequency}x
   - Estimated impact: +${kw.impact} points
   - **How to add:** ${kw.context}
   - **Section:** ${kw.section}
   ${kw.synonyms && kw.synonyms.length > 0 ? `- **Related terms:** ${kw.synonyms.slice(0, 3).join(', ')}` : ''}
`).join('\n')}

${missingKeywords.length === 0 ? '✅ No critical keywords missing - excellent job!' : ''}

---

### 💡 Smart Metric Suggestions (Actionable)

${metricSuggestions.length > 0 ? metricSuggestions.map((suggestion, i) => `
${i + 1}. **${suggestion.tech}**
   - **Current:** ${suggestion.currentUsage}
   - **Suggested:** ${suggestion.suggestedMetric}
   - **Example:** ${suggestion.example}
   - **Why it matters:** ${suggestion.impact}
`).join('\n') : '✅ Your metrics are well-documented!'}

---

### ⚠️ Format & Content Issues

${formatIssues.map((issue, i) => `
${i + 1}. **${issue.issue}** (Severity: ${issue.severity.toUpperCase()})
   - **Location:** ${issue.location}
   - **ATS Impact:** ${issue.atsImpact}
   - **Fix:** ${issue.fix}
`).join('\n')}

${bulletAnalysis.issues.map((issue: string, i: number) => `
${formatIssues.length + i + 1}. **Content Quality Issue**
   - **Issue:** ${issue}
   - **Fix:** Use the "Action + Task + Result" formula. Example: "Architected microservices processing 2TB daily, reducing latency by 45%"
`).join('\n')}

${formatIssues.length === 0 && bulletAnalysis.issues.length === 0 ? '✅ No major issues detected!' : ''}

---

### 🎯 ML-Based Recommendations (Prioritized by Impact)

**Priority Actions (Highest Impact First):**

${totalScore < 50 ? `
1. **🚨 CRITICAL: Fix parsing issues** (+${30 - formatScore} points potential)
   - ${!emailMatch ? '📧 Add email address in header' : ''}
   - ${!hasExperience ? '📝 Add "Experience" section header' : ''}
   - ${formatIssues.length > 0 ? formatIssues[0].fix : ''}

2. **🔑 Add missing keywords** (+${Math.min(15, missingKeywords.length * 3)} points potential)
   - Focus on: ${missingKeywords.slice(0, 3).map(k => k.keyword).join(', ')}
   - ${missingKeywords.length > 0 ? missingKeywords[0].context : ''}

3. **📊 Quantify achievements** (+${15 - (completenessScore > 15 ? 15 : completenessScore)} points potential)
   - Add numbers, percentages, and metrics to your bullets
   - Use templates from "Smart Metric Suggestions" above
` : totalScore < 75 ? `
1. **🔑 Enhance keyword coverage** (+${Math.min(10, missingKeywords.length * 2)} points potential)
   - Add: ${missingKeywords.slice(0, 3).map(k => k.keyword).join(', ')}
   - ${missingKeywords.length > 0 ? missingKeywords[0].context : ''}

2. **💪 Strengthen impact statements** (+${Math.min(8, 30 - completenessScore)} points potential)
   - Use more quantifiable metrics (%, $, numbers)
   - Replace weak verbs with strong action verbs
   - **Improve Bullet Points:** ${bulletAnalysis.weakBullets.length > 0 ? `Rewrite weak bullets like "${bulletAnalysis.weakBullets[0].substring(0, 50)}..."` : 'Ensure all bullets have metrics'}

3. **✨ Polish formatting** (+${Math.min(5, 30 - formatScore)} points potential)
   - ${formatIssues.length > 0 ? formatIssues[0].fix : 'Ensure consistent formatting throughout'}
` : `
✅ **Your resume is well-optimized!** Minor improvements:

1. Continue adding quantifiable metrics where possible
2. Keep keywords updated with industry trends
3. Maintain consistent formatting
4. ${metricSuggestions.length > 0 ? `Consider adding metrics for: ${metricSuggestions[0].tech}` : 'Keep up the great work!'}
`}

---

### 💡 Pro Tips for ${adjustedCategory} Roles

${adjustedCategory === "Engineering" ? `
**Engineering Resume Best Practices:**
- ✅ Lead with project scale and impact (e.g., "Designed 6-story, 5,000 m² structure")
- ✅ Include specific codes/standards (IBC, ASCE 7, Eurocode)
- ✅ Quantify results (cost savings, efficiency gains, load capacity)
- ✅ List technical tools (AutoCAD, Revit, ETABS, SAP2000)
- ✅ Show PE/FE certifications prominently
` : adjustedCategory === "Software Engineering" ? `
**Software Engineering Resume Best Practices:**
- ✅ Emphasize scale (users, requests/sec, data volume)
- ✅ Include tech stack in every bullet
- ✅ Show performance improvements (latency, throughput)
- ✅ Highlight system design and architecture decisions
- ✅ Mention CI/CD, testing, and deployment practices
` : adjustedCategory === "Marketing" ? `
**Marketing Resume Best Practices:**
- ✅ Emphasize ROI and conversion metrics
- ✅ Include campaign results (CTR, CPC, conversion rates)
- ✅ Highlight tools (Google Analytics, HubSpot, Salesforce)
- ✅ Show audience growth and engagement metrics
- ✅ Demonstrate A/B testing and data-driven decisions
` : `
**General Best Practices:**
- ✅ Use strong action verbs (Led, Architected, Optimized)
- ✅ Quantify every achievement with numbers
- ✅ Tailor keywords to each job description
- ✅ Keep formatting simple and ATS-friendly
- ✅ Show progression and growth in your career
`}

---

### 📈 Competitive Benchmark

- **Your Score:** ${totalScore}% ${totalScore >= 85 ? '🏆' : totalScore >= 75 ? '🎯' : totalScore >= 62 ? '📊' : '⚠️'}
- **Industry Average:** 62%
- **Top 25% Threshold:** 75%
- **Top 10% Threshold:** 85%

${totalScore >= 85 ? '🎉 **Outstanding!** You\'re in the top 10%!' : totalScore >= 75 ? '🎯 **Great job!** You\'re in the top 25%!' : totalScore >= 62 ? '📊 You\'re above average - keep improving!' : '⚠️ Below average - focus on the priority actions above'}

${hasJD ? `\n**JD Alignment:** ${Math.round((foundKeywords.length / (foundKeywords.length + missingKeywords.length)) * 100)}% keyword match | ${missingKeywords.filter(k => k.priority === 'critical').length} critical skills missing` : ''}

---

### 🚀 Next Steps (Estimated Time)

1. ${totalScore < 50 ? 'Fix critical parsing issues (30 min)' : totalScore < 75 ? 'Add missing keywords (45 min)' : 'Polish and refine (20 min)'}
2. ${totalScore < 50 ? 'Add missing keywords (1 hour)' : totalScore < 75 ? 'Quantify achievements (1 hour)' : 'Update with latest projects (30 min)'}
3. ${totalScore < 50 ? 'Quantify all bullets (2 hours)' : totalScore < 75 ? 'Polish formatting (30 min)' : 'Tailor for specific roles (15 min each)'}

**Total estimated time to reach 80+:** ${totalScore < 50 ? '3-4 hours' : totalScore < 75 ? '2-3 hours' : '1 hour'}
`;
}

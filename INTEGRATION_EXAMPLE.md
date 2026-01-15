# Integration Example: Advanced ML Analysis

## Quick Integration into ATSAnalysisReport

Here's how to integrate the new Advanced ML Analysis into the existing `ATSAnalysisReport.tsx`:

### Step 1: Import the Component

Add this import at the top of `ATSAnalysisReport.tsx`:

```typescript
import { AdvancedATSInsights } from "./AdvancedATSInsights";
```

### Step 2: Add to the Component

Insert this section after the "Weak Bullet Suggestions" section (around line 840):

```tsx
{/* Advanced ML Analysis - PAID USERS ONLY */}
{isPaidUser && resume?.ocrText && (
  <div className="w-full mb-8">
    <AdvancedATSInsights
      resumeText={resume.ocrText}
      jobDescription={ocrText} // or pass actual job description if available
      isPaidUser={isPaidUser}
      onUpgrade={onUpgrade}
    />
  </div>
)}

{/* For FREE users - show teaser */}
{!isPaidUser && (
  <div className="w-full mb-8">
    <AdvancedATSInsights
      resumeText={resume?.ocrText || ''}
      jobDescription=""
      isPaidUser={false}
      onUpgrade={onUpgrade}
    />
  </div>
)}
```

### Step 3: Usage in Dashboard

The component automatically handles:
- ✅ Free vs paid user display
- ✅ Analysis execution on button click
- ✅ Loading states
- ✅ Beautiful visualization
- ✅ Actionable suggestions

### Alternative: Standalone Usage

You can also use it as a standalone page:

```tsx
import { AdvancedATSInsights } from "@/components/dashboard/AdvancedATSInsights";

export default function AdvancedAnalysisPage() {
  const resume = useQuery(api.resumes.getLatest);
  const isPaidUser = true; // Check user subscription

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Advanced ML Analysis</h1>

      <AdvancedATSInsights
        resumeText={resume?.ocrText || ''}
        jobDescription={jobDescription}
        isPaidUser={isPaidUser}
        onUpgrade={() => router.push('/upgrade')}
      />
    </div>
  );
}
```

## Backend Usage (Direct API Calls)

### From Actions

```typescript
import { action } from "./_generated/server";
import { internal } from "./_generated/api";

export const analyzeResumeAdvanced = action({
  args: { resumeId: v.id("resumes") },
  handler: async (ctx, args) => {
    // Get resume
    const resume = await ctx.runQuery(internal.resumes.getById, {
      id: args.resumeId
    });

    // Run advanced analysis
    const result = await ctx.runAction(
      internal.ai.advancedATSActions.runComprehensiveAnalysis,
      {
        resumeText: resume.ocrText,
        jobDescription: resume.jobDescription,
        targetIndustry: 'software',
      }
    );

    // Store results
    if (result.success) {
      await ctx.runMutation(internal.resumes.updateAnalysis, {
        resumeId: args.resumeId,
        analysis: result.data,
      });
    }

    return result;
  },
});
```

### From Mutations

```typescript
import { mutation } from "./_generated/server";
import { internal } from "./_generated/api";

export const triggerAdvancedAnalysis = mutation({
  args: { resumeId: v.id("resumes") },
  handler: async (ctx, args) => {
    // Schedule the analysis to run in background
    await ctx.scheduler.runAfter(
      0,
      internal.ai.advancedATSActions.runComprehensiveAnalysis,
      {
        resumeText: resume.ocrText,
        jobDescription: resume.jobDescription,
      }
    );

    return { scheduled: true };
  },
});
```

## Features Available

### 1. Keyword Analysis
```typescript
result.data.keywordAnalysis = {
  overallScore: 82,
  categoryBreakdown: {
    technical: { score: 85, matched: 12, total: 15 },
    soft: { score: 70, matched: 5, total: 10 },
    tools: { score: 90, matched: 8, total: 10 },
    methodology: { score: 75, matched: 3, total: 5 },
  },
  matchedKeywords: [...], // Keywords found in resume
  missingKeywords: [...], // High-priority keywords missing
  strengthAreas: ['Technical', 'Tools'],
  improvementAreas: ['Soft'],
};
```

### 2. Impact Metrics
```typescript
result.data.impactAnalysis = {
  totalMetrics: 12,
  impactScore: 78,
  impactLevel: 'strong', // 'weak' | 'good' | 'strong' | 'elite'
  metrics: [
    {
      type: 'percentage',
      value: 'improved performance by 40%',
      context: 'Optimized database queries...',
      sentiment: 'positive',
      impactScore: 8,
      category: 'efficiency',
    },
    // ... more metrics
  ],
  missingMetricOpportunities: ['Scale metrics', 'ROI metrics'],
  improvementSuggestions: ['Add percentages to quantify improvements'],
};
```

### 3. Missing Keyword Suggestions
```typescript
result.data.missingKeywordSuggestions = [
  {
    keyword: 'kubernetes',
    priority: 'critical',
    impact: 8,
    section: 'Skills or Experience',
    context: 'Built scalable microservices using kubernetes...',
    synonyms: ['k8s', 'container orchestration'],
    reasoning: 'This keyword appears in job description and is critical for ATS matching.',
  },
  // ... top 15 suggestions
];
```

### 4. ATS Compatibility
```typescript
result.data.atsCompatibility = {
  overallScore: 85,
  formatScore: 90,
  contentScore: 85,
  keywordScore: 82,
  issues: [
    {
      severity: 'warning',
      category: 'format',
      message: 'Special bullet characters detected',
      fix: 'Replace with standard bullets',
    },
    // ... more issues
  ],
  recommendations: [
    'Add 3-5 high-priority keywords to boost score',
    'Quantify achievements with more metrics',
  ],
};
```

## Testing

### Test the Backend

```bash
# Run a test analysis
npx convex run ai/advancedATSActions:runComprehensiveAnalysis '{
  "resumeText": "Software Engineer with 5 years experience in React, Node.js, and AWS...",
  "jobDescription": "Looking for Senior Software Engineer with React, TypeScript, Kubernetes...",
  "targetIndustry": "software"
}'
```

### Test the Frontend

1. Navigate to dashboard
2. Click "Run Analysis" button
3. Verify results display correctly
4. Check that suggestions are actionable

## Performance Considerations

### Caching
Consider caching analysis results:

```typescript
// In your mutation
const cachedAnalysis = await ctx.db
  .query("resumeAnalyses")
  .withIndex("by_resume", q => q.eq("resumeId", args.resumeId))
  .order("desc")
  .first();

// If recent analysis exists, return it
if (cachedAnalysis && Date.now() - cachedAnalysis._creationTime < 3600000) {
  return cachedAnalysis.data;
}

// Otherwise, run new analysis
const result = await runAdvancedAnalysis(...);
```

### Background Processing
For large resumes, run analysis in background:

```typescript
// Schedule analysis
await ctx.scheduler.runAfter(0, internal.ai.analyzeAdvanced, {
  resumeId: args.resumeId
});

// Poll for results
const checkStatus = async () => {
  const analysis = await ctx.db
    .query("resumeAnalyses")
    .withIndex("by_resume", q => q.eq("resumeId", resumeId))
    .order("desc")
    .first();

  if (analysis?.status === "completed") {
    return analysis.data;
  }

  // Retry after 1 second
  setTimeout(checkStatus, 1000);
};
```

## Monitoring

Track these metrics:
- Analysis execution time (should be < 200ms)
- User satisfaction with suggestions
- Conversion rate (free → paid)
- Keyword detection accuracy

## Next Steps

1. ✅ Integrate into ATSAnalysisReport.tsx
2. ✅ Test with real resumes
3. ✅ Monitor performance
4. ✅ Gather user feedback
5. ✅ Iterate based on data

## Support

For questions or issues:
- Check ML_IMPROVEMENTS_SUMMARY.md for detailed documentation
- Review advancedATSEngine.ts for algorithm details
- Test with sample resumes to understand behavior

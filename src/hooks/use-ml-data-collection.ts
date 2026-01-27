import { useEffect, useRef } from 'react';
import { useMLAnalysis } from './use-ml-analysis';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

/**
 * Silent ML data collection hook
 * Collects ML analysis data in the background for algorithm improvement
 * Does NOT display any UI - data is only used internally
 */
export function useMLDataCollection(
  resumeId: Id<"resumes"> | null,
  resumeText: string,
  jobDescription: string = '',
  enabled: boolean = true
) {
  const analysis = useMLAnalysis(resumeText, jobDescription);
  const recordMLData = useMutation(api.mlLearning.recordMLAnalysis);
  const hasRecorded = useRef(false);

  useEffect(() => {
    // Only record once per resume load
    if (!enabled || !resumeId || !resumeText || hasRecorded.current) {
      return;
    }

    // Only record if we have meaningful analysis
    if (analysis.overallScore === 0 || resumeText.length < 100) {
      return;
    }

    // Record ML data in background (non-blocking)
    const recordData = async () => {
      try {
        await recordMLData({
          resumeId,
          mlScores: {
            overallScore: analysis.overallScore,
            keywordMatchScore: analysis.keywordMatchScore,
            actionVerbScore: analysis.actionVerbScore,
            sentimentScore: analysis.sentimentScore,
            structureScore: analysis.structureScore
          },
          topKeywords: analysis.topKeywords.map(k => k.keyword),
          matchedKeywords: analysis.matchedKeywords,
          missingKeywords: analysis.missingKeywords,
          actionVerbs: analysis.actionVerbs.map(v => v.verb),
          weakPhrases: analysis.weakPhrases.map(p => p.phrase),
          entities: {
            skills: analysis.entities.skills,
            technologies: analysis.entities.technologies,
            companies: analysis.entities.companies
          },
          recommendations: analysis.recommendations.map(r => ({
            type: r.type,
            title: r.title,
            impact: r.impact
          })),
          sentiment: analysis.sentiment.label,
          timestamp: Date.now()
        });

        hasRecorded.current = true;
        console.log('[ML Data Collection] Data recorded successfully for internal algorithm improvement');
      } catch (error) {
        console.error('[ML Data Collection] Failed to record data:', error);
        // Fail silently - don't interrupt user experience
      }
    };

    // Delay collection by 2 seconds to not block initial render
    const timer = setTimeout(recordData, 2000);

    return () => clearTimeout(timer);
  }, [enabled, resumeId, resumeText, analysis, recordMLData]);

  // Return nothing - this is a silent hook
  return null;
}

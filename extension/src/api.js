// CVDebug API Integration
// This file handles communication with CVDebug backend for real ATS analysis

const API_BASE_URL = 'https://cvdebug.com';

// Check if user is logged in to CVDebug
export async function checkUserAuth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/check`, {
      credentials: 'include'
    });
    return response.ok;
  } catch (error) {
    console.error('[CVDebug API] Auth check failed:', error);
    return false;
  }
}

// Analyze job description with real CVDebug AI
export async function analyzeJobMatch(resumeText, jobDescription, jobTitle) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/extension/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resume: resumeText,
        jobDescription: jobDescription,
        jobTitle: jobTitle
      })
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      score: data.score,
      missingKeywords: data.missingKeywords || [],
      matchedKeywords: data.matchedKeywords || [],
      recommendations: data.recommendations || [],
      detailedAnalysis: data.detailedAnalysis
    };
  } catch (error) {
    console.error('[CVDebug API] Analysis failed:', error);
    // Fallback to local analysis if API fails
    return null;
  }
}

// Save job application tracking
export async function trackJobApplication(jobData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/extension/track-job`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        jobTitle: jobData.title,
        company: jobData.company,
        matchScore: jobData.matchScore,
        linkedinUrl: jobData.url,
        appliedDate: jobData.appliedDate || null
      })
    });

    return response.ok;
  } catch (error) {
    console.error('[CVDebug API] Job tracking failed:', error);
    return false;
  }
}

// Get user's job application stats
export async function getUserJobStats() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/extension/job-stats`, {
      credentials: 'include'
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('[CVDebug API] Stats fetch failed:', error);
    return null;
  }
}

// Subscribe to job alerts
export async function subscribeToJobAlerts(keywords, minMatchScore) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/extension/job-alerts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        keywords: keywords,
        minMatchScore: minMatchScore
      })
    });

    return response.ok;
  } catch (error) {
    console.error('[CVDebug API] Job alerts subscription failed:', error);
    return false;
  }
}

// Log extension usage for analytics (privacy-safe)
export async function logExtensionEvent(eventType, metadata = {}) {
  try {
    await fetch(`${API_BASE_URL}/api/extension/analytics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: eventType,
        timestamp: Date.now(),
        metadata: metadata
      })
    });
  } catch (error) {
    // Silent fail for analytics
    console.debug('[CVDebug API] Analytics event not sent:', error);
  }
}

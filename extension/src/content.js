// CVDebug Chrome Extension - Content Script
// Runs on LinkedIn job pages to extract job description and calculate match score

console.log('[CVDebug] Extension loaded on LinkedIn');

// State
let userResume = null;
let currentJobDescription = null;
let matchScore = null;

// Load user's resume from storage
chrome.storage.local.get(['userResume'], (result) => {
  if (result.userResume) {
    userResume = result.userResume;
    console.log('[CVDebug] Resume loaded from storage');
    analyzeCurrentJob();
  } else {
    console.log('[CVDebug] No resume found - user needs to upload via popup');
  }
});

// Extract job description from LinkedIn page
function extractJobDescription() {
  // LinkedIn job description selectors (may need updates as LinkedIn changes their HTML)
  const selectors = [
    '.jobs-description__content',
    '.jobs-box__html-content',
    '.jobs-description',
    '[class*="job-description"]',
    '[class*="jobs-description"]'
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element && element.innerText.length > 100) {
      return element.innerText;
    }
  }

  return null;
}

// Extract job title
function extractJobTitle() {
  const selectors = [
    '.jobs-unified-top-card__job-title',
    '.job-details-jobs-unified-top-card__job-title',
    'h1.t-24'
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) {
      return element.innerText.trim();
    }
  }

  return 'Unknown Job';
}

// Calculate match score using simple keyword matching
// In production, this would call the CVDebug API
function calculateMatchScore(resume, jobDescription) {
  if (!resume || !jobDescription) return 0;

  const resumeLower = resume.toLowerCase();
  const jobLower = jobDescription.toLowerCase();

  // Extract keywords from job description (simple approach)
  const keywords = extractKeywords(jobLower);

  // Count how many keywords appear in resume
  let matchCount = 0;
  keywords.forEach(keyword => {
    if (resumeLower.includes(keyword)) {
      matchCount++;
    }
  });

  const score = Math.min(Math.round((matchCount / keywords.length) * 100), 100);
  return score;
}

// Extract important keywords from job description
function extractKeywords(text) {
  // Remove common words and extract technical/important terms
  const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'you', 'your', 'we', 'our']);

  const words = text.match(/\b[a-z]{3,}\b/gi) || [];
  const wordFreq = {};

  words.forEach(word => {
    const lower = word.toLowerCase();
    if (!commonWords.has(lower)) {
      wordFreq[lower] = (wordFreq[lower] || 0) + 1;
    }
  });

  // Get top keywords by frequency
  const sortedKeywords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(entry => entry[0]);

  return sortedKeywords;
}

// Inject match score widget into page
function injectMatchWidget(score, missingKeywords = []) {
  // Remove existing widget if any
  const existing = document.getElementById('cvdebug-match-widget');
  if (existing) {
    existing.remove();
  }

  // Determine score color and message
  let colorClass, emoji, message;
  if (score >= 80) {
    colorClass = 'cvdebug-score-excellent';
    emoji = '🎯';
    message = 'Strong Match';
  } else if (score >= 60) {
    colorClass = 'cvdebug-score-good';
    emoji = '✅';
    message = 'Good Match';
  } else if (score >= 40) {
    colorClass = 'cvdebug-score-fair';
    emoji = '⚠️';
    message = 'Fair Match';
  } else {
    colorClass = 'cvdebug-score-poor';
    emoji = '❌';
    message = 'Poor Match';
  }

  // Create widget
  const widget = document.createElement('div');
  widget.id = 'cvdebug-match-widget';
  widget.className = `cvdebug-widget ${colorClass}`;
  widget.innerHTML = `
    <div class="cvdebug-header">
      <div class="cvdebug-logo">
        <span class="cvdebug-icon">🐛</span>
        <span class="cvdebug-brand">CVDebug</span>
      </div>
      <button class="cvdebug-close" id="cvdebug-close">×</button>
    </div>
    <div class="cvdebug-score-display">
      <div class="cvdebug-score-circle">
        <span class="cvdebug-score-number">${score}</span>
        <span class="cvdebug-score-percent">%</span>
      </div>
      <div class="cvdebug-score-label">
        <span class="cvdebug-emoji">${emoji}</span>
        <span class="cvdebug-message">${message}</span>
      </div>
    </div>
    ${missingKeywords.length > 0 ? `
      <div class="cvdebug-missing">
        <div class="cvdebug-missing-header">Missing Keywords:</div>
        <div class="cvdebug-keywords">
          ${missingKeywords.slice(0, 5).map(kw => `<span class="cvdebug-keyword">${kw}</span>`).join('')}
        </div>
      </div>
    ` : ''}
    <div class="cvdebug-actions">
      <button class="cvdebug-btn-primary" id="cvdebug-optimize">
        Optimize Resume
      </button>
    </div>
    <div class="cvdebug-footer">
      Powered by CVDebug ATS Scanner
    </div>
  `;

  // Inject into page
  document.body.appendChild(widget);

  // Add event listeners
  document.getElementById('cvdebug-close').addEventListener('click', () => {
    widget.style.display = 'none';
  });

  document.getElementById('cvdebug-optimize').addEventListener('click', () => {
    // Open CVDebug web app with this job description pre-filled
    const jobTitle = extractJobTitle();
    const jobDesc = currentJobDescription;

    // Save job to storage for web app to pick up
    chrome.storage.local.set({
      pendingJob: {
        title: jobTitle,
        description: jobDesc,
        timestamp: Date.now()
      }
    });

    // Open CVDebug
    window.open('https://cvdebug.com/dashboard?from=extension', '_blank');
  });
}

// Find missing keywords
function findMissingKeywords(resume, jobDescription) {
  const resumeLower = resume.toLowerCase();
  const keywords = extractKeywords(jobDescription.toLowerCase());

  const missing = keywords.filter(kw => !resumeLower.includes(kw));
  return missing.slice(0, 8); // Top 8 missing
}

// Analyze current job
function analyzeCurrentJob() {
  if (!userResume) {
    console.log('[CVDebug] Cannot analyze - no resume loaded');
    return;
  }

  const jobDescription = extractJobDescription();
  if (!jobDescription) {
    console.log('[CVDebug] Cannot analyze - job description not found');
    return;
  }

  currentJobDescription = jobDescription;
  matchScore = calculateMatchScore(userResume, jobDescription);
  const missingKeywords = findMissingKeywords(userResume, jobDescription);

  console.log('[CVDebug] Match Score:', matchScore);
  console.log('[CVDebug] Missing Keywords:', missingKeywords);

  // Inject widget
  setTimeout(() => {
    injectMatchWidget(matchScore, missingKeywords);
  }, 500);
}

// Watch for navigation changes (LinkedIn is SPA)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    console.log('[CVDebug] Navigation detected, re-analyzing...');
    setTimeout(analyzeCurrentJob, 1000);
  }
}).observe(document, { subtree: true, childList: true });

// Initial analysis
setTimeout(analyzeCurrentJob, 2000);

// Listen for resume updates from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'resumeUpdated') {
    userResume = request.resume;
    console.log('[CVDebug] Resume updated from popup');
    analyzeCurrentJob();
    sendResponse({ success: true });
  }
});

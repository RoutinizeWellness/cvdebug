// Job Application Tracker
// Detects when user clicks "Apply" button and tracks application

console.log('[CVDebug] Job Tracker initialized');

let trackedJobs = [];

// Load tracked jobs from storage
chrome.storage.local.get(['trackedJobs'], (result) => {
  trackedJobs = result.trackedJobs || [];
  console.log('[CVDebug] Loaded', trackedJobs.length, 'tracked jobs');
});

// Extract company name from LinkedIn page
function extractCompanyName() {
  const selectors = [
    '.jobs-unified-top-card__company-name',
    '.job-details-jobs-unified-top-card__company-name',
    '[class*="company-name"]'
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) {
      return element.innerText.trim();
    }
  }

  return 'Unknown Company';
}

// Extract job location
function extractJobLocation() {
  const selectors = [
    '.jobs-unified-top-card__bullet',
    '.job-details-jobs-unified-top-card__bullet'
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) {
      return element.innerText.trim();
    }
  }

  return 'Unknown Location';
}

// Detect when user clicks "Apply" button
function detectApplyClick() {
  // LinkedIn "Easy Apply" button
  const applyButtons = document.querySelectorAll([
    'button[aria-label*="Apply"]',
    'button[aria-label*="apply"]',
    '.jobs-apply-button',
    '[class*="apply-button"]'
  ].join(','));

  applyButtons.forEach(button => {
    if (button.dataset.cvdebugTracked) {
      return; // Already tracking this button
    }

    button.dataset.cvdebugTracked = 'true';

    button.addEventListener('click', () => {
      console.log('[CVDebug] User clicked Apply button');

      // Extract job data
      const jobData = {
        title: extractJobTitle(),
        company: extractCompanyName(),
        location: extractJobLocation(),
        url: window.location.href,
        appliedDate: Date.now(),
        matchScore: window.cvdebugMatchScore || null, // Set by main content script
        status: 'applied'
      };

      // Save to tracked jobs
      trackJobApplication(jobData);

      // Show confirmation
      showApplyConfirmation(jobData);
    });
  });
}

// Track job application
function trackJobApplication(jobData) {
  // Check if already tracked
  const alreadyTracked = trackedJobs.some(job => job.url === jobData.url);

  if (alreadyTracked) {
    console.log('[CVDebug] Job already tracked:', jobData.title);
    return;
  }

  // Add to tracked jobs
  trackedJobs.push(jobData);

  // Save to storage
  chrome.storage.local.set({ trackedJobs: trackedJobs }, () => {
    console.log('[CVDebug] Tracked application:', jobData.title);
  });

  // Update stats
  updateApplicationStats(jobData);

  // Send to backend (if user is logged in)
  chrome.runtime.sendMessage({
    action: 'trackJobApplication',
    jobData: jobData
  });
}

// Update application statistics
function updateApplicationStats(jobData) {
  chrome.storage.local.get(['extensionStats'], (result) => {
    const stats = result.extensionStats || {
      jobsAnalyzed: 0,
      jobsApplied: 0,
      totalScore: 0,
      avgMatchScore: 0
    };

    stats.jobsApplied = (stats.jobsApplied || 0) + 1;

    if (jobData.matchScore) {
      stats.totalScore += jobData.matchScore;
      stats.avgMatchScore = Math.round(stats.totalScore / stats.jobsApplied);
    }

    chrome.storage.local.set({ extensionStats: stats });
  });
}

// Show application confirmation
function showApplyConfirmation(jobData) {
  // Create toast notification
  const toast = document.createElement('div');
  toast.className = 'cvdebug-apply-toast';
  toast.innerHTML = `
    <div class="cvdebug-toast-content">
      <div class="cvdebug-toast-icon">✅</div>
      <div class="cvdebug-toast-text">
        <div class="cvdebug-toast-title">Application Tracked</div>
        <div class="cvdebug-toast-subtitle">${jobData.title} at ${jobData.company}</div>
      </div>
    </div>
  `;

  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .cvdebug-apply-toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%);
      color: white;
      padding: 16px 20px;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(34, 197, 94, 0.3);
      z-index: 999999;
      animation: slideInUp 0.3s ease;
      min-width: 300px;
    }

    .cvdebug-toast-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .cvdebug-toast-icon {
      font-size: 24px;
      line-height: 1;
    }

    .cvdebug-toast-title {
      font-weight: 700;
      font-size: 14px;
      margin-bottom: 4px;
    }

    .cvdebug-toast-subtitle {
      font-size: 12px;
      opacity: 0.9;
    }

    @keyframes slideInUp {
      from {
        transform: translateY(100px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(toast);

  // Remove after 3 seconds
  setTimeout(() => {
    toast.style.animation = 'slideInUp 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Helper function - extract job title
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

// Get all tracked jobs
export function getTrackedJobs() {
  return trackedJobs;
}

// Get application stats
export function getApplicationStats() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['extensionStats', 'trackedJobs'], (result) => {
      const stats = result.extensionStats || {
        jobsAnalyzed: 0,
        jobsApplied: 0,
        avgMatchScore: 0
      };

      const jobs = result.trackedJobs || [];

      resolve({
        ...stats,
        recentApplications: jobs.slice(-5).reverse(), // Last 5 applications
        totalApplications: jobs.length
      });
    });
  });
}

// Initialize tracking
function initializeTracking() {
  // Detect apply button clicks
  detectApplyClick();

  // Re-check every 2 seconds for dynamically loaded buttons
  setInterval(detectApplyClick, 2000);
}

// Start tracking when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeTracking);
} else {
  initializeTracking();
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
  window.cvdebugJobTracker = {
    getTrackedJobs,
    getApplicationStats
  };
}

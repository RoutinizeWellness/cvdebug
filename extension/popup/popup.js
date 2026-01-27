// CVDebug Extension Popup Script

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const resumeUpload = document.getElementById('resume-upload');
  const resumeText = document.getElementById('resume-text');
  const saveResumeBtn = document.getElementById('save-resume-btn');
  const clearResumeBtn = document.getElementById('clear-resume-btn');
  const openDashboardBtn = document.getElementById('open-dashboard-btn');
  const jobAlertsBtn = document.getElementById('job-alerts-btn');
  const uploadSection = document.getElementById('upload-section');
  const statsSection = document.getElementById('stats-section');
  const statusIcon = document.getElementById('status-icon');
  const statusTitle = document.getElementById('status-title');
  const statusSubtitle = document.getElementById('status-subtitle');
  const resumeStatus = document.getElementById('resume-status');

  // Load stored resume on popup open
  loadStoredResume();

  // File upload handler
  resumeUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const text = await readFileAsText(file);
      resumeText.value = text;
      saveResumeBtn.style.display = 'block';
    } catch (error) {
      alert('Error reading file. Please try pasting your resume text instead.');
      console.error(error);
    }
  });

  // Textarea input handler
  resumeText.addEventListener('input', () => {
    if (resumeText.value.trim().length > 100) {
      saveResumeBtn.style.display = 'block';
    } else {
      saveResumeBtn.style.display = 'none';
    }
  });

  // Save resume handler
  saveResumeBtn.addEventListener('click', () => {
    const resume = resumeText.value.trim();
    if (resume.length < 100) {
      alert('Resume text is too short. Please paste your full resume (minimum 100 characters).');
      return;
    }

    // Save to storage
    chrome.runtime.sendMessage({
      action: 'saveResume',
      resume: resume
    }, (response) => {
      if (response.success) {
        updateUIWithResume(resume);
        resumeText.value = '';
        saveResumeBtn.style.display = 'none';
        showNotification('Resume saved! Open any LinkedIn job to see your match score.');
      }
    });
  });

  // Clear resume handler
  clearResumeBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear your saved resume?')) {
      chrome.storage.local.remove(['userResume'], () => {
        updateUINoResume();
        showNotification('Resume cleared.');
      });
    }
  });

  // Open dashboard handler
  openDashboardBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://cvdebug.com/dashboard' });
  });

  // Job alerts handler
  jobAlertsBtn.addEventListener('click', () => {
    window.location.href = 'alerts.html';
  });

  // Functions
  function loadStoredResume() {
    chrome.runtime.sendMessage({ action: 'getStoredResume' }, (response) => {
      if (response.resume) {
        updateUIWithResume(response.resume);
      } else {
        updateUINoResume();
      }
    });
  }

  function updateUIWithResume(resume) {
    // Update status
    resumeStatus.classList.add('has-resume');
    statusIcon.textContent = '✅';
    statusTitle.textContent = 'Resume Loaded';
    statusSubtitle.textContent = `${Math.round(resume.length / 1000)}K characters`;

    // Hide upload, show stats
    uploadSection.style.display = 'none';
    statsSection.style.display = 'flex';
    clearResumeBtn.style.display = 'block';
    jobAlertsBtn.style.display = 'block';

    // Load stats from storage
    chrome.storage.local.get(['extensionStats'], (result) => {
      const stats = result.extensionStats || { jobsAnalyzed: 0, totalScore: 0 };
      document.getElementById('jobs-analyzed').textContent = stats.jobsAnalyzed || 0;
      const avgMatch = stats.jobsAnalyzed > 0
        ? Math.round(stats.totalScore / stats.jobsAnalyzed)
        : '-';
      document.getElementById('avg-match').textContent = avgMatch === '-' ? '-' : `${avgMatch}%`;
    });
  }

  function updateUINoResume() {
    // Update status
    resumeStatus.classList.remove('has-resume');
    statusIcon.textContent = '📄';
    statusTitle.textContent = 'No Resume Loaded';
    statusSubtitle.textContent = 'Upload your resume to start matching';

    // Show upload, hide stats
    uploadSection.style.display = 'block';
    statsSection.style.display = 'none';
    clearResumeBtn.style.display = 'none';
  }

  function readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        // Basic extraction (works for txt, basic doc)
        // For proper PDF/DOC parsing, would need additional libraries
        resolve(text);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  function showNotification(message) {
    // Simple notification - could enhance with custom UI
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      background: #22C55E;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      animation: slideDown 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideUp 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
});

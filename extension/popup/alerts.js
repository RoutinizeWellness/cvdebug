// Job Alerts Configuration Script

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('alerts-form');
  const emailInput = document.getElementById('alert-email');
  const minScoreSlider = document.getElementById('min-score');
  const scoreDisplay = document.getElementById('score-display');
  const scoreValue = document.getElementById('score-value');
  const keywordsInput = document.getElementById('alert-keywords');
  const dailyDigestToggle = document.getElementById('daily-digest');
  const instantAlertsToggle = document.getElementById('instant-alerts');

  // Load saved preferences
  chrome.storage.local.get(['alertPreferences', 'userEmail'], (result) => {
    if (result.userEmail) {
      emailInput.value = result.userEmail;
    }

    if (result.alertPreferences) {
      const prefs = result.alertPreferences;
      minScoreSlider.value = prefs.minScore || 70;
      scoreDisplay.textContent = prefs.minScore || 70;
      scoreValue.textContent = prefs.minScore || 70;
      keywordsInput.value = (prefs.keywords || []).join(', ');
      dailyDigestToggle.checked = prefs.dailyDigest !== false;
      instantAlertsToggle.checked = prefs.instantAlerts === true;
    }
  });

  // Update score display when slider moves
  minScoreSlider.addEventListener('input', (e) => {
    const value = e.target.value;
    scoreDisplay.textContent = value;
    scoreValue.textContent = value;
  });

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const minScore = parseInt(minScoreSlider.value);
    const keywords = keywordsInput.value
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);

    const preferences = {
      email: email,
      minScore: minScore,
      keywords: keywords,
      dailyDigest: dailyDigestToggle.checked,
      instantAlerts: instantAlertsToggle.checked,
      createdAt: Date.now()
    };

    // Save locally
    chrome.storage.local.set({
      alertPreferences: preferences,
      userEmail: email
    }, () => {
      console.log('[CVDebug] Alert preferences saved');
    });

    // Send to backend
    try {
      const response = await fetch('https://cvdebug.com/api/extension/job-alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences)
      });

      if (response.ok) {
        showNotification('✅ Alert preferences saved! You\'ll start receiving notifications.', 'success');
        setTimeout(() => {
          window.location.href = 'popup.html';
        }, 2000);
      } else {
        showNotification('⚠️ Preferences saved locally, but couldn\'t sync with server. You may need to log in.', 'warning');
      }
    } catch (error) {
      console.error('[CVDebug] Failed to save alert preferences:', error);
      showNotification('✅ Preferences saved locally! Sync with CVDebug account when you log in.', 'success');
    }
  });

  function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: ${type === 'success' ? '#22C55E' : '#F59E0B'};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      max-width: 90%;
      text-align: center;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 3000);
  }
});

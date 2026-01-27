// CVDebug Chrome Extension - Background Service Worker

console.log('[CVDebug] Background service worker initialized');

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('[CVDebug] Extension installed');
    // Open welcome page
    chrome.tabs.create({
      url: 'https://cvdebug.com/extension-welcome'
    });
  } else if (details.reason === 'update') {
    console.log('[CVDebug] Extension updated to version', chrome.runtime.getManifest().version);
  }
});

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('[CVDebug] Message received:', request);

  if (request.action === 'analyzeJob') {
    // Future: Call CVDebug API to analyze job
    // For now, handled in content script
    sendResponse({ success: true });
  }

  if (request.action === 'getStoredResume') {
    chrome.storage.local.get(['userResume'], (result) => {
      sendResponse({ resume: result.userResume || null });
    });
    return true; // Async response
  }

  if (request.action === 'saveResume') {
    chrome.storage.local.set({ userResume: request.resume }, () => {
      console.log('[CVDebug] Resume saved to storage');

      // Notify all LinkedIn tabs to re-analyze
      chrome.tabs.query({ url: 'https://www.linkedin.com/jobs/*' }, (tabs) => {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, {
            action: 'resumeUpdated',
            resume: request.resume
          }).catch(err => console.log('Tab not ready:', err));
        });
      });

      sendResponse({ success: true });
    });
    return true; // Async response
  }

  return true;
});

// Monitor LinkedIn job pages and show badge
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('linkedin.com/jobs')) {
    // Check if user has resume uploaded
    chrome.storage.local.get(['userResume'], (result) => {
      if (result.userResume) {
        chrome.action.setBadgeText({ text: '✓', tabId: tabId });
        chrome.action.setBadgeBackgroundColor({ color: '#22C55E', tabId: tabId });
      } else {
        chrome.action.setBadgeText({ text: '!', tabId: tabId });
        chrome.action.setBadgeBackgroundColor({ color: '#EF4444', tabId: tabId });
      }
    });
  }
});

import FingerprintJS from '@fingerprintjs/fingerprintjs';

// Initialize FingerprintJS agent
let fpPromise: Promise<any> | null = null;

export async function getDeviceFingerprint(): Promise<string> {
  try {
    // Initialize the agent at application startup (lazy load)
    if (!fpPromise) {
      fpPromise = FingerprintJS.load();
    }

    // Get the visitor identifier
    const fp = await fpPromise;
    const result = await fp.get();
    
    // The visitorId is a unique identifier for this device/browser
    return result.visitorId;
  } catch (error) {
    console.error('Failed to generate device fingerprint:', error);
    // Fallback to basic fingerprinting if FingerprintJS fails
    return generateBasicFingerprint();
  }
}

// Fallback basic fingerprinting
function generateBasicFingerprint(): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('fingerprint', 2, 2);
  }
  
  const canvasData = canvas.toDataURL();
  
  const fingerprint = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    canvasFingerprint: canvasData.slice(0, 100),
  };
  
  // Simple hash function
  const str = JSON.stringify(fingerprint);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return Math.abs(hash).toString(36);
}

// Legacy function for backward compatibility
export function generateDeviceFingerprint(): string {
  return generateBasicFingerprint();
}

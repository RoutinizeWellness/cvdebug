/**
 * Validation and Sanitization Utilities
 * Ensure data integrity and security
 */

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize text input (remove dangerous characters)
 */
export function sanitizeText(text: string): string {
  return text
    .replace(/[<>]/g, '') // Remove HTML tags
    .trim()
    .slice(0, 10000); // Limit length
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate score range (0-100)
 */
export function isValidScore(score: number): boolean {
  return score >= 0 && score <= 100 && !isNaN(score);
}

/**
 * Sanitize filename (remove dangerous characters)
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .slice(0, 255);
}

/**
 * Validate phone number format
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s()-]{10,}$/;
  return phoneRegex.test(phone);
}

/**
 * Rate limit check helper
 */
export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export class RateLimitTracker {
  private requests: Map<string, number[]> = new Map();

  isAllowed(key: string, config: RateLimitConfig): boolean {
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Get existing requests
    const userRequests = this.requests.get(key) || [];

    // Filter to only recent requests
    const recentRequests = userRequests.filter(time => time > windowStart);

    // Check if limit exceeded
    if (recentRequests.length >= config.maxRequests) {
      return false;
    }

    // Add new request
    recentRequests.push(now);
    this.requests.set(key, recentRequests);

    // Cleanup old entries periodically
    if (this.requests.size > 1000) {
      this.cleanup(windowStart);
    }

    return true;
  }

  private cleanup(cutoff: number) {
    for (const [key, times] of this.requests.entries()) {
      const recent = times.filter(t => t > cutoff);
      if (recent.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, recent);
      }
    }
  }
}

/**
 * Validate pagination parameters
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

export function validatePagination(
  page: number,
  pageSize: number,
  maxPageSize: number = 100
): PaginationParams {
  return {
    page: Math.max(1, Math.floor(page)),
    pageSize: Math.min(maxPageSize, Math.max(1, Math.floor(pageSize))),
  };
}

/**
 * Validate and clamp numeric range
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Check if string is too long
 */
export function isWithinLimit(text: string, maxLength: number): boolean {
  return text.length <= maxLength;
}

/**
 * Validate array length
 */
export function validateArrayLength<T>(
  array: T[],
  minLength: number = 0,
  maxLength: number = 1000
): boolean {
  return array.length >= minLength && array.length <= maxLength;
}

/**
 * Safe JSON parse with fallback
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

/**
 * Validate timestamp (not in future, not too old)
 */
export function isValidTimestamp(
  timestamp: number,
  maxAgeMs: number = 365 * 24 * 60 * 60 * 1000 // 1 year
): boolean {
  const now = Date.now();
  return timestamp <= now && timestamp >= (now - maxAgeMs);
}

/**
 * Sanitize object keys (prevent prototype pollution)
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const safe: any = {};

  for (const key in obj) {
    if (
      Object.prototype.hasOwnProperty.call(obj, key) &&
      !key.startsWith('__') &&
      key !== 'constructor' &&
      key !== 'prototype'
    ) {
      safe[key] = obj[key];
    }
  }

  return safe;
}

/**
 * Validate hex color
 */
export function isValidHexColor(color: string): boolean {
  return /^#[0-9A-F]{6}$/i.test(color);
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Simple in-memory rate limiting
 * For production, consider using Redis or a dedicated rate limiting service
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private requests: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Cleanup old entries every minute
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.requests.entries()) {
        if (now > entry.resetTime) {
          this.requests.delete(key);
        }
      }
    }, 60000);
  }

  /**
   * Check if a request should be rate limited
   * @param identifier - Unique identifier (IP address, user ID, etc.)
   * @param limit - Maximum number of requests
   * @param windowMs - Time window in milliseconds
   * @returns true if rate limit exceeded, false otherwise
   */
  isRateLimited(identifier: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const entry = this.requests.get(identifier);

    if (!entry || now > entry.resetTime) {
      // First request or window expired
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + windowMs,
      });
      return false;
    }

    if (entry.count >= limit) {
      // Rate limit exceeded
      return true;
    }

    // Increment count
    entry.count++;
    this.requests.set(identifier, entry);
    return false;
  }

  /**
   * Get remaining time until rate limit resets
   */
  getResetTime(identifier: string): number {
    const entry = this.requests.get(identifier);
    if (!entry) return 0;
    return Math.max(0, entry.resetTime - Date.now());
  }

  /**
   * Clear rate limit for an identifier
   */
  clear(identifier: string): void {
    this.requests.delete(identifier);
  }

  /**
   * Cleanup interval (call on server shutdown)
   */
  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.requests.clear();
  }
}

// Singleton instance
const rateLimiter = new RateLimiter();

export default rateLimiter;

/**
 * Rate limit configurations for different endpoints
 */
export const RATE_LIMITS = {
  // Login: 5 attempts per 15 minutes
  LOGIN: { limit: 5, window: 15 * 60 * 1000 },
  
  // Forgot Password: 3 attempts per hour
  FORGOT_PASSWORD: { limit: 3, window: 60 * 60 * 1000 },
  
  // Contact Form: 5 submissions per hour
  CONTACT: { limit: 5, window: 60 * 60 * 1000 },
  
  // API Routes: 100 requests per minute
  API: { limit: 100, window: 60 * 1000 },
  
  // Admin Actions: 50 per minute
  ADMIN: { limit: 50, window: 60 * 1000 },
};

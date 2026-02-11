/**
 * Security utilities for input sanitization and validation
 */

/**
 * Escape HTML special characters to prevent XSS attacks
 */
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Validate email format with regex
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize string input (remove potentially dangerous characters)
 */
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and >
    .substring(0, 500); // Limit length
}

/**
 * Get client IP address from request headers
 */
export function getClientIp(headers: Headers): string | null {
  // Check various headers that might contain the real IP
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || null;
  }
  
  return (
    headers.get('x-real-ip') ||
    headers.get('cf-connecting-ip') || // Cloudflare
    headers.get('fastly-client-ip') || // Fastly
    headers.get('x-client-ip') ||
    null
  );
}

/**
 * Validate password strength
 */
export function isStrongPassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" };
  }
  
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: "كلمة المرور يجب أن تحتوي على حرف صغير" };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "كلمة المرور يجب أن تحتوي على حرف كبير" };
  }
  
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: "كلمة المرور يجب أن تحتوي على رقم" };
  }
  
  return { valid: true };
}

/**
 * Generate a secure random token
 */
export function generateSecureToken(length: number = 32): string {
  const crypto = require('crypto');
  return crypto.randomBytes(length).toString('hex');
}

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { escapeHtml, EMAIL_PATTERN, fetchWithTimeout } from '../lib/utils.js';
import { storeContactSubmission, recordSecurityEvent } from '../lib/contact-db.js';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Standard API response structure
 */
interface ApiResponse {
  ok?: boolean;
  error?: string;
  message?: string;
}

/**
 * Telegram API response structure
 */
interface TelegramResponse {
  ok: boolean;
  result?: unknown;
  description?: string;
}

// ============================================================================
// UTILITIES & CONSTANTS
// ============================================================================
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254; // RFC 5321 email address max length
const MAX_SUBJECT_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 5000;
const MAX_REQUEST_SIZE = 100_000; // 100KB max request size
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // Max 5 requests per minute per IP
const REQUEST_TIMEOUT_MS = 12_000; // 12 second timeout
const CORS_MAX_AGE = '86400'; // 24 hours
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',').filter(Boolean) || [];

/**
 * Validates that required environment variables are set
 * @throws {Error} If required env vars are missing
 */
function validateEnvironment(): void {
  const required = ['TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHAT_ID'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

// Validate environment on module load
try {
  validateEnvironment();
} catch (error) {
  console.error('Environment validation failed:', error instanceof Error ? error.message : 'Unknown error');
}

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Logs API requests for monitoring and debugging
 */
function logRequest(req: VercelRequest, action: string, details?: Record<string, unknown>): void {
  const timestamp = new Date().toISOString();
  const ip = getClientIp(req);
  const log = {
    timestamp,
    action,
    method: req.method,
    ip,
    ...details,
  };
  console.log(JSON.stringify(log));
}

/**
 * Checks if an IP address has exceeded the rate limit
 * @param ip - Client IP address
 * @returns true if rate limited, false otherwise
 */
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  
  entry.count++;
  
  // Clean up old entries periodically to prevent memory leaks
  if (rateLimitMap.size > 1000) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }
  
  return entry.count > RATE_LIMIT_MAX_REQUESTS;
}

/**
 * Extracts client IP address from request headers or socket
 * @param req - Vercel request object
 * @returns Client IP address
 */
function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  if (Array.isArray(forwarded)) return forwarded[0];
  return req.socket?.remoteAddress || 'unknown';
}

/**
 * Sets CORS headers on the response
 * @param res - Vercel response object
 * @param origin - Origin header from request
 */
function setCorsHeaders(res: VercelResponse, origin: string | undefined): void {
  const isAllowed = !origin || ALLOWED_ORIGINS.length === 0 || ALLOWED_ORIGINS.includes(origin);
  
  if (isAllowed && origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin'); // Prevent cache issues with CORS
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', CORS_MAX_AGE);
  
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
}

/**
 * Sanitizes a string by trimming whitespace and enforcing max length
 * @param value - String to sanitize
 * @param maxLength - Maximum allowed length
 * @returns Sanitized string
 */
function sanitizeString(value: string, maxLength: number): string {
  return value.trim().slice(0, maxLength);
}

interface ValidationError {
  status: number;
  error: string;
}

interface ValidatedData {
  cleanName: string;
  cleanEmail: string;
  cleanSubject: string;
  cleanMessage: string;
}

// ============================================================================
// VALIDATION LAYER
// ============================================================================

/**
 * Validates the incoming request structure and headers
 * @param req - Vercel request object
 * @returns ValidationError if invalid, null if valid
 */
function validateRequest(req: VercelRequest): ValidationError | null {
  if (!req.body || typeof req.body !== 'object') {
    return { status: 400, error: 'Invalid request body' };
  }

  const contentType = req.headers['content-type'];
  if (!contentType?.includes('application/json')) {
    return { status: 415, error: 'Content-Type must be application/json' };
  }

  // Check request size (approximate)
  const bodyString = JSON.stringify(req.body);
  if (bodyString.length > MAX_REQUEST_SIZE) {
    return { status: 413, error: 'Request too large' };
  }

  return null;
}

/**
 * Validates and sanitizes form fields from the request body
 * @param body - Request body object
 * @returns ValidationError if invalid, ValidatedData if valid
 */
function validateFields(body: unknown): ValidationError | ValidatedData {
  const { name, email, subject, message, hp } = body as Record<string, unknown>;

  // Type checking
  if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
    return { status: 400, error: 'Invalid field types' };
  }

  if (subject !== undefined && typeof subject !== 'string') {
    return { status: 400, error: 'Invalid subject type' };
  }

  // Honeypot check
  if (hp && typeof hp === 'string' && hp.trim().length > 0) {
    return { status: 200, error: 'ok' }; // Silent success for bots
  }

  // Sanitize
  const cleanName = sanitizeString(name, MAX_NAME_LENGTH);
  const cleanEmail = sanitizeString(email, MAX_EMAIL_LENGTH);
  const cleanSubject = subject ? sanitizeString(subject, MAX_SUBJECT_LENGTH) : '';
  const cleanMessage = sanitizeString(message, MAX_MESSAGE_LENGTH);

  // Required fields
  if (!cleanName || !cleanEmail || !cleanMessage) {
    const missing = [];
    if (!cleanName) missing.push('name');
    if (!cleanEmail) missing.push('email');
    if (!cleanMessage) missing.push('message');
    return { status: 400, error: `Missing required fields: ${missing.join(', ')}` };
  }

  // Length validation
  if (cleanName.length < 2) {
    return { status: 400, error: 'Name must be at least 2 characters long' };
  }

  if (cleanMessage.length < 10) {
    return { status: 400, error: 'Message must be at least 10 characters long' };
  }

  // Email validation
  if (!EMAIL_PATTERN.test(cleanEmail)) {
    return { status: 400, error: 'Invalid email format. Please provide a valid email address' };
  }

  return { cleanName, cleanEmail, cleanSubject, cleanMessage };
}

// ============================================================================
// TELEGRAM INTEGRATION
// ============================================================================

/**
 * Sends a contact form message to Telegram
 * @param cleanName - Sanitized sender name
 * @param cleanEmail - Sanitized sender email
 * @param cleanSubject - Sanitized message subject
 * @param cleanMessage - Sanitized message content
 * @returns Promise resolving to the fetch Response
 * @throws {Error} If Telegram configuration is missing
 */
async function sendToTelegram(
  cleanName: string,
  cleanEmail: string,
  cleanSubject: string,
  cleanMessage: string
): Promise<Response> {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('Telegram configuration missing');
    throw new Error('Server configuration error');
  }

  const messageText = buildTelegramMessage(cleanName, cleanEmail, cleanSubject, cleanMessage);
  const apiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  return await fetchWithTimeout(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: messageText,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    })
  }, REQUEST_TIMEOUT_MS);
}

/**
 * Builds a formatted Telegram message with HTML formatting
 * @param name - Sender name
 * @param email - Sender email
 * @param subject - Message subject (optional)
 * @param message - Message content
 * @returns Formatted message string with HTML tags
 */
function buildTelegramMessage(
  name: string,
  email: string,
  subject: string,
  message: string
): string {
  return [
    '<b>📬 New Contact Message</b>',
    '',
    `<b>Name:</b> ${escapeHtml(name)}`,
    `<b>Email:</b> ${escapeHtml(email)}`,
    subject ? `<b>Subject:</b> ${escapeHtml(subject)}` : null,
    '',
    '<b>Message:</b>',
    escapeHtml(message),
    '',
    '---',
    '<i>From portfolio contact form</i>',
    `<i>Time: ${new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' })} UTC</i>`
  ]
    .filter(Boolean)
    .join('\n');
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

/**
 * Main API handler for contact form submissions
 * Handles CORS, rate limiting, validation, and Telegram integration
 * @param req - Vercel request object
 * @param res - Vercel response object
 * @returns Promise resolving to the API response
 */
export default async function handler(req: VercelRequest, res: VercelResponse): Promise<VercelResponse | void> {
  const origin = req.headers.origin as string | undefined;
  setCorsHeaders(res, origin);

  // CORS preflight
  if (req.method === 'OPTIONS') {
    logRequest(req, 'preflight');
    return res.status(204).end();
  }

  // Method validation
  if (req.method !== 'POST') {
    logRequest(req, 'invalid_method', { method: req.method });
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting
  const clientIp = getClientIp(req);
  if (isRateLimited(clientIp)) {
    logRequest(req, 'rate_limited', { ip: clientIp });
    // Record rate limit hit for analytics (if DATABASE_URL is set)
    if (process.env.DATABASE_URL) {
      try {
        await recordSecurityEvent('rate_limit', clientIp);
      } catch (dbError) {
        console.error('Failed to record rate limit event:', dbError);
      }
    }
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  // Request validation
  const requestError = validateRequest(req);
  if (requestError) {
    logRequest(req, 'validation_failed', { error: requestError.error });
    return res.status(requestError.status).json({ error: requestError.error });
  }

  try {
    // Field validation & sanitization
    const fieldResult = validateFields(req.body);
    if ('status' in fieldResult) {
      logRequest(req, 'field_validation_failed', { error: fieldResult.error });
      return res.status(fieldResult.status).json({ error: fieldResult.error });
    }

    const { cleanName, cleanEmail, cleanSubject, cleanMessage } = fieldResult;

    // Store submission in PostgreSQL (concurrently with Telegram)
    let dbPromise: Promise<any> = Promise.resolve();

    if (process.env.DATABASE_URL) {
      const userAgent = req.headers['user-agent'] as string | undefined;
      dbPromise = storeContactSubmission(
        cleanName,
        cleanEmail,
        cleanSubject,
        cleanMessage,
        clientIp,
        userAgent || null
      ).catch((dbError) => {
        console.error('Failed to store submission in database:', dbError);
        // Don't fail the request if database storage fails
      });
    }

    // Send to Telegram
    const tgPromise = sendToTelegram(cleanName, cleanEmail, cleanSubject, cleanMessage);

    // Wait for both to complete
    const [_, tgResp] = await Promise.all([dbPromise, tgPromise]);

    if (!tgResp.ok) {
      const errText = await tgResp.text().catch(() => 'Unknown error');
      console.error('Telegram API error:', tgResp.status, errText);
      logRequest(req, 'telegram_api_error', { 
        status: tgResp.status, 
        error: errText.substring(0, 200) 
      });
      return res.status(502).json({ error: 'Failed to send message' });
    }

    logRequest(req, 'success', { email: cleanEmail });
    return res.status(200).json({ ok: true, message: 'Message sent successfully' });
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      logRequest(req, 'timeout');
      return res.status(504).json({ error: 'Request timeout' });
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Handler error:', error);
    logRequest(req, 'error', { error: errorMessage });
    return res.status(500).json({ error: 'Internal server error' });
  }
}

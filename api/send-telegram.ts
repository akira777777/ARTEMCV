import type { VercelRequest, VercelResponse } from '@vercel/node';
import { escapeHtml, EMAIL_PATTERN, fetchWithTimeout } from '../lib/utils.js';

// ============================================================================
// UTILITIES & CONSTANTS
// ============================================================================
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_SUBJECT_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 5000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const REQUEST_TIMEOUT_MS = 12_000;
const CORS_MAX_AGE = '86400';
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || [];

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  
  entry.count++;
  return entry.count > RATE_LIMIT_MAX_REQUESTS;
}

function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  if (Array.isArray(forwarded)) return forwarded[0];
  return req.socket?.remoteAddress || 'unknown';
}

function setCorsHeaders(res: VercelResponse, origin: string | undefined): void {
  const isAllowed = !origin || ALLOWED_ORIGINS.length === 0 || ALLOWED_ORIGINS.includes(origin);
  
  if (isAllowed && origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', CORS_MAX_AGE);
}

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

function validateRequest(req: VercelRequest): ValidationError | null {
  if (!req.body || typeof req.body !== 'object') {
    return { status: 400, error: 'Invalid request body' };
  }

  const contentType = req.headers['content-type'];
  if (!contentType?.includes('application/json')) {
    return { status: 415, error: 'Content-Type must be application/json' };
  }

  return null;
}

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
    return { status: 400, error: 'Missing required fields' };
  }

  // Length validation
  if (cleanName.length < 2) {
    return { status: 400, error: 'Name too short' };
  }

  if (cleanMessage.length < 10) {
    return { status: 400, error: 'Message too short' };
  }

  // Email validation
  if (!EMAIL_PATTERN.test(cleanEmail)) {
    return { status: 400, error: 'Invalid email format' };
  }

  return { cleanName, cleanEmail, cleanSubject, cleanMessage };
}

// ============================================================================
// TELEGRAM INTEGRATION
// ============================================================================

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
    `<i>Time: ${new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</i>`
  ]
    .filter(Boolean)
    .join('\n');
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin as string | undefined;
  setCorsHeaders(res, origin);

  // CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Method validation
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting
  const clientIp = getClientIp(req);
  if (isRateLimited(clientIp)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  // Request validation
  const requestError = validateRequest(req);
  if (requestError) {
    return res.status(requestError.status).json({ error: requestError.error });
  }

  try {
    // Field validation & sanitization
    const fieldResult = validateFields(req.body);
    if ('status' in fieldResult) {
      return res.status(fieldResult.status).json({ error: fieldResult.error });
    }

    const { cleanName, cleanEmail, cleanSubject, cleanMessage } = fieldResult;

    // Send to Telegram
    const tgResp = await sendToTelegram(cleanName, cleanEmail, cleanSubject, cleanMessage);

    if (!tgResp.ok) {
      const errText = await tgResp.text().catch(() => 'Unknown error');
      console.error('Telegram API error:', tgResp.status, errText);
      return res.status(502).json({ error: 'Failed to send message' });
    }

    return res.status(200).json({ ok: true });
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      return res.status(504).json({ error: 'Request timeout' });
    }
    console.error('Handler error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

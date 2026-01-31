import type { VercelRequest, VercelResponse } from '@vercel/node';

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

// Pre-compile regex at module scope to avoid recompilation on every request
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Input length limits to prevent abuse
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_SUBJECT_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 5000;

// CORS configuration
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || [];

function setCorsHeaders(res: VercelResponse, origin: string | undefined): void {
  if (origin && (ALLOWED_ORIGINS.length === 0 || ALLOWED_ORIGINS.includes(origin))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');
}

function sanitizeString(value: string, maxLength: number): string {
  return value.trim().slice(0, maxLength);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin as string | undefined;
  setCorsHeaders(res, origin);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate content type
  const contentType = req.headers['content-type'];
  if (!contentType?.includes('application/json')) {
    return res.status(415).json({ error: 'Content-Type must be application/json' });
  }

  try {
    // Validate body exists and is an object
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const { name, email, subject, message, chatId, hp } = req.body as {
      name?: unknown;
      email?: unknown;
      subject?: unknown;
      message?: unknown;
      chatId?: unknown;
      hp?: unknown;
    };

    // Type validation
    if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
      return res.status(400).json({ error: 'Invalid field types' });
    }

    if (subject !== undefined && typeof subject !== 'string') {
      return res.status(400).json({ error: 'Invalid subject type' });
    }

    // Honeypot: silently ignore bots
    if (hp && typeof hp === 'string' && hp.trim().length > 0) {
      return res.status(200).json({ ok: true });
    }

    // Sanitize and validate inputs
    const cleanName = sanitizeString(name, MAX_NAME_LENGTH);
    const cleanEmail = sanitizeString(email, MAX_EMAIL_LENGTH);
    const cleanSubject = subject ? sanitizeString(subject, MAX_SUBJECT_LENGTH) : '';
    const cleanMessage = sanitizeString(message, MAX_MESSAGE_LENGTH);

    if (!cleanName || !cleanEmail || !cleanMessage) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (cleanName.length < 2) {
      return res.status(400).json({ error: 'Name too short' });
    }

    if (cleanMessage.length < 10) {
      return res.status(400).json({ error: 'Message too short' });
    }

    if (!EMAIL_PATTERN.test(cleanEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    // Only use server-side chat ID for security (ignore client chatId)
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error('Telegram configuration missing');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const text = [
      '<b>📬 New Contact Message</b>',
      '',
      `<b>Name:</b> ${escapeHtml(cleanName)}`,
      `<b>Email:</b> ${escapeHtml(cleanEmail)}`,
      cleanSubject ? `<b>Subject:</b> ${escapeHtml(cleanSubject)}` : null,
      '',
      '<b>Message:</b>',
      escapeHtml(cleanMessage),
      '',
      '---',
      `<i>From portfolio contact form</i>`,
      `<i>Time: ${new Date().toISOString()}</i>`
    ]
      .filter(Boolean)
      .join('\n');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);

    try {
      const tgResp = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!tgResp.ok) {
        const errText = await tgResp.text().catch(() => 'Unknown error');
        console.error('Telegram API error:', tgResp.status, errText);
        return res.status(502).json({ error: 'Failed to send message' });
      }

      return res.status(200).json({ ok: true });
    } catch (fetchError: unknown) {
      clearTimeout(timeout);
      throw fetchError;
    }
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      return res.status(504).json({ error: 'Request timeout' });
    }
    console.error('Handler error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

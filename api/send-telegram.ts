import type { VercelRequest, VercelResponse } from '@vercel/node';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message, chatId, hp } = (req.body || {}) as {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
      chatId?: string;
      hp?: string;
    };

    // Honeypot: silently ignore bots
    if (hp && hp.trim().length > 0) {
      return res.status(200).json({ ok: true });
    }

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || chatId;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      return res.status(500).json({ error: 'Server not configured for Telegram' });
    }

    const text = [
      '<b>New Contact Message</b>',
      `Name: ${escapeHtml(name.trim())}`,
      `Email: ${escapeHtml(email.trim())}`,
      subject ? `Subject: ${escapeHtml(subject.trim())}` : null,
      'Message:',
      escapeHtml(message.trim()),
      '---',
      'From portfolio contact form'
    ]
      .filter(Boolean)
      .join('\n');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);

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
      const err = await tgResp.text();
      return res.status(tgResp.status).json({ error: err || 'Telegram send failed' });
    }

    return res.status(200).json({ ok: true });
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      return res.status(504).json({ error: 'Telegram timeout' });
    }
    return res.status(500).json({ error: error?.message || 'Unexpected error' });
  }
}

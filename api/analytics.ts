/**
 * Analytics API Endpoint
 * Protected endpoint to get contact form statistics
 *
 * Usage:
 *   GET /api/analytics?apiKey=YOUR_SECRET_KEY
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  getContactSubmissions,
  getContactAnalytics,
  getTodayStatistics,
} from '../lib/contact-db';

interface AnalyticsDay {
  date: string;
  total_submissions: number;
  unique_visitors: number;
  honeypot_catches: number;
  rate_limit_hits: number;
}

function setCorsHeaders(res: VercelResponse, origin: string | undefined): void {
  const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || [];
  const isAllowed = !origin || ALLOWED_ORIGINS.length === 0 || ALLOWED_ORIGINS.includes(origin);

  if (isAllowed && origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
}

function validateApiKey(apiKey: string | undefined): boolean {
  const expectedKey = process.env.ANALYTICS_API_KEY;
  if (!expectedKey) {
    console.warn('ANALYTICS_API_KEY not configured');
    return false;
  }
  return apiKey === expectedKey;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin as string | undefined;
  setCorsHeaders(res, origin);

  // CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Method validation
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // API key validation
  const apiKey = req.headers.authorization?.replace('Bearer ', '');
  if (!validateApiKey(apiKey)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { type = 'summary', days = 30, limit = 50, offset = 0 } = req.query;

    if (type === 'submissions') {
      // Get recent submissions
      const { submissions, total } = await getContactSubmissions(
        Math.min(parseInt(limit as string) || 50, 100),
        parseInt(offset as string) || 0
      );

      return res.status(200).json({
        data: submissions,
        pagination: { total, limit, offset },
      });
    }

    if (type === 'analytics') {
      // Get analytics for date range
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - (parseInt(days as string) || 30) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      const analytics = await getContactAnalytics(startDate, endDate);

      return res.status(200).json({
        data: analytics,
        dateRange: { startDate, endDate },
      });
    }

    // Default: summary
    const today = await getTodayStatistics();
    const { submissions, total } = await getContactSubmissions(5);

    const recentWeekAnalytics = await getContactAnalytics(
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      new Date().toISOString().split('T')[0]
    );

    return res.status(200).json({
      today: today || { total_submissions: 0, honeypot_catches: 0, rate_limit_hits: 0 },
      weekSummary: {
        total_submissions: recentWeekAnalytics.reduce((sum, day: AnalyticsDay) => sum + (day.total_submissions || 0), 0),
        unique_visitors: recentWeekAnalytics.reduce((sum, day: AnalyticsDay) => sum + (day.unique_visitors || 0), 0),
        honeypot_catches: recentWeekAnalytics.reduce((sum, day: AnalyticsDay) => sum + (day.honeypot_catches || 0), 0),
      },
      totalSubmissions: total,
      recentSubmissions: submissions.slice(0, 5),
    });
  } catch (error: unknown) {
    console.error('Analytics endpoint error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

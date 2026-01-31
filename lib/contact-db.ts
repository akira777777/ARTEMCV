/**
 * Database Service Functions for Contact Submissions
 * High-level operations on contact submissions and analytics
 */

import { query, transaction } from './db';

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  status: 'new' | 'read' | 'archived';
}

/**
 * Store a new contact submission in the database
 */
export async function storeContactSubmission(
  name: string,
  email: string,
  subject: string,
  message: string,
  ipAddress: string | null,
  userAgent: string | null
): Promise<string> {
  const result = await query(
    `INSERT INTO contact_submissions (name, email, subject, message, ip_address, user_agent)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id`,
    [name, email, subject, message, ipAddress, userAgent]
  );

  const submissionId = result.rows[0].id;

  // Log the submission event
  await query(
    `INSERT INTO contact_audit_log (submission_id, event_type, event_data)
     VALUES ($1, $2, $3)`,
    [submissionId, 'submitted', JSON.stringify({ method: 'contact_form' })]
  );

  // Update daily analytics
  await query(
    `INSERT INTO contact_analytics (date, total_submissions, unique_visitors)
     VALUES (CURRENT_DATE, 1, 1)
     ON CONFLICT (date) DO UPDATE SET
       total_submissions = total_submissions + 1,
       unique_visitors = CASE WHEN excluded.ip_address != $1 THEN unique_visitors + 1 ELSE unique_visitors END`,
    [ipAddress]
  );

  return submissionId;
}

/**
 * Get all contact submissions with pagination
 */
export async function getContactSubmissions(
  limit: number = 50,
  offset: number = 0,
  status?: 'new' | 'read' | 'archived'
): Promise<{ submissions: ContactSubmission[]; total: number }> {
  let sql = 'SELECT * FROM contact_submissions';
  const params: unknown[] = [];

  if (status) {
    sql += ' WHERE status = $1';
    params.push(status);
  }

  sql += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
  params.push(limit, offset);

  const result = await query(sql, params);

  // Get total count
  let countSql = 'SELECT COUNT(*) FROM contact_submissions';
  if (status) {
    countSql += ' WHERE status = $1';
  }
  const countResult = await query(countSql, status ? [status] : []);
  const total = parseInt(countResult.rows[0].count, 10);

  return {
    submissions: result.rows as ContactSubmission[],
    total,
  };
}

/**
 * Get a single contact submission by ID
 */
export async function getContactSubmission(id: string): Promise<ContactSubmission | null> {
  const result = await query(
    'SELECT * FROM contact_submissions WHERE id = $1',
    [id]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0] as ContactSubmission;
}

/**
 * Update submission status
 */
export async function updateSubmissionStatus(
  id: string,
  status: 'new' | 'read' | 'archived'
): Promise<boolean> {
  const result = await query(
    'UPDATE contact_submissions SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id',
    [status, id]
  );

  if (result.rows.length > 0) {
    // Log the status change
    await query(
      `INSERT INTO contact_audit_log (submission_id, event_type, event_data)
       VALUES ($1, $2, $3)`,
      [id, 'status_changed', JSON.stringify({ new_status: status })]
    );
    return true;
  }

  return false;
}

/**
 * Add admin notes to a submission
 */
export async function addSubmissionNotes(id: string, notes: string): Promise<boolean> {
  const result = await query(
    'UPDATE contact_submissions SET notes = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id',
    [notes, id]
  );

  return result.rows.length > 0;
}

/**
 * Get contact analytics for a date range
 */
export async function getContactAnalytics(
  startDate: string,
  endDate: string
): Promise<Record<string, unknown>[]> {
  const result = await query(
    `SELECT * FROM contact_analytics
     WHERE date BETWEEN $1 AND $2
     ORDER BY date DESC`,
    [startDate, endDate]
  );

  return result.rows;
}

/**
 * Record honeypot or rate limit hit
 */
export async function recordSecurityEvent(
  eventType: 'honeypot' | 'rate_limit',
  ipAddress: string | null
): Promise<void> {
  if (eventType === 'honeypot') {
    await query(
      `INSERT INTO contact_analytics (date, honeypot_catches)
       VALUES (CURRENT_DATE, 1)
       ON CONFLICT (date) DO UPDATE SET
         honeypot_catches = contact_analytics.honeypot_catches + 1`,
      []
    );
  } else {
    await query(
      `INSERT INTO contact_analytics (date, rate_limit_hits)
       VALUES (CURRENT_DATE, 1)
       ON CONFLICT (date) DO UPDATE SET
         rate_limit_hits = contact_analytics.rate_limit_hits + 1`,
      []
    );
  }
}

/**
 * Get today's statistics
 */
export async function getTodayStatistics(): Promise<Record<string, unknown> | null> {
  const result = await query(
    'SELECT * FROM contact_analytics WHERE date = CURRENT_DATE'
  );

  return result.rows[0] || null;
}

/**
 * Delete old submissions (older than 90 days) for privacy compliance
 */
export async function deleteOldSubmissions(daysOld: number = 90): Promise<number> {
  const result = await query(
    `DELETE FROM contact_submissions
     WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '1 day' * $1
     AND status = 'archived'`,
    [daysOld]
  );

  return result.rowCount || 0;
}

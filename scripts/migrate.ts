/**
 * Database Schema Migration for ARTEMCV
 * Run this once to create tables in Neon PostgreSQL
 *
 * Usage (local development):
 *   npx ts-node scripts/migrate.ts
 *
 * Usage (Vercel):
 *   Add as a build script or run manually via Vercel CLI
 */

import 'dotenv/config';
import { query } from '../lib/db';

const migrations = [
  {
    name: 'create_contact_submissions_table',
    sql: `
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        email VARCHAR(254) NOT NULL,
        subject VARCHAR(200),
        message TEXT NOT NULL,
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'read', 'archived')),
        notes TEXT
      );

      CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);
      CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
    `,
  },
  {
    name: 'create_contact_analytics_table',
    sql: `
      CREATE TABLE IF NOT EXISTS contact_analytics (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        date DATE DEFAULT CURRENT_DATE,
        total_submissions INT DEFAULT 0,
        unique_visitors INT DEFAULT 0,
        avg_response_time_ms FLOAT,
        honeypot_catches INT DEFAULT 0,
        rate_limit_hits INT DEFAULT 0,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE UNIQUE INDEX IF NOT EXISTS idx_contact_analytics_date ON contact_analytics(date);
    `,
  },
  {
    name: 'create_contact_audit_log_table',
    sql: `
      CREATE TABLE IF NOT EXISTS contact_audit_log (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        submission_id UUID REFERENCES contact_submissions(id) ON DELETE CASCADE,
        event_type VARCHAR(50) NOT NULL,
        event_data JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_audit_log_submission_id ON contact_audit_log(submission_id);
      CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON contact_audit_log(created_at DESC);
    `,
  },
];

async function runMigrations(): Promise<void> {
  console.log('🚀 Starting database migrations...\n');

  try {
    for (const migration of migrations) {
      console.log(`Running migration: ${migration.name}`);
      await query(migration.sql);
      console.log(`✅ ${migration.name} completed\n`);
    }

    console.log('✅ All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migrations
runMigrations();

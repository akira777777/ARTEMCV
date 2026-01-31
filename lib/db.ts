/**
 * Neon PostgreSQL Database Connection
 * Serverless PostgreSQL for contact form submissions and analytics
 *
 * Environment Variables Required:
 * - DATABASE_URL: Connection string from Neon (format: postgresql://user:password@host/database)
 */

import 'dotenv/config';
import { Pool, QueryResult } from 'pg';

// Load environment variables from .env.local
const databaseUrl = process.env.DATABASE_URL || '';

// Create connection pool for efficient connection management
let pool: Pool | null = null;

/**
 * Get or create database connection pool
 */
function getPool(): Pool {
  if (pool) {
    return pool;
  }

  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is required. Check .env.local file.');
  }

  // SSL configuration: strict in production, flexible in development
  const sslConfig =
    process.env.DATABASE_SSL_CA
      ? {
          rejectUnauthorized: true,
          ca: process.env.DATABASE_SSL_CA,
        }
      : process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: true }
      : { rejectUnauthorized: false };

  pool = new Pool({
    connectionString: databaseUrl,
    ssl: sslConfig,
    // Connection pooling settings for serverless
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
  });

  return pool;
}

/**
 * Execute a database query
 */
export async function query(
  text: string,
  params?: unknown[]
): Promise<QueryResult> {
  const client = await getPool().connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}

/**
 * Execute multiple queries in a transaction
 */
export async function transaction<T>(
  callback: (client: any) => Promise<T>
): Promise<T> {
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Close database connection pool (useful for cleanup)
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

/**
 * Check database connection status
 */
export async function checkConnection(): Promise<boolean> {
  try {
    const result = await query('SELECT NOW()');
    return result.rows.length > 0;
  } catch (error) {
    console.error('Database connection check failed:', error);
    return false;
  }
}

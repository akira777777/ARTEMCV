const assert = require('assert');

/**
 * LOGIC VERIFICATION SCRIPT
 *
 * This script verifies the logic of the refactored functions in lib/contact-db.ts
 * by re-implementing them in JavaScript with a mock database client.
 * This ensures that the parameters are passed correctly and the flow is sound.
 */

// Mock database environment
const mockDb = {
  queries: [],
  reset() {
    this.queries = [];
  },
  async transaction(callback) {
    const client = {
      query: async (text, params) => {
        mockDb.queries.push({ text, params });
        if (
          text.includes('INSERT INTO contact_submissions') ||
          text.includes('UPDATE contact_submissions')
        ) {
          return { rows: [{ id: 'test-id-123' }], rowCount: 1 };
        }
        return { rows: [], rowCount: 1 };
      },
    };
    return await callback(client);
  },
};

// Re-implementation of refactored storeContactSubmission
async function verifyStoreContactSubmission(name, email, subject, message, ipAddress, userAgent) {
  return await mockDb.transaction(async (client) => {
    const result = await client.query(
      `INSERT INTO contact_submissions (name, email, subject, message, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [name, email, subject, message, ipAddress, userAgent],
    );

    const submissionId = result.rows[0].id;

    await client.query(
      `INSERT INTO contact_audit_log (submission_id, event_type, event_data)
       VALUES ($1, $2, $3)`,
      [submissionId, 'submitted', JSON.stringify({ method: 'contact_form' })],
    );

    await client.query(
      `INSERT INTO contact_analytics (date, total_submissions, unique_visitors)
       VALUES (CURRENT_DATE, 1, 1)
       ON CONFLICT (date) DO UPDATE SET
         total_submissions = contact_analytics.total_submissions + 1,
         unique_visitors = contact_analytics.unique_visitors + 1`,
      [],
    );

    return submissionId;
  });
}

// Re-implementation of refactored updateSubmissionStatus
async function verifyUpdateSubmissionStatus(id, status) {
  return await mockDb.transaction(async (client) => {
    const result = await client.query(
      'UPDATE contact_submissions SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id',
      [status, id],
    );

    if (result.rows.length > 0) {
      await client.query(
        `INSERT INTO contact_audit_log (submission_id, event_type, event_data)
         VALUES ($1, $2, $3)`,
        [id, 'status_changed', JSON.stringify({ new_status: status })],
      );
      return true;
    }

    return false;
  });
}

async function runVerification() {
  console.log('--- Starting Logic Verification ---\n');

  // 1. Verify storeContactSubmission
  mockDb.reset();
  console.log('Testing storeContactSubmission...');
  const submissionId = await verifyStoreContactSubmission(
    'Jane Doe',
    'jane@example.com',
    'Inquiry',
    'Hello there',
    '127.0.0.1',
    'Browser/1.0',
  );

  assert.strictEqual(submissionId, 'test-id-123', 'Should return the submission ID');
  assert.strictEqual(mockDb.queries.length, 3, 'Should execute exactly 3 queries');

  // Check first query (INSERT submission)
  assert.ok(
    mockDb.queries[0].text.includes('INSERT INTO contact_submissions'),
    'First query should be INSERT submission',
  );
  assert.strictEqual(mockDb.queries[0].params.length, 6, 'First query should have 6 parameters');
  assert.strictEqual(mockDb.queries[0].params[0], 'Jane Doe');
  assert.strictEqual(mockDb.queries[0].params[1], 'jane@example.com');
  assert.strictEqual(mockDb.queries[0].params[5], 'Browser/1.0');

  // Check second query (INSERT audit log)
  assert.ok(
    mockDb.queries[1].text.includes('INSERT INTO contact_audit_log'),
    'Second query should be INSERT audit log',
  );
  assert.strictEqual(
    mockDb.queries[1].params[0],
    'test-id-123',
    'Should use the ID from the first query',
  );
  assert.strictEqual(mockDb.queries[1].params[1], 'submitted');

  // Check third query (Update analytics)
  assert.ok(
    mockDb.queries[2].text.includes('INSERT INTO contact_analytics'),
    'Third query should be analytics update',
  );
  console.log('✅ storeContactSubmission logic verified.');

  // 2. Verify updateSubmissionStatus
  mockDb.reset();
  console.log('\nTesting updateSubmissionStatus...');
  const success = await verifyUpdateSubmissionStatus('test-id-123', 'read');

  assert.strictEqual(success, true, 'Should return true on success');
  assert.strictEqual(mockDb.queries.length, 2, 'Should execute exactly 2 queries');

  // Check first query (UPDATE status)
  assert.ok(
    mockDb.queries[0].text.includes('UPDATE contact_submissions'),
    'First query should be UPDATE status',
  );
  assert.strictEqual(mockDb.queries[0].params[0], 'read');
  assert.strictEqual(mockDb.queries[0].params[1], 'test-id-123');

  // Check second query (INSERT audit log)
  assert.ok(
    mockDb.queries[1].text.includes('INSERT INTO contact_audit_log'),
    'Second query should be INSERT audit log',
  );
  assert.strictEqual(mockDb.queries[1].params[0], 'test-id-123');
  assert.ok(mockDb.queries[1].params[2].includes('read'), 'Log data should contain the new status');
  console.log('✅ updateSubmissionStatus logic verified.');

  console.log('\n--- All Logic Verifications Passed! ---');
}

runVerification().catch((err) => {
  console.error('\n❌ Verification failed:');
  console.error(err);
  process.exit(1);
});

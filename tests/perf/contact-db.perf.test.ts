import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getContactSubmissions } from '../../lib/contact-db';
import * as db from '../../lib/db';

vi.mock('../../lib/db', () => ({
  query: vi.fn(),
  transaction: vi.fn(),
}));

describe('getContactSubmissions Performance', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('measures execution time of getContactSubmissions', async () => {
    const delay = 100;

    // Mock implementation with delay
    // We use a simplified mock that returns valid structure but waits
    vi.mocked(db.query).mockImplementation(async (sql, params) => {
      await new Promise(resolve => setTimeout(resolve, delay));

      if (typeof sql === 'string' && sql.includes('COUNT')) {
        return {
          rows: [{ count: '10' }],
          rowCount: 1,
          command: 'SELECT',
          oid: 0,
          fields: []
        };
      }

      return {
        rows: [
          {
            id: '1',
            name: 'Test',
            email: 'test@example.com',
            subject: 'Hi',
            message: 'Hello',
            created_at: new Date().toISOString(),
            status: 'new'
          }
        ],
        rowCount: 1,
        command: 'SELECT',
        oid: 0,
        fields: []
      };
    });

    const start = performance.now();
    await getContactSubmissions(10, 0);
    const end = performance.now();
    const duration = end - start;

    console.log('---------------------------------------------------');
    console.log(`Execution time: ${duration.toFixed(2)}ms`);
    console.log(`Expected sequential: ~${delay * 2}ms`);
    console.log(`Expected parallel: ~${delay}ms`);
    console.log('---------------------------------------------------');

    // We don't fail here yet, we just measure.
    expect(duration).toBeGreaterThan(0);
  });
});

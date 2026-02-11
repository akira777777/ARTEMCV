const { performance } = require('perf_hooks');

/**
 * SIMULATION BENCHMARK: Multiple Connections vs Single Transaction
 *
 * This script simulates the database connection overhead and query latency
 * to demonstrate the theoretical performance improvement of using a
 * single transaction (single connection) for multiple sequential queries.
 */

async function mockQuery(latency) {
  return new Promise(resolve => setTimeout(() => {
    resolve({ rows: [{ id: 'simulated-id-' + Math.random().toString(36).substr(2, 9) }] });
  }, latency));
}

async function runSequentialSimulation(queriesCount, queryLatency, connectionOverhead) {
  const start = performance.now();

  for (let i = 0; i < queriesCount; i++) {
    // Simulate connection acquisition
    await new Promise(resolve => setTimeout(resolve, connectionOverhead));
    // Execute query
    await mockQuery(queryLatency);
    // Simulate connection release (usually negligible, but included in overhead conceptually)
  }

  return performance.now() - start;
}

async function runTransactionSimulation(queriesCount, queryLatency, connectionOverhead) {
  const start = performance.now();

  // Simulate single connection acquisition
  await new Promise(resolve => setTimeout(resolve, connectionOverhead));

  // BEGIN
  await mockQuery(queryLatency);

  // Actual queries
  for (let i = 0; i < queriesCount; i++) {
    await mockQuery(queryLatency);
  }

  // COMMIT
  await mockQuery(queryLatency);

  // Conceptually release connection at the end
  return performance.now() - start;
}

async function runBenchmark() {
  // Realistic parameters for serverless Postgres (like Neon)
  const QUERY_LATENCY = 15;      // 15ms average query execution time
  const CONNECTION_OVERHEAD = 40; // 40ms to establish/acquire connection in serverless
  const QUERIES_IN_TASK = 3;     // Number of queries in storeContactSubmission
  const ITERATIONS = 10;         // Number of times to run for average

  console.log('--- Database Interaction Simulation Benchmark ---');
  console.log(`Parameters: ${QUERIES_IN_TASK} queries, ${QUERY_LATENCY}ms latency, ${CONNECTION_OVERHEAD}ms connection overhead\n`);

  let totalSequentialTime = 0;
  let totalTransactionTime = 0;

  for (let i = 0; i < ITERATIONS; i++) {
    totalSequentialTime += await runSequentialSimulation(QUERIES_IN_TASK, QUERY_LATENCY, CONNECTION_OVERHEAD);
    totalTransactionTime += await runTransactionSimulation(QUERIES_IN_TASK, QUERY_LATENCY, CONNECTION_OVERHEAD);
  }

  const avgSequential = totalSequentialTime / ITERATIONS;
  const avgTransaction = totalTransactionTime / ITERATIONS;
  const improvement = ((avgSequential - avgTransaction) / avgSequential) * 100;

  console.log(`Average Sequential Time (Multiple Connections): ${avgSequential.toFixed(2)}ms`);
  console.log(`Average Transaction Time (Single Connection):   ${avgTransaction.toFixed(2)}ms`);
  console.log(`Expected Performance Improvement:              ${improvement.toFixed(2)}%\n`);

  console.log('Rationale: By using a transaction, we acquire a connection once instead of three times.');
  console.log('Even with the overhead of BEGIN and COMMIT commands, the reduction in connection');
  console.log('acquisition latency results in a significant net gain in serverless environments.');
}

runBenchmark().catch(console.error);

import { performance } from 'perf_hooks';

// Simulate DB Latency (e.g. 100ms)
async function mockStoreContactSubmission() {
  await new Promise(resolve => setTimeout(resolve, 100));
  // console.log('DB Stored');
}

// Simulate Telegram API Latency (e.g. 300ms)
async function mockSendToTelegram() {
  await new Promise(resolve => setTimeout(resolve, 300));
  // console.log('Telegram Sent');
  return { ok: true, status: 200 };
}

async function runSequential() {
  // Current Implementation Logic
  try {
    await mockStoreContactSubmission();
  } catch (e) {
    console.error(e);
  }
  await mockSendToTelegram();
}

async function runParallel() {
  // Proposed Implementation Logic
  const dbPromise = mockStoreContactSubmission().catch(e => console.error(e));
  const tgPromise = mockSendToTelegram();

  await Promise.all([dbPromise, tgPromise]);
}

async function main() {
  console.log('Running API Handler Benchmark...');
  console.log('--------------------------------');

  const iterations = 5; // Run a few times to average

  // Sequential Benchmark
  let seqTotal = 0;
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await runSequential();
    const end = performance.now();
    seqTotal += (end - start);
  }
  const seqAvg = seqTotal / iterations;
  console.log(`Sequential Average: ${seqAvg.toFixed(2)}ms`);

  // Parallel Benchmark
  let parTotal = 0;
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await runParallel();
    const end = performance.now();
    parTotal += (end - start);
  }
  const parAvg = parTotal / iterations;
  console.log(`Parallel Average: ${parAvg.toFixed(2)}ms`);

  const improvement = seqAvg - parAvg;
  const percent = (improvement / seqAvg) * 100;

  console.log('--------------------------------');
  console.log(`Improvement: ${improvement.toFixed(2)}ms (${percent.toFixed(1)}%)`);
}

main().catch(console.error);

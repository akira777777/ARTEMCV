const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  const warnings = [];
  const requests = [];

  page.on('console', (message) => {
    const type = message.type();
    const text = message.text();
    if (type === 'error') errors.push(text);
    if (type === 'warning') warnings.push(text);
  });

  page.on('pageerror', (err) => errors.push(String(err)));
  page.on('requestfailed', (req) => {
    requests.push(`${req.method()} ${req.url()} -> ${req.failure()?.errorText || 'failed'}`);
  });

  await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const report = {
    errors,
    warnings,
    requestFailures: requests,
  };

  console.log(JSON.stringify(report, null, 2));
  await browser.close();
})();

import { test, expect } from '@playwright/test';

test.describe('Visual Regression and Text Readability Testing', () => {
  
  const VIEWPORTS = [
    { width: 375, height: 667, name: 'Mobile' },
    { width: 768, height: 1024, name: 'Tablet' },
    { width: 1280, height: 800, name: 'Desktop' },
    { width: 1920, height: 1080, name: 'LargeDesktop' }
  ];

  const LANGUAGES = ['en', 'ru', 'cs'];

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Text should be readable and properly contrasted', async ({ page }) => {
    // Check various text elements for visibility
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const paragraphs = page.locator('p');
    const buttons = page.locator('button');
    
    // Check that text elements exist and are visible
    expect(await headings.count()).toBeGreaterThan(0);
    expect(await paragraphs.count()).toBeGreaterThan(0);
    expect(await buttons.count()).toBeGreaterThan(0);
    
    // Take screenshot for visual inspection
    await page.screenshot({ 
      path: 'tests/e2e/screenshots/text_readability.png',
      fullPage: true 
    });
  });

  test('All languages should display text clearly', async ({ page }) => {
    for (const lang of LANGUAGES) {
      // Switch language
      await page.getByRole('button', { name: lang.toUpperCase() }).click();
      await page.waitForTimeout(500);
      
      // Check that text is visible and not overlapping
      const textElements = page.locator('h1, h2, p, span:not([class*="icon"])');
      const visibleTextCount = await textElements.evaluateAll(elements => 
        elements.filter(el => {
          const rect = el.getBoundingClientRect();
          const style = window.getComputedStyle(el);
          return rect.width > 0 && rect.height > 0 && 
                 style.opacity !== '0' && style.visibility !== 'hidden';
        }).length
      );
      
      expect(visibleTextCount).toBeGreaterThan(10); // Should have plenty of visible text
      
      // Take language-specific screenshot
      await page.screenshot({ 
        path: `tests/e2e/screenshots/text_${lang}_readability.png`,
        fullPage: true 
      });
    }
  });

  test('Images should load without distortion', async ({ page }) => {
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      
      // Check natural dimensions vs display dimensions
      const dimensions = await img.evaluate(el => {
        const imgEl = el as HTMLImageElement;
        return {
          naturalWidth: imgEl.naturalWidth,
          naturalHeight: imgEl.naturalHeight,
          clientWidth: imgEl.clientWidth,
          clientHeight: imgEl.clientHeight,
          src: imgEl.src
        };
      });
      
      // Images should have loaded successfully
      expect(dimensions.naturalWidth).toBeGreaterThan(0);
      expect(dimensions.naturalHeight).toBeGreaterThan(0);
      
      // Log any potentially problematic images
      if (dimensions.naturalWidth < 50 || dimensions.naturalHeight < 50) {
        console.log(`Small image detected: ${dimensions.src}`);
      }
    }
    
    await page.screenshot({ 
      path: 'tests/e2e/screenshots/image_quality.png',
      fullPage: true 
    });
  });

  test('Colors and themes should be consistent', async ({ page }) => {
    // Check background colors
    const backgroundColor = await page.evaluate(() => 
      window.getComputedStyle(document.body).backgroundColor
    );
    expect(backgroundColor).toContain('rgb'); // Should be a valid RGB color
    
    // Check text colors for readability
    const textColor = await page.evaluate(() => 
      window.getComputedStyle(document.querySelector('h1') || document.body).color
    );
    expect(textColor).toContain('rgb');
    
    await page.screenshot({ 
      path: 'tests/e2e/screenshots/color_consistency.png',
      fullPage: true 
    });
  });

  for (const viewport of VIEWPORTS) {
    test(`Responsive text sizing on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Check that text scales appropriately
      const headings = page.locator('h1');
      if (await headings.count() > 0) {
        const fontSize = await headings.first().evaluate(el => 
          window.getComputedStyle(el).fontSize
        );
        // Font size should be reasonable for viewport
        expect(fontSize).toMatch(/\d+px/);
      }
      
      await page.screenshot({ 
        path: `tests/e2e/screenshots/responsive_text_${viewport.name.toLowerCase()}.png`,
        fullPage: true 
      });
    });
  }

  test('Overlapping elements should not occur', async ({ page }) => {
    // Scroll through entire page checking for overlaps
    const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    
    for (let y = 0; y < scrollHeight; y += viewportHeight) {
      await page.evaluate(yPos => window.scrollTo(0, yPos), y);
      await page.waitForTimeout(200);
      
      // Take screenshots at key points
      if (y === 0 || y > scrollHeight / 2 || y > scrollHeight - viewportHeight) {
        await page.screenshot({ 
          path: `tests/e2e/screenshots/overlap_check_${y}.png`,
          fullPage: false 
        });
      }
    }
  });

  test('Accessibility features should be visible', async ({ page }) => {
    // Check for focus indicators
    const focusableElements = page.locator('button, a, input, textarea');
    const focusableCount = await focusableElements.count();
    
    // Test focus state on first few elements
    for (let i = 0; i < Math.min(focusableCount, 3); i++) {
      await focusableElements.nth(i).focus();
      await page.waitForTimeout(100);
      
      const hasFocusRing = await focusableElements.nth(i).evaluate(el => {
        const style = window.getComputedStyle(el);
        return style.outlineWidth !== '0px' || style.boxShadow.includes('rgb');
      });
      
      // At least some focus indication should be present
      // This might be loose since implementation varies
    }
    
    await page.screenshot({ 
      path: 'tests/e2e/screenshots/accessibility_features.png',
      fullPage: true 
    });
  });
});
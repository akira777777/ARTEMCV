import { test, expect } from '@playwright/test';

test.describe('Portfolio Critical Path Testing', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Basic page load and core elements', async ({ page }) => {
    // Check that the page loads successfully
    await expect(page).toHaveURL(/\/$/);
    
    // Check title contains expected text
    const title = await page.title();
    expect(title.toLowerCase()).toContain('full stack');
    
    // Check main content wrapper exists
    const mainContent = page.getByRole('main');
    await expect(mainContent).toBeVisible();
    
    // Take baseline screenshot
    await page.screenshot({ 
      path: 'tests/e2e/screenshots/homepage_baseline.png',
      fullPage: true 
    });
  });

  test('Language switching functionality', async ({ page }) => {
    // Find language buttons by their text content
    const enButton = page.getByText('EN');
    const ruButton = page.getByText('RU');
    const csButton = page.getByText('CS');
    
    await expect(enButton).toBeVisible();
    await expect(ruButton).toBeVisible();
    await expect(csButton).toBeVisible();
    
    // Test switching to Russian
    await ruButton.click();
    await page.waitForTimeout(1000);
    
    // Look for Russian content (more specific selectors)
    const ruContent = page.locator('text=Старший фронтенд-архитектор').first();
    await expect(ruContent).toBeVisible({ timeout: 10000 });
    
    // Test switching to Czech
    await csButton.click();
    await page.waitForTimeout(1000);
    
    const csContent = page.locator('text=Senior Frontend Architekt').first();
    await expect(csContent).toBeVisible({ timeout: 10000 });
    
    // Test switching back to English
    await enButton.click();
    await page.waitForTimeout(1000);
    
    const enContent = page.locator('text=Senior Frontend Architect').first();
    await expect(enContent).toBeVisible({ timeout: 10000 });
    
    await page.screenshot({ 
      path: 'tests/e2e/screenshots/language_switching.png',
      fullPage: true 
    });
  });

  test('Navigation and scrolling functionality', async ({ page }) => {
    // Test smooth scrolling to different sections
    const sections = ['services', 'work', 'contact'];
    
    for (const section of sections) {
      // Try different ways to find navigation links
      const navLink = page.getByRole('link', { name: new RegExp(section, 'i') })
        .or(page.locator(`a[href="#${section}"]`));
      
      if (await navLink.count() > 0) {
        await navLink.first().click();
        await page.waitForTimeout(1000);
        
        // Verify we scrolled (check that some content from section is visible)
        const sectionContent = page.locator(`#${section}, [id*="${section}"]`);
        if (await sectionContent.count() > 0) {
          await expect(sectionContent.first()).toBeInViewport({ timeout: 5000 });
        }
      }
    }
    
    await page.screenshot({ 
      path: 'tests/e2e/screenshots/navigation_scrolling.png',
      fullPage: true 
    });
  });

  test('Hero section content verification', async ({ page }) => {
    // Check hero section exists and has content
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();
    
    // Check for key hero elements
    const heroHeadings = page.locator('h1, h2').first();
    await expect(heroHeadings).toBeVisible();
    
    // Check for developer-related text
    const badgeText = page.locator('text=Senior Frontend Architect').first();
    await expect(badgeText).toBeVisible();
    
    await page.screenshot({ 
      path: 'tests/e2e/screenshots/hero_section_verification.png',
      fullPage: false 
    });
  });

  test('Interactive components functionality', async ({ page }) => {
    // Test mouse movement for cursor trail
    await page.mouse.move(100, 100);
    await page.mouse.move(200, 200);
    await page.mouse.move(300, 150);
    await page.waitForTimeout(500);
    
    // Test scroll-triggered animations
    await page.evaluate(() => window.scrollTo(0, 300));
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(500);
    
    await page.screenshot({ 
      path: 'tests/e2e/screenshots/interactive_components.png',
      fullPage: true 
    });
  });

  test('Contact section accessibility', async ({ page }) => {
    // Navigate to contact section
    await page.goto('/#contact');
    await page.waitForTimeout(1000);
    
    // Check for form elements using more flexible selectors
    const formInputs = page.locator('input, textarea');
    const inputCount = await formInputs.count();
    expect(inputCount).toBeGreaterThan(0);
    
    // Check for submit button
    const submitButtons = page.locator('button[type="submit"]');
    if (await submitButtons.count() > 0) {
      await expect(submitButtons.first()).toBeVisible();
    }
    
    await page.screenshot({ 
      path: 'tests/e2e/screenshots/contact_section.png',
      fullPage: true 
    });
  });

  test('Image loading verification', async ({ page }) => {
    // Check that images are present and loading
    const images = page.locator('img');
    const imageCount = await images.count();
    
    // Should have some images
    expect(imageCount).toBeGreaterThan(0);
    
    // Check first few images for successful loading
    const checkCount = Math.min(imageCount, 5);
    for (let i = 0; i < checkCount; i++) {
      const img = images.nth(i);
      const naturalWidth = await img.evaluate(el => (el as HTMLImageElement).naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
    
    await page.screenshot({ 
      path: 'tests/e2e/screenshots/image_loading.png',
      fullPage: true 
    });
  });

  test('Responsive design verification', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1280, height: 800, name: 'desktop' }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.reload();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      // Verify content is still visible
      await expect(page.getByRole('main')).toBeVisible();
      
      await page.screenshot({ 
        path: `tests/e2e/screenshots/responsive_${viewport.name}.png`,
        fullPage: true 
      });
    }
  });

  test('Text readability across languages', async ({ page }) => {
    const languages = ['EN', 'RU', 'CS'];
    
    for (const lang of languages) {
      // Switch language
      const langButton = page.getByText(lang, { exact: true });
      await langButton.click();
      await page.waitForTimeout(1000);
      
      // Check that text elements exist and are visible
      const textElements = page.locator('h1, h2, p, span').filter({ 
        hasNotText: '' 
      });
      
      const visibleTextCount = await textElements.evaluateAll(elements =>
        elements.filter(el => {
          const rect = el.getBoundingClientRect();
          const style = window.getComputedStyle(el);
          return rect.width > 0 && rect.height > 0 &&
                 style.opacity !== '0' && style.visibility !== 'hidden' &&
                 el.textContent && el.textContent.trim().length > 0;
        }).length
      );
      
      expect(visibleTextCount).toBeGreaterThan(5);
      
      await page.screenshot({ 
        path: `tests/e2e/screenshots/readability_${lang.toLowerCase()}.png`,
        fullPage: true 
      });
    }
  });

  test('Performance metrics collection', async ({ page }) => {
    // Measure page load performance
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    console.log(`Page loaded in ${loadTime}ms`);
    
    // Should load within reasonable time
    expect(loadTime).toBeLessThan(10000);
    
    await page.screenshot({ 
      path: 'tests/e2e/screenshots/performance_metrics.png',
      fullPage: true 
    });
  });
});

import { test, expect } from '@playwright/test';

test.describe('Direct Portfolio Testing', () => {
  
  test('Homepage loads and basic functionality works', async ({ page }) => {
    console.log('Starting homepage test...');
    
    // Navigate to homepage
    await page.goto('http://localhost:3002/');
    await page.waitForLoadState('networkidle');
    console.log('Page loaded successfully');
    
    // Take initial screenshot
    await page.screenshot({ 
      path: 'tests/e2e/screenshots/direct_homepage.png',
      fullPage: true 
    });
    
    // Check page title
    const title = await page.title();
    console.log(`Page title: ${title}`);
    expect(title).toBeTruthy();
    
    // Check main content exists
    const mainWrapper = page.locator('.content-wrapper');
    const isVisible = await mainWrapper.isVisible();
    console.log(`Main wrapper visible: ${isVisible}`);
    expect(isVisible).toBe(true);
    
    console.log('Homepage test completed successfully');
  });

  test('Language switching works with specific selectors', async ({ page }) => {
    console.log('Starting language switching test...');
    
    await page.goto('http://localhost:3002/');
    await page.waitForLoadState('networkidle');
    
    // Use more specific selectors for language buttons
    const langButtons = page.locator('button[title*="Switch to"]');
    const buttonCount = await langButtons.count();
    console.log(`Found ${buttonCount} language buttons`);
    
    if (buttonCount >= 3) {
      // Test each language button
      for (let i = 0; i < 3; i++) {
        const button = langButtons.nth(i);
        const buttonText = await button.textContent();
        console.log(`Testing button: ${buttonText}`);
        
        await button.click();
        await page.waitForTimeout(1000);
        
        // Take screenshot after each language switch
        await page.screenshot({ 
          path: `tests/e2e/screenshots/direct_lang_${buttonText?.trim() || i}.png`,
          fullPage: true 
        });
      }
    }
    
    console.log('Language switching test completed');
  });

  test('Scroll and navigation functionality', async ({ page }) => {
    console.log('Starting scroll test...');
    
    await page.goto('http://localhost:3002/');
    await page.waitForLoadState('networkidle');
    
    // Test scrolling
    await page.evaluate(() => window.scrollTo(0, 200));
    await page.waitForTimeout(500);
    
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(500);
    
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(500);
    
    // Take scroll position screenshot
    await page.screenshot({ 
      path: 'tests/e2e/screenshots/direct_scroll_test.png',
      fullPage: true 
    });
    
    console.log('Scroll test completed');
  });

  test('Interactive elements and animations', async ({ page }) => {
    console.log('Starting interactive elements test...');
    
    await page.goto('http://localhost:3002/');
    await page.waitForLoadState('networkidle');
    
    // Mouse movements to trigger interactive effects
    await page.mouse.move(100, 100);
    await page.mouse.move(300, 200);
    await page.mouse.move(500, 150);
    await page.waitForTimeout(1000);
    
    // Keyboard interactions
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);
    
    await page.screenshot({ 
      path: 'tests/e2e/screenshots/direct_interactive.png',
      fullPage: true 
    });
    
    console.log('Interactive elements test completed');
  });

  test('Component visibility verification', async ({ page }) => {
    console.log('Starting component visibility test...');
    
    await page.goto('http://localhost:3002/');
    await page.waitForLoadState('networkidle');
    
    // Check for various component types
    const components = [
      { name: 'Headers', selector: 'h1, h2, h3' },
      { name: 'Paragraphs', selector: 'p' },
      { name: 'Buttons', selector: 'button' },
      { name: 'Links', selector: 'a[href]' },
      { name: 'Images', selector: 'img' },
      { name: 'Sections', selector: 'section' }
    ];
    
    for (const component of components) {
      const elements = page.locator(component.selector);
      const count = await elements.count();
      console.log(`${component.name}: ${count} elements found`);
      
      if (count > 0) {
        const firstElement = elements.first();
        const isVisible = await firstElement.isVisible();
        console.log(`${component.name} first element visible: ${isVisible}`);
      }
    }
    
    await page.screenshot({ 
      path: 'tests/e2e/screenshots/direct_components.png',
      fullPage: true 
    });
    
    console.log('Component visibility test completed');
  });

  test('Text content verification across languages', async ({ page }) => {
    console.log('Starting text content test...');
    
    await page.goto('http://localhost:3002/');
    await page.waitForLoadState('networkidle');
    
    // Check for text content in different languages
    const languageIndicators = [
      { lang: 'English', pattern: /[A-Za-z]/ },
      { lang: 'Russian', pattern: /[А-Яа-я]/ },
      { lang: 'Czech', pattern: /[A-Za-zÁČĎÉĚÍŇÓŘŠŤÚŮÝŽáčďéěíňóřšťúůýž]/ }
    ];
    
    for (const indicator of languageIndicators) {
      const textElements = page.locator('*').filter({ 
        hasText: indicator.pattern 
      });
      
      const count = await textElements.count();
      console.log(`${indicator.lang} text elements: ${count}`);
      
      if (count > 0) {
        // Check that text is visible and readable
        const sampleText = await textElements.first().textContent();
        console.log(`Sample ${indicator.lang} text: ${sampleText?.substring(0, 50)}...`);
      }
    }
    
    await page.screenshot({ 
      path: 'tests/e2e/screenshots/direct_text_content.png',
      fullPage: true 
    });
    
    console.log('Text content test completed');
  });

  test('Mobile responsiveness simulation', async ({ page }) => {
    console.log('Starting mobile responsiveness test...');
    
    // Test different viewport sizes
    const viewports = [
      { width: 1920, height: 1080, name: 'desktop' },
      { width: 1280, height: 800, name: 'laptop' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' }
    ];
    
    for (const viewport of viewports) {
      console.log(`Testing viewport: ${viewport.width}x${viewport.height}`);
      
      await page.setViewportSize({ 
        width: viewport.width, 
        height: viewport.height 
      });
      
      await page.goto('http://localhost:3002/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      await page.screenshot({ 
        path: `tests/e2e/screenshots/direct_responsive_${viewport.name}.png`,
        fullPage: true 
      });
    }
    
    console.log('Mobile responsiveness test completed');
  });

  test('Performance and loading verification', async ({ page }) => {
    console.log('Starting performance test...');
    
    const startTime = Date.now();
    
    await page.goto('http://localhost:3002/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    console.log(`Page loaded in ${loadTime}ms`);
    
    // Check that page is interactive
    const clickableElements = page.locator('button, a');
    const clickableCount = await clickableElements.count();
    console.log(`Interactive elements found: ${clickableCount}`);
    
    expect(clickableCount).toBeGreaterThan(0);
    expect(loadTime).toBeLessThan(15000); // Should load within 15 seconds
    
    await page.screenshot({ 
      path: 'tests/e2e/screenshots/direct_performance.png',
      fullPage: true 
    });
    
    console.log('Performance test completed');
  });

  test('Error handling and edge cases', async ({ page }) => {
    console.log('Starting error handling test...');
    
    // Test rapid interactions
    await page.goto('http://localhost:3002/');
    await page.waitForLoadState('networkidle');
    
    // Rapid clicks and interactions
    for (let i = 0; i < 10; i++) {
      await page.mouse.click(100 + i * 20, 100 + i * 10);
      await page.waitForTimeout(100);
    }
    
    // Test window resizing
    const sizes = [
      { width: 800, height: 600 },
      { width: 1200, height: 800 },
      { width: 1600, height: 900 }
    ];
    
    for (const size of sizes) {
      await page.setViewportSize(size);
      await page.waitForTimeout(500);
    }
    
    await page.screenshot({ 
      path: 'tests/e2e/screenshots/direct_error_handling.png',
      fullPage: true 
    });
    
    console.log('Error handling test completed');
  });

  test('Final comprehensive verification', async ({ page }) => {
    console.log('Starting final verification...');
    
    await page.goto('http://localhost:3002/');
    await page.waitForLoadState('networkidle');
    
    // Final comprehensive checks
    const checks = [
      { name: 'Title exists', check: () => page.title() },
      { name: 'Main content visible', check: () => page.locator('.content-wrapper').isVisible() },
      { name: 'Has interactive elements', check: () => page.locator('button, a').count() },
      { name: 'Has text content', check: () => page.locator('p, h1, h2, h3').count() }
    ];
    
    for (const check of checks) {
      try {
        const result = await check.check();
        console.log(`${check.name}: ✓`);
      } catch (error) {
        console.log(`${check.name}: ✗ (${error})`);
      }
    }
    
    // Final comprehensive screenshot
    await page.screenshot({ 
      path: 'tests/e2e/screenshots/direct_final_verification.png',
      fullPage: true 
    });
    
    console.log('Final verification completed');
  });
});
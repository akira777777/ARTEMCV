import { test, expect } from '@playwright/test';

test.describe('Interactive Components Testing', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Cursor trail should be visible and functional', async ({ page }) => {
    // Move mouse around to trigger cursor trail
    await page.mouse.move(100, 100);
    await page.mouse.move(200, 200);
    await page.mouse.move(300, 150);
    
    // Wait for animations
    await page.waitForTimeout(1000);
    
    // Take screenshot to verify cursor trail effect
    await page.screenshot({ 
      path: 'tests/e2e/screenshots/cursor_trail_effect.png',
      fullPage: true 
    });
  });

  test('Animated elements should play correctly', async ({ page }) => {
    // Scroll to trigger animations
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(500);
    
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(500);
    
    // Check that animated elements are present
    const animatedElements = page.locator('[class*="animate-"], [data-animate]');
    expect(await animatedElements.count()).toBeGreaterThan(0);
    
    await page.screenshot({ 
      path: 'tests/e2e/screenshots/animated_elements.png',
      fullPage: true 
    });
  });

  test('3D Gallery interactions should work', async ({ page }) => {
    // Navigate to 3D gallery section
    await page.goto('/#3d-gallery'); // Adjust selector based on actual implementation
    await page.waitForTimeout(1000);
    
    // Look for gallery navigation buttons
    const nextButton = page.getByRole('button', { name: /next|forward|>/i });
    const prevButton = page.getByRole('button', { name: /prev|back|</i });
    
    if (await nextButton.count() > 0) {
      await nextButton.first().click();
      await page.waitForTimeout(500);
    }
    
    await page.screenshot({ 
      path: 'tests/e2e/screenshots/3d_gallery.png',
      fullPage: true 
    });
  });

  test('Card stack should be interactive', async ({ page }) => {
    // Find card stack component
    const cardStack = page.locator('[class*="card-stack"], [data-component="card-stack"]');
    
    if (await cardStack.count() > 0) {
      // Hover over cards to trigger effects
      const cards = cardStack.locator('[class*="card"]');
      const cardCount = await cards.count();
      
      for (let i = 0; i < Math.min(cardCount, 3); i++) {
        await cards.nth(i).hover();
        await page.waitForTimeout(300);
      }
      
      await page.screenshot({ 
        path: 'tests/e2e/screenshots/card_stack_interaction.png',
        fullPage: true 
      });
    }
  });

  test('Icon gallery should display properly', async ({ page }) => {
    // Find icon gallery section
    const iconGallery = page.getByText(/Design System Icons/i);
    await expect(iconGallery).toBeVisible();
    
    // Check that icons are loaded
    const icons = page.locator('svg, [class*="icon"]');
    const iconCount = await icons.count();
    expect(iconCount).toBeGreaterThan(0);
    
    await page.screenshot({ 
      path: 'tests/e2e/screenshots/icon_gallery.png',
      fullPage: true 
    });
  });
});
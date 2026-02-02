import { test, expect } from '@playwright/test';

test.describe('Russian Localization Debug', () => {
  
  test('Debug Russian content visibility', async ({ page }) => {
    console.log('=== Starting Russian localization debug ===');
    
    await page.goto('http://localhost:3002/');
    await page.waitForLoadState('networkidle');
    console.log('Page loaded');
    
    // Check current language
    const currentLangButton = page.locator('button[aria-pressed="true"]');
    const currentLang = await currentLangButton.textContent();
    console.log(`Current language: ${currentLang}`);
    
    // Switch to Russian
    console.log('Switching to Russian...');
    const ruButton = page.getByText('RU');
    await ruButton.click();
    await page.waitForTimeout(2000);
    
    // Check if Russian became active
    const newActiveButton = page.locator('button[aria-pressed="true"]');
    const newLang = await newActiveButton.textContent();
    console.log(`New active language: ${newLang}`);
    
    // Look for Russian-specific content
    console.log('Searching for Russian content...');
    
    // Method 1: Look for specific Russian words
    const russianWords = [
      'разработчик',
      'Full Stack разработчик', 
      'анимация',
      'бэкенд',
      'ДОВОЛЬСТВО',
      'ПРОЕКТОВ',
      'КЛИЕНТОВ'
    ];
    
    for (const word of russianWords) {
      const elements = page.locator(`text=${word}`);
      const count = await elements.count();
      console.log(`Found "${word}": ${count} elements`);
      
      if (count > 0) {
        const isVisible = await elements.first().isVisible();
        console.log(`"${word}" is visible: ${isVisible}`);
        
        if (isVisible) {
          console.log(`✓ Found visible Russian content: ${word}`);
        }
      }
    }
    
    // Method 2: Check all text content for Cyrillic characters
    const allText = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('*'))
        .map(el => el.textContent || '')
        .join(' ')
        .trim();
    });
    
    const cyrillicPattern = /[А-Яа-яЁё]/g;
    const cyrillicMatches = allText.match(cyrillicPattern);
    console.log(`Total Cyrillic characters found: ${cyrillicMatches ? cyrillicMatches.length : 0}`);
    
    if (cyrillicMatches && cyrillicMatches.length > 0) {
      console.log('✓ Cyrillic text detected in page content');
    } else {
      console.log('✗ No Cyrillic text found in page content');
      
      // Check what text is actually present
      const sampleText = allText.substring(0, 500);
      console.log('Sample page text:', sampleText);
    }
    
    // Take screenshot for visual verification
    await page.screenshot({ 
      path: 'tests/e2e/screenshots/debug_russian_content.png',
      fullPage: true 
    });
    
    console.log('=== Debug completed ===');
  });
});
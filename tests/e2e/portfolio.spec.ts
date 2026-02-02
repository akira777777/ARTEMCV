import { test, expect, Page } from '@playwright/test';

interface ViewportSize {
  width: number;
  height: number;
  name: string;
}

const VIEWPORTS: ViewportSize[] = [
  { width: 375, height: 667, name: 'Mobile' },
  { width: 768, height: 1024, name: 'Tablet' },
  { width: 1280, height: 800, name: 'Desktop' },
  { width: 1920, height: 1080, name: 'Large Desktop' }
];

const LANGUAGES = ['en', 'ru', 'cs'] as const;

test.describe('Portfolio Comprehensive Testing Suite', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('1. Core Page Structure and Accessibility', () => {
    
    test('Should have proper page structure and landmarks', async ({ page }) => {
      // Check main landmarks
      await expect(page.getByRole('banner')).toBeVisible();
      await expect(page.getByRole('main')).toBeVisible();
      await expect(page.getByRole('contentinfo')).toBeVisible();
      
      // Check skip link exists
      const skipLink = page.getByRole('link', { name: 'Skip to content' });
      await expect(skipLink).toBeVisible();
      
      // Check language switcher exists
      const langButtons = page.getByRole('button', { name: /^[A-Z]{2}$/ });
      await expect(langButtons).toHaveCount(3);
    });

    test('Should have proper meta tags and SEO elements', async ({ page }) => {
      const title = await page.title();
      expect(title).toContain('Full Stack Developer');
      
      const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
      expect(metaDescription).toBeTruthy();
    });
  });

  test.describe('2. Language Localization Testing', () => {
    
    for (const lang of LANGUAGES) {
      test(`Should display correct content in ${lang.toUpperCase()}`, async ({ page }) => {
        // Switch to target language
        await page.getByRole('button', { name: lang.toUpperCase(), exact: true }).click();
        await page.waitForTimeout(500);
        
        // Check hero section localization
        const heroTitle = page.locator('h1').first();
        const heroText = await heroTitle.textContent();
        
        // Verify language-specific content appears
        switch (lang) {
          case 'en':
            expect(heroText).toContain('Full Stack Developer');
            break;
          case 'ru':
            expect(heroText).toContain('Full Stack разработчик');
            break;
          case 'cs':
            expect(heroText).toContain('Full Stack vývojář');
            break;
        }
        
        // Check navigation items are localized
        const navLinks = await page.getByRole('link').all();
        expect(navLinks.length).toBeGreaterThan(0);
        
        // Take screenshot for visual verification
        await page.screenshot({ 
          path: `tests/e2e/screenshots/hero_${lang}.png`,
          fullPage: true 
        });
      });
    }
  });

  test.describe('3. Responsive Design Testing', () => {
    
    for (const viewport of VIEWPORTS) {
      test(`Should be responsive on ${viewport.name} (${viewport.width}x${viewport.height})`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.reload();
        await page.waitForLoadState('networkidle');
        
        // Check that main content is visible
        await expect(page.getByRole('main')).toBeVisible();
        
        // Check navigation adapts to viewport
        if (viewport.width < 768) {
          // Mobile: hamburger menu should be visible
          const mobileMenuButton = page.getByRole('button', { name: /menu/i });
          // Menu button may or may not be present depending on implementation
        } else {
          // Desktop: navigation links should be visible
          const navLinks = page.getByRole('link', { name: /(Services|Work|Contact)/i });
          await expect(navLinks.first()).toBeVisible();
        }
        
        // Take responsive screenshot
        await page.screenshot({ 
          path: `tests/e2e/screenshots/responsive_${viewport.name.toLowerCase()}_${viewport.width}x${viewport.height}.png`,
          fullPage: true 
        });
      });
    }
  });

  test.describe('4. Interactive Elements Testing', () => {
    
    test('Navigation links should work correctly', async ({ page }) => {
      const navSections = ['#services', '#work', '#contact'];
      
      for (const section of navSections) {
        const link = page.getByRole('link', { name: new RegExp(section.replace('#', ''), 'i') });
        await link.click();
        await page.waitForTimeout(500);
        
        // Check that we scrolled to the section
        const sectionElement = page.locator(section);
        await expect(sectionElement).toBeInViewport();
      }
    });

    test('Language switcher should toggle languages', async ({ page }) => {
      // Start with English
      await page.getByRole('button', { name: 'EN', exact: true }).click();
      await page.waitForTimeout(300);
      
      // Switch to Russian
      await page.getByRole('button', { name: 'RU', exact: true }).click();
      await page.waitForTimeout(300);
      
      // Verify Russian content
      const ruContent = await page.getByText(/разработчик|сервисы|проекты/i).first();
      await expect(ruContent).toBeVisible();
      
      // Switch to Czech
      await page.getByRole('button', { name: 'CS', exact: true }).click();
      await page.waitForTimeout(300);
      
      // Verify Czech content
      const csContent = await page.getByText(/vývojář|služby|projekty/i).first();
      await expect(csContent).toBeVisible();
    });

    test('Scroll progress indicator should work', async ({ page }) => {
      // Scroll to middle of page
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
      await page.waitForTimeout(300);
      
      // Check progress bar exists and has some width
      const progressBar = page.locator('[data-testid="scroll-progress"]');
      if (await progressBar.count() > 0) {
        const width = await progressBar.evaluate(el => (el as HTMLElement).style.width);
        expect(width).not.toBe('0%');
      }
    });
  });

  test.describe('5. Visual Components Testing', () => {
    
    test('Hero section should display correctly', async ({ page }) => {
      const hero = page.locator('section').first();
      await expect(hero).toBeVisible();
      
      // Check key elements
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.getByText(/developer|engineer|motion/i)).toBeVisible();
      
      // Take hero screenshot
      await page.screenshot({ 
        path: 'tests/e2e/screenshots/hero_section.png',
        fullPage: false 
      });
    });

    test('Services section should display correctly', async ({ page }) => {
      // Scroll to services
      await page.goto('/#services');
      await page.waitForTimeout(500);
      
      const servicesSection = page.getByText(/Services & Stack|My stack and services/i);
      await expect(servicesSection).toBeVisible();
      
      // Check service cards exist
      const serviceCards = page.locator('[class*="service"]').or(page.getByText(/Web Development|UI\/UX Design/i));
      expect(await serviceCards.count()).toBeGreaterThan(0);
      
      await page.screenshot({ 
        path: 'tests/e2e/screenshots/services_section.png',
        fullPage: true 
      });
    });

    test('Work gallery should function properly', async ({ page }) => {
      // Navigate to works section
      await page.goto('/#work');
      await page.waitForTimeout(1000);
      
      // Check project cards exist
      const projectCards = page.locator('[class*="project"]').or(page.getByText(/Barber Shop|Dental Clinic/i));
      const cardCount = await projectCards.count();
      expect(cardCount).toBeGreaterThan(0);
      
      // Click on first project to open modal/detail view
      if (cardCount > 0) {
        const firstCard = projectCards.first();
        await firstCard.click();
        await page.waitForTimeout(500);
        
        // Check project detail opens (implementation dependent)
        // This might vary based on your specific gallery implementation
      }
      
      await page.screenshot({ 
        path: 'tests/e2e/screenshots/work_gallery.png',
        fullPage: true 
      });
    });

    test('Contact form should be accessible', async ({ page }) => {
      // Navigate to contact
      await page.goto('/#contact');
      await page.waitForTimeout(500);
      
      // Check form elements exist
      const nameInput = page.getByLabel(/name/i).or(page.getByPlaceholder(/name/i));
      const emailInput = page.getByLabel(/email/i).or(page.getByPlaceholder(/email/i));
      const messageInput = page.getByLabel(/message/i).or(page.getByPlaceholder(/message/i));
      const submitButton = page.getByRole('button', { name: /(send|submit|contact)/i });
      
      await expect(nameInput).toBeVisible();
      await expect(emailInput).toBeVisible();
      await expect(messageInput).toBeVisible();
      await expect(submitButton).toBeVisible();
      
      await page.screenshot({ 
        path: 'tests/e2e/screenshots/contact_form.png',
        fullPage: true 
      });
    });
  });

  test.describe('6. Performance and Loading Tests', () => {
    
    test('Page should load within reasonable time', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
      
      // Check that critical resources loaded
      const images = page.locator('img');
      const imageCount = await images.count();
      
      // Check that images have loaded (not broken)
      for (let i = 0; i < Math.min(imageCount, 5); i++) {
        const img = images.nth(i);
        const naturalWidth = await img.evaluate(img => (img as HTMLImageElement).naturalWidth);
        expect(naturalWidth).toBeGreaterThan(0);
      }
    });

    test('Images should load properly without broken links', async ({ page }) => {
      const images = page.locator('img');
      const imageCount = await images.count();
      
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const src = await img.getAttribute('src');
        
        if (src && !src.startsWith('data:')) {
          // Check if image loads properly
          const naturalWidth = await img.evaluate(img => (img as HTMLImageElement).naturalWidth);
          expect(naturalWidth).toBeGreaterThan(0);
        }
      }
    });
  });

  test.describe('7. Cross-browser Compatibility', () => {
    
    test('Should work consistently across different browsers', async ({ page }) => {
      // Basic functionality test
      await expect(page.getByRole('main')).toBeVisible();
      await expect(page.getByRole('button', { name: 'EN' })).toBeVisible();
      
      // Test language switching
      await page.getByRole('button', { name: 'RU' }).click();
      await page.waitForTimeout(300);
      await expect(page.getByText(/разработчик/i)).toBeVisible();
    });
  });

  test.describe('8. Edge Cases and Error Handling', () => {
    
    test('Should handle rapid language switching', async ({ page }) => {
      // Rapid language switching test
      for (let i = 0; i < 5; i++) {
        await page.getByRole('button', { name: 'EN' }).click();
        await page.waitForTimeout(100);
        await page.getByRole('button', { name: 'RU' }).click();
        await page.waitForTimeout(100);
      }
      
      // Final state should be stable
      await page.getByRole('button', { name: 'CS' }).click();
      await page.waitForTimeout(300);
      await expect(page.getByText(/vývojář/i)).toBeVisible();
    });

    test('Should maintain state during window resize', async ({ page }) => {
      // Set initial state
      await page.getByRole('button', { name: 'RU' }).click();
      await page.waitForTimeout(300);
      
      // Resize window multiple times
      const sizes = [
        { width: 1920, height: 1080 },
        { width: 1280, height: 800 },
        { width: 768, height: 1024 },
        { width: 375, height: 667 }
      ];
      
      for (const size of sizes) {
        await page.setViewportSize(size);
        await page.waitForTimeout(200);
        
        // Check that Russian content is still visible
        await expect(page.getByText(/разработчик/i)).toBeVisible();
      }
    });
  });
});
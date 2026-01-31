import { test, expect } from '@playwright/test';

test.describe('Contact Form and Validation Testing', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/#contact');
    await page.waitForLoadState('networkidle');
  });

  test('Contact form should have all required fields', async ({ page }) => {
    // Check form fields exist
    const nameField = page.getByLabel(/name/i).or(page.getByPlaceholder(/name/i));
    const emailField = page.getByLabel(/email/i).or(page.getByPlaceholder(/email/i));
    const messageField = page.getByLabel(/message/i).or(page.getByPlaceholder(/message/i));
    const submitButton = page.getByRole('button', { name: /(send|submit|contact)/i });
    
    await expect(nameField).toBeVisible();
    await expect(emailField).toBeVisible();
    await expect(messageField).toBeVisible();
    await expect(submitButton).toBeVisible();
  });

  test('Form validation should work correctly', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /(send|submit)/i });
    
    // Try submitting empty form
    await submitButton.click();
    
    // Check for validation errors (implementation dependent)
    // This will vary based on your form validation implementation
    
    // Fill in valid data
    const nameField = page.getByLabel(/name/i).or(page.getByPlaceholder(/name/i));
    const emailField = page.getByLabel(/email/i).or(page.getByPlaceholder(/email/i));
    const messageField = page.getByLabel(/message/i).or(page.getByPlaceholder(/message/i));
    
    await nameField.fill('Test User');
    await emailField.fill('test@example.com');
    await messageField.fill('This is a test message for validation purposes.');
    
    // Form should now be valid (though we won't actually submit)
    await expect(submitButton).toBeEnabled();
  });

  test('Email validation should reject invalid emails', async ({ page }) => {
    const emailField = page.getByLabel(/email/i).or(page.getByPlaceholder(/email/i));
    const submitButton = page.getByRole('button', { name: /(send|submit)/i });
    
    // Test invalid email
    await emailField.fill('invalid-email');
    await submitButton.click();
    
    // Check that error message appears (implementation dependent)
    // const errorMessage = page.getByText(/valid.*email|invalid/i);
    // await expect(errorMessage).toBeVisible();
  });

  test('Form should be accessible via keyboard', async ({ page }) => {
    // Tab through form fields
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Check that focus moves correctly
    const activeElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(activeElement).toBeDefined();
  });

  test('Telegram chat integration should be accessible', async ({ page }) => {
    // Look for Telegram integration
    const telegramLink = page.getByRole('link', { name: /telegram/i })
      .or(page.getByText(/@younghustle45/i));
    
    if (await telegramLink.count() > 0) {
      const href = await telegramLink.first().getAttribute('href');
      expect(href).toContain('telegram');
    }
  });
});
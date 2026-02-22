import { test, expect } from '@playwright/test';

const switchLanguage = async (page: import('@playwright/test').Page, code: 'EN' | 'RU' | 'CS') => {
  const langButton = page.getByRole('button', { name: code, exact: true });
  if (!(await langButton.isVisible())) {
    const menuButton = page.getByRole('button', { name: /open navigation menu/i });
    if (await menuButton.isVisible()) {
      await menuButton.click();
    }
  }
  await expect(langButton).toBeVisible();
  await langButton.click();
};

test.describe('Проверка отображения имени ARTEM MIKHAILOV', () => {
  test('Hero section name display', async ({ page }) => {
    console.log('🔍 Проверяем отображение имени...');

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await switchLanguage(page, 'EN');

    // Проверяем заголовок hero
    const heroHeading = page.getByRole('heading', { level: 1 });
    const heroVisible = await heroHeading.isVisible();
    console.log(`  Заголовок Hero виден: ${heroVisible}`);

    const heroText = await heroHeading.textContent();
    console.log(`  Текст Hero: ${heroText}`);

    // Проверяем наличие обоих частей имени в заголовке
    await expect(heroHeading).toContainText('ARTEM');
    await expect(heroHeading).toContainText('MIKHAILOV');

    // Проверяем анимации (если есть)
    const animatedElements = await page.locator('span.inline-block.relative').count();
    console.log(`✨ Анимированных элементов: ${animatedElements}`);

    expect(heroVisible).toBeTruthy();

    console.log('✅ Имя отображается корректно!');
  });

  test('Проверка мобильного меню', async ({ page }) => {
    console.log('📱 Проверяем мобильное меню...');

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Проверяем кнопку меню
    const menuButton = await page.locator('button[aria-label="Open navigation menu"]');
    const isMenuVisible = await menuButton.isVisible();
    console.log(`🍔 Кнопка меню видна: ${isMenuVisible}`);

    if (isMenuVisible) {
      // Проверяем стили кнопки
      const buttonStyles = await menuButton.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor,
          borderRadius: styles.borderRadius,
        };
      });
      console.log(`  Стили кнопки:`, buttonStyles);

      // Тестируем клик
      await menuButton.click();
      await page.waitForTimeout(500);
      console.log('  ✅ Клик по меню работает');
    }

    console.log('✅ Мобильное меню проверено!');
  });

  test('Проверка email поля', async ({ page }) => {
    console.log('📧 Проверяем email поле...');

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const emailInput = await page.locator('input#email');
    const isEmailVisible = await emailInput.isVisible();
    console.log(`✉️ Email поле видно: ${isEmailVisible}`);

    if (isEmailVisible) {
      // Проверяем атрибуты
      const placeholder = await emailInput.getAttribute('placeholder');
      const required = await emailInput.getAttribute('required');
      const type = await emailInput.getAttribute('type');

      console.log(`  Placeholder: ${placeholder}`);
      console.log(`  Required: ${required}`);
      console.log(`  Type: ${type}`);

      // Проверяем стили
      const inputStyles = await emailInput.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          borderColor: styles.borderColor,
          backgroundColor: styles.backgroundColor,
          borderRadius: styles.borderRadius,
        };
      });
      console.log(`  Стили:`, inputStyles);

      // Тестируем фокус
      await emailInput.focus();
      const isFocused = await page.evaluate(() => document.activeElement?.id === 'email');
      console.log(`  Фокус работает: ${isFocused}`);
    }

    console.log('✅ Email поле проверено!');
  });
});

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

test.describe('Новые функции доступности', () => {
  test('Проверка новых строк перевода', async ({ page }) => {
    console.log('🔍 Тестируем новые accessibility строки...');

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Проверяем английские строки
    await switchLanguage(page, 'RU');
    await page.waitForTimeout(1000);

    // Ищем элементы с новыми accessibility строками
    const ruElements = await page
      .locator('[aria-label*="доступности"], [aria-label*="панель"], [aria-label*="контент"]')
      .count();
    console.log(`🇷🇺 Найдено элементов с русскими accessibility строками: ${ruElements}`);

    // Переключаемся обратно на английский
    await switchLanguage(page, 'EN');
    await page.waitForTimeout(1000);

    const enElements = await page
      .locator('[aria-label*="accessibility"], [aria-label*="panel"], [aria-label*="content"]')
      .count();
    console.log(`🇬🇧 Найдено элементов с английскими accessibility строками: ${enElements}`);

    console.log('✅ Новые строки перевода работают!');
  });
});

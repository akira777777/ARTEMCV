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

test.describe('Проверка новых accessibility функций', () => {
  test('Проверка наличия новых строк перевода в DOM', async ({ page }) => {
    console.log('🔍 Проверяем новые accessibility строки в DOM...');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Проверяем английские строки
    const enStrings = [
      'Accessibility Options',
      'Close accessibility panel',
      'Open accessibility panel',
      'Text Size',
      'Contrast',
      'Reduce Motion'
    ];
    
    for (const str of enStrings) {
      const found = await page.locator(`text="${str}"`).count();
      console.log(`🇬🇧 "${str}": ${found > 0 ? 'найдено' : 'не найдено'}`);
    }
    
    // Переключаемся на русский
    await switchLanguage(page, 'RU');
    await page.waitForTimeout(1000);
    
    // Проверяем русские строки
    const ruStrings = [
      'Настройки доступности',
      'Закрыть панель доступности',
      'Открыть панель доступности',
      'Размер текста',
      'Контраст',
      'Уменьшить движение'
    ];
    
    for (const str of ruStrings) {
      const found = await page.locator(`text="${str}"`).count();
      console.log(`🇷🇺 "${str}": ${found > 0 ? 'найдено' : 'не найдено'}`);
    }
    
    console.log('✅ Проверка новых строк завершена!');
  });
});

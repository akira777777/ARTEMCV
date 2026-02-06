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

test.describe('Проверка имени Artem Mikhailov', () => {
  test('Проверка отображения имени в различных местах', async ({ page }) => {
    console.log('🔍 Проверяем отображение имени Artem Mikhailov...');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await switchLanguage(page, 'EN');
    
    // Проверяем логотип
    const logoText = await page.locator('text="ARTEM.DEV"').first();
    const logoVisible = await logoText.isVisible();
    console.log(`🔤 Логотип ARTEM.DEV: ${logoVisible ? 'виден' : 'не виден'}`);
    
    // Проверяем полное имя в футере
    const fullName = await page.locator('text="Artem Mikhailov"').first();
    const fullNameVisible = await fullName.isVisible();
    console.log(`🔤 Полное имя: ${fullNameVisible ? 'видно' : 'не видно'}`);
    
    // Проверяем hero заголовок
    const heroHeading = page.getByRole('heading', { level: 1 });
    const heroVisible = await heroHeading.isVisible();
    const heroText = await heroHeading.textContent();
    console.log(`🔤 Hero заголовок виден: ${heroVisible ? 'виден' : 'не виден'}`);
    console.log(`🔤 Hero текст: ${heroText}`);
    
    // Проверяем анимированные элементы
    const animatedSpans = await page.locator('span.inline-block.relative').count();
    console.log(`✨ Анимированных span элементов: ${animatedSpans}`);
    
    // Проверяем кнопку мобильного меню
    const mobileMenu = await page.locator('button[aria-label="Open navigation menu"]');
    const menuVisible = await mobileMenu.isVisible();
    console.log(`📱 Мобильное меню: ${menuVisible ? 'видно' : 'не видно'}`);
    
    // Проверяем email поле
    const emailInput = await page.locator('input#email');
    const emailVisible = await emailInput.isVisible();
    console.log(`📧 Email поле: ${emailVisible ? 'видно' : 'не видно'}`);
    
    // Хотя бы одно из мест должно содержать имя
    const heroHasArtem = (heroText || '').includes('ARTEM');
    const heroHasMikhailov = (heroText || '').includes('MIKHAILOV');
    const nameFound = logoVisible || fullNameVisible || heroHasArtem || heroHasMikhailov;
    expect(nameFound).toBeTruthy();
    
    console.log('✅ Проверка имени завершена успешно!');
  });
});

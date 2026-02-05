import { test, expect } from '@playwright/test';

test.describe('Проверка имени Artem Mikhailov', () => {
  test('Проверка отображения имени в различных местах', async ({ page }) => {
    console.log('🔍 Проверяем отображение имени Artem Mikhailov...');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Проверяем логотип
    const logoText = await page.locator('text="ARTEM.DEV"').first();
    const logoVisible = await logoText.isVisible();
    console.log(`🔤 Логотип ARTEM.DEV: ${logoVisible ? 'виден' : 'не виден'}`);
    
    // Проверяем полное имя в футере
    const fullName = await page.locator('text="Artem Mikhailov"').first();
    const fullNameVisible = await fullName.isVisible();
    console.log(`🔤 Полное имя: ${fullNameVisible ? 'видно' : 'не видно'}`);
    
    // Проверяем hero заголовки (вторые вхождения)
    const heroArtem = await page.locator('text="ARTEM"').nth(1);
    const heroMikhailov = await page.locator('text="MIKHAILOV"').nth(1);
    const heroArtemVisible = await heroArtem.isVisible();
    const heroMikhailovVisible = await heroMikhailov.isVisible();
    
    console.log(`🔤 Hero ARTEM: ${heroArtemVisible ? 'виден' : 'не виден'}`);
    console.log(`🔤 Hero MIKHAILOV: ${heroMikhailovVisible ? 'виден' : 'не виден'}`);
    
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
    const nameFound = logoVisible || fullNameVisible || heroArtemVisible || heroMikhailovVisible;
    expect(nameFound).toBeTruthy();
    
    console.log('✅ Проверка имени завершена успешно!');
  });
});
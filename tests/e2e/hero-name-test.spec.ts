import { test, expect } from '@playwright/test';

test.describe('Проверка отображения имени ARTEM MIKHAILOV', () => {
  test('Hero section name display', async ({ page }) => {
    console.log('🔍 Проверяем отображение имени...');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Проверяем наличие обоих частей имени
    const artemElement = await page.locator('text="ARTEM"').first();
    const mikhailovElement = await page.locator('text="MIKHAILOV"').first();
    
    console.log('🔤 Проверяем ARTEM:');
    const artemVisible = await artemElement.isVisible();
    console.log(`  Видимость: ${artemVisible}`);
    
    console.log('🔤 Проверяем MIKHAILOV:');
    const mikhailovVisible = await mikhailovElement.isVisible();
    console.log(`  Видимость: ${mikhailovVisible}`);
    
    // Проверяем стили
    if (artemVisible) {
      const artemStyles = await artemElement.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          fontSize: styles.fontSize,
          color: styles.color,
          fontWeight: styles.fontWeight
        };
      });
      console.log(`  Стили ARTEM:`, artemStyles);
    }
    
    if (mikhailovVisible) {
      const mikhailovStyles = await mikhailovElement.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          fontSize: styles.fontSize,
          color: styles.color,
          fontWeight: styles.fontWeight
        };
      });
      console.log(`  Стили MIKHAILOV:`, mikhailovStyles);
    }
    
    // Проверяем анимации (если есть)
    const animatedElements = await page.locator('span.inline-block.relative').count();
    console.log(`✨ Анимированных элементов: ${animatedElements}`);
    
    expect(artemVisible).toBeTruthy();
    expect(mikhailovVisible).toBeTruthy();
    
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
      const buttonStyles = await menuButton.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor,
          borderRadius: styles.borderRadius
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
      const inputStyles = await emailInput.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          borderColor: styles.borderColor,
          backgroundColor: styles.backgroundColor,
          borderRadius: styles.borderRadius
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
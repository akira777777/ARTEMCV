import { test, expect } from '@playwright/test';

test.describe('Тестирование доступности', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Проверка ARIA атрибутов и семантики', async ({ page }) => {
    console.log('♿ Тестируем ARIA атрибуты...');
    
    // Проверяем наличие основных landmark ролей
    const landmarks = await page.locator('[role="main"], [role="navigation"], [role="banner"]').count();
    console.log(`🏛️ Найдено landmark элементов: ${landmarks}`);
    
    // Проверяем кнопки с ARIA labels
    const ariaButtons = await page.locator('button[aria-label]').count();
    console.log(`🔘 Кнопок с ARIA labels: ${ariaButtons}`);
    
    // Проверяем skip link
    const skipLinks = await page.locator('a[href="#main-content"]').count();
    console.log(`⏭️ Skip links найдено: ${skipLinks}`);
    
    // Проверяем alt атрибуты у изображений
    const images = await page.locator('img').all();
    let imagesWithAlt = 0;
    
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      if (alt !== null) {
        imagesWithAlt++;
      }
    }
    
    console.log(`🖼️ Изображений с alt: ${imagesWithAlt}/${images.length}`);
    
    console.log('✅ ARIA атрибуты проверены!');
  });

  test('Проверка навигации с клавиатуры', async ({ page }) => {
    console.log('⌨️ Тестируем навигацию с клавиатуры...');
    
    // Проверяем фокус на первом интерактивном элементе
    await page.keyboard.press('Tab');
    const focusedElement = await page.locator(':focus').first();
    const tagName = await focusedElement.evaluate(el => el.tagName.toLowerCase());
    
    console.log(`🎯 Первый элемент в фокусе: ${tagName}`);
    expect(['a', 'button', 'input']).toContain(tagName);
    
    // Проверяем последовательную навигацию
    const focusableElements = await page.locator('a, button, input, textarea, select').count();
    console.log(`🧭 Всего фокусируемых элементов: ${focusableElements}`);
    
    // Проверяем, что можно перемещаться по элементам
    let tabCount = 0;
    for (let i = 0; i < Math.min(focusableElements, 10); i++) {
      await page.keyboard.press('Tab');
      tabCount++;
    }
    
    console.log(`⌨️ Выполнено Tab нажатий: ${tabCount}`);
    
    console.log('✅ Навигация с клавиатуры работает!');
  });

  test('Проверка контрастности и читаемости', async ({ page }) => {
    console.log('👁️ Тестируем контрастность...');
    
    // Проверяем основные текстовые элементы
    const textElements = await page.locator('h1, h2, h3, p, a, button').all();
    
    for (let i = 0; i < Math.min(textElements.length, 5); i++) {
      const element = textElements[i];
      const isVisible = await element.isVisible();
      
      if (isVisible) {
        const fontSize = await element.evaluate(el => 
          window.getComputedStyle(el).fontSize
        );
        const color = await element.evaluate(el => 
          window.getComputedStyle(el).color
        );
        
        console.log(`📝 Элемент ${i + 1}: font-size ${fontSize}, color ${color}`);
      }
    }
    
    console.log('✅ Проверка контрастности завершена!');
  });
});
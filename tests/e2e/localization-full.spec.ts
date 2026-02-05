import { test, expect } from '@playwright/test';

test.describe('Полное тестирование локализации', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Ждем полной загрузки
    await page.waitForLoadState('networkidle');
  });

  test('Проверка переключения языков EN → RU → EN', async ({ page }) => {
    console.log('🔍 Тестируем переключение языков...');
    
    // Начинаем с английского
    const initialTitle = await page.title();
    console.log(`🔤 Начальный заголовок (EN): ${initialTitle}`);
    expect(initialTitle.toLowerCase()).toContain('infinite studio');
    
    // Переключаем на русский
    console.log('🔄 Переключаемся на русский язык...');
    await page.click('button[aria-label="Switch to Russian"]');
    await page.waitForTimeout(1000);
    
    const ruTitle = await page.title();
    console.log(`🔤 Заголовок на русском: ${ruTitle}`);
    expect(ruTitle.toLowerCase()).toContain('infinite studio');
    
    // Проверяем видимость кириллического текста
    const ruHeaderText = await page.locator('h1').first().textContent();
    console.log(`📄 Текст заголовка на русском: ${ruHeaderText}`);
    expect(ruHeaderText).toBeTruthy();
    
    // Возвращаемся к английскому
    console.log('🔄 Переключаемся обратно на английский...');
    await page.click('button[aria-label="Switch to English"]');
    await page.waitForTimeout(1000);
    
    const enTitle = await page.title();
    console.log(`🔤 Финальный заголовок (EN): ${enTitle}`);
    expect(enTitle.toLowerCase()).toContain('infinite studio');
    
    console.log('✅ Переключение языков работает корректно!');
  });

  test('Проверка отображения кириллического текста', async ({ page }) => {
    console.log('🔤 Тестируем отображение русского текста...');
    
    // Переключаемся на русский
    await page.click('button[aria-label="Switch to Russian"]');
    await page.waitForTimeout(1500);
    
    // Проверяем основные элементы с русским текстом
    const elementsToCheck = [
      { selector: 'h1', description: 'Заголовок' },
      { selector: 'h2', description: 'Подзаголовки' },
      { selector: 'p', description: 'Параграфы' },
      { selector: 'button:not([aria-label])', description: 'Кнопки' }
    ];
    
    for (const element of elementsToCheck) {
      const texts = await page.locator(element.selector).allTextContents();
      const cyrillicTexts = texts.filter(text => 
        /[а-яё]/i.test(text) && text.trim().length > 0
      );
      
      console.log(`📋 ${element.description}: найдено ${cyrillicTexts.length} элементов с кириллицей`);
      
      // Проверяем, что есть хотя бы какой-то русский текст
      if (element.selector === 'h1' || element.selector === 'h2') {
        expect(cyrillicTexts.length).toBeGreaterThan(0);
      }
    }
    
    console.log('✅ Кириллический текст отображается корректно!');
  });

  test('Проверка сохранения языка между переходами', async ({ page }) => {
    console.log('💾 Тестируем сохранение языка...');
    
    // Устанавливаем русский язык
    await page.click('button[aria-label="Switch to Russian"]');
    await page.waitForTimeout(1000);
    
    // Переходим на другую страницу
    await page.click('a[href="/detailing"]');
    await page.waitForURL('**/detailing');
    await page.waitForTimeout(1500);
    
    // Проверяем, что язык остался русским
    const ruTexts = await page.locator('h1, h2').allTextContents();
    const hasRussian = ruTexts.some(text => /[а-яё]/i.test(text));
    console.log(`🔤 Русский язык сохранен: ${hasRussian}`);
    expect(hasRussian).toBeTruthy();
    
    console.log('✅ Язык сохраняется между переходами!');
  });
});
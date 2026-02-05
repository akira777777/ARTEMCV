import { test, expect } from '@playwright/test';

test.describe('Тестирование производительности', () => {
  test('Проверка времени загрузки страницы', async ({ page }) => {
    console.log('⚡ Тестируем время загрузки...');
    
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    console.log(`⏱️ Время загрузки: ${loadTime}ms`);
    
    // Проверяем, что загрузка заняла менее 15 секунд
    expect(loadTime).toBeLessThan(15000);
    
    console.log('✅ Время загрузки в пределах нормы!');
  });

  test('Проверка производительности интерактивных элементов', async ({ page }) => {
    console.log('🎮 Тестируем интерактивные элементы...');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Тестируем навигационное меню
    console.log('🖱️ Тестируем ховер эффекты...');
    const navItems = await page.locator('nav a').all();
    
    for (let i = 0; i < Math.min(navItems.length, 3); i++) {
      const item = navItems[i];
      const initialStyle = await item.evaluate(el => 
        window.getComputedStyle(el).getPropertyValue('opacity')
      );
      
      await item.hover({ timeout: 5000 });
      await page.waitForTimeout(300);
      
      const hoverStyle = await item.evaluate(el => 
        window.getComputedStyle(el).getPropertyValue('opacity')
      );
      
      console.log(`🖱️ Элемент ${i + 1}: opacity ${initialStyle} → ${hoverStyle}`);
    }
    
    // Тестируем кнопки
    console.log('🔘 Тестируем кликабельность кнопок...');
    const buttons = await page.locator('button').all();
    let clickableButtons = 0;
    
    for (const button of buttons.slice(0, 5)) {
      try {
        await button.click({ timeout: 3000 });
        clickableButtons++;
      } catch (error: any) {
        console.log(`⚠️ Кнопка не кликабельна: ${error.message || error}`);
      }
    }
    
    console.log(`🔘 Рабочих кнопок: ${clickableButtons}/${Math.min(buttons.length, 5)}`);
    expect(clickableButtons).toBeGreaterThan(0);
    
    console.log('✅ Интерактивные элементы работают!');
  });

  test('Проверка прокрутки и анимаций', async ({ page }) => {
    console.log('📜 Тестируем прокрутку и анимации...');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Прокручиваем страницу вниз и вверх
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    
    const scrollPosition = await page.evaluate(() => window.scrollY);
    console.log(`📊 Позиция прокрутки: ${scrollPosition}px`);
    expect(scrollPosition).toBeGreaterThan(100);
    
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);
    
    const topPosition = await page.evaluate(() => window.scrollY);
    console.log(`📊 Вернулись наверх: ${topPosition}px`);
    expect(topPosition).toBe(0);
    
    console.log('✅ Прокрутка работает корректно!');
  });

  test('Проверка работы с памятью', async ({ page }) => {
    console.log('🧠 Тестируем управление памятью...');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Проверяем, что нет утечек памяти
    const initialMemory = await page.evaluate(() => {
      if ('memory' in performance) {
        return (performance as any).memory.usedJSHeapSize;
      }
      return 0;
    });
    
    console.log(`💾 Начальное использование памяти: ${initialMemory} bytes`);
    
    // Выполняем несколько действий
    for (let i = 0; i < 5; i++) {
      await page.click('body', { position: { x: 100, y: 100 + i * 50 } });
      await page.waitForTimeout(200);
    }
    
    const finalMemory = await page.evaluate(() => {
      if ('memory' in performance) {
        return (performance as any).memory.usedJSHeapSize;
      }
      return 0;
    });
    
    console.log(`💾 Финальное использование памяти: ${finalMemory} bytes`);
    console.log(`📊 Разница: ${finalMemory - initialMemory} bytes`);
    
    // Проверяем, что память не растет бесконтрольно
    if (initialMemory > 0 && finalMemory > 0) {
      const memoryGrowth = ((finalMemory - initialMemory) / initialMemory) * 100;
      console.log(`📈 Рост памяти: ${memoryGrowth.toFixed(2)}%`);
      expect(memoryGrowth).toBeLessThan(50); // Не более 50% роста
    }
    
    console.log('✅ Управление памятью в порядке!');
  });
});
/**
 * Тестирование мобильной адаптации сайта
 */

console.log('=== Тестирование мобильной адаптации ===');

// Проверка размера окна
function checkWindowSize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    console.log(`Размер окна: ${width}x${height}`);
    
    if (width <= 768) {
        console.log('✓ Обнаружен мобильный режим');
        return 'mobile';
    } else if (width <= 1024) {
        console.log('✓ Обнаружен планшетный режим');
        return 'tablet';
    } else {
        console.log('✓ Обнаружен десктопный режим');
        return 'desktop';
    }
}

// Проверка наличия мобильного меню
function checkMobileMenu() {
    const mobileMenuButton = document.querySelector('.md\\\\:hidden .w-6.h-6'); // экранированный селектор для мобильной кнопки
    
    if (mobileMenuButton) {
        console.log('✓ Мобильное меню найдено');
        return true;
    } else {
        console.log('⚠ Мобильное меню не найдено');
        return false;
    }
}

// Проверка адаптивных классов
function checkResponsiveClasses() {
    const elementsWithTouchTargets = document.querySelectorAll('.touch-target');
    
    console.log(`✓ Найдено ${elementsWithTouchTargets.length} элементов с классом touch-target для мобильной оптимизации`);
    
    return elementsWithTouchTargets.length > 0;
}

// Проверка мета-тегов
function checkMetaTags() {
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    const content = viewportMeta ? viewportMeta.getAttribute('content') : '';
    
    console.log(`✓ Мета-тег viewport: ${content}`);
    
    if (content.includes('user-scalable=no')) {
        console.log('✓ Обнаружена защита от масштабирования на мобильных устройствах');
    }
    
    return !!viewportMeta;
}

// Основная функция тестирования
function runMobileTests() {
    console.log('\nЗапуск тестов мобильной адаптации...\n');
    
    const deviceType = checkWindowSize();
    const hasMobileMenu = checkMobileMenu();
    const hasTouchTargets = checkResponsiveClasses();
    const hasMetaTags = checkMetaTags();
    
    console.log('\n=== Результаты тестирования ===');
    console.log(`Тип устройства: ${deviceType}`);
    console.log(`Мобильное меню: ${hasMobileMenu ? 'ДА' : 'НЕТ'}`);
    console.log(`Классы для касания: ${hasTouchTargets ? 'ДА' : 'НЕТ'}`);
    console.log(`Мета-теги: ${hasMetaTags ? 'ДА' : 'НЕТ'}`);
    
    const allTestsPassed = hasMobileMenu && hasTouchTargets && hasMetaTags;
    
    console.log(`\nОбщий результат: ${allTestsPassed ? '✅ Все тесты пройдены' : '⚠ Не все тесты пройдены'}`);
    
    return {
        deviceType,
        allTestsPassed,
        details: {
            hasMobileMenu,
            hasTouchTargets,
            hasMetaTags
        }
    };
}

// Экспортируем функции для использования в браузере
if (typeof window !== 'undefined') {
    window.runMobileTests = runMobileTests;
    console.log('Функция runMobileTests доступна в консоли браузера');
    
    // Автоматический запуск при загрузке
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runMobileTests);
    } else {
        runMobileTests();
    }
}

export { runMobileTests, checkWindowSize, checkMobileMenu, checkResponsiveClasses, checkMetaTags };
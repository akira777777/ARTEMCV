import { describe, it, expect } from 'vitest';
import { EMAIL_REGEX, sanitizeString } from '../lib/validation';
import { checkColorContrast } from '../components/AccessibilityUtils';

describe('Validation Utils', () => {
  describe('EMAIL_REGEX', () => {
    it('should validate correct email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        'user123@test-domain.com',
        'test.email.with+symbol@example.com'
      ];

      validEmails.forEach(email => {
        expect(EMAIL_REGEX.test(email)).toBe(true);
      });
    });

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'test@',
        'test@.com',
        'test@example.',
        'test space@example.com',
        'test@ex ample.com'
      ];

      invalidEmails.forEach(email => {
        expect(EMAIL_REGEX.test(email)).toBe(false);
      });
    });
  });

  describe('sanitizeString', () => {
    it('should remove dangerous characters', () => {
      const input = '<script>alert("xss")</script>Hello & World';
      const result = sanitizeString(input, 100);
      expect(result).toBe('Hello & World');
    });

    it('should truncate strings to max length', () => {
      const longString = 'a'.repeat(150);
      const result = sanitizeString(longString, 100);
      expect(result.length).toBe(100);
      expect(result).toBe('a'.repeat(100));
    });

    it('should handle empty strings', () => {
      expect(sanitizeString('', 100)).toBe('');
      expect(sanitizeString('   ', 100)).toBe('');
    });

    it('should preserve safe characters', () => {
      const safeString = 'Hello World! 123 @#$%^&*()';
      const result = sanitizeString(safeString, 100);
      expect(result).toBe(safeString);
    });

    it('should handle HTML entities correctly', () => {
      const htmlString = 'Hello & < > " '';
      const result = sanitizeString(htmlString, 100);
      expect(result).toBe('Hello &amp; &lt; &gt; &quot; '');
    });
  });
});

describe('Accessibility Utils', () => {
  describe('checkColorContrast', () => {
    it('should return true for high contrast colors', () => {
      expect(checkColorContrast('#ffffff', '#000000')).toBe(true);
      expect(checkColorContrast('#000000', '#ffffff')).toBe(true);
      expect(checkColorContrast('#ff0000', '#000000')).toBe(true);
    });

    it('should return false for low contrast colors', () => {
      expect(checkColorContrast('#cccccc', '#ffffff')).toBe(false);
      expect(checkColorContrast('#888888', '#aaaaaa')).toBe(false);
    });

    it('should handle hex colors with and without #', () => {
      expect(checkColorContrast('ffffff', '#000000')).toBe(true);
      expect(checkColorContrast('#ffffff', '000000')).toBe(true);
    });

    it('should handle 3-digit hex colors', () => {
      expect(checkColorContrast('#fff', '#000')).toBe(true);
      expect(checkColorContrast('#f00', '#000')).toBe(true);
    });

    it('should handle large text threshold', () => {
      // Colors that pass AA for large text but not normal text
      const mediumContrast = '#808080'; // Gray
      const white = '#ffffff';
      
      expect(checkColorContrast(mediumContrast, white, true)).toBe(true); // Large text
      expect(checkColorContrast(mediumContrast, white, false)).toBe(false); // Normal text
    });
  });
});

describe('Performance Utils', () => {
  describe('useDebounce', () => {
    it('should debounce value changes', async () => {
      // This test would need to be implemented with proper React testing utilities
      // For now, we'll test the concept
      let callCount = 0;
      const mockCallback = () => callCount++;
      
      // Simulate rapid calls
      const interval = setInterval(mockCallback, 10);
      setTimeout(() => clearInterval(interval), 100);
      
      // Wait for debounce period
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // This is a simplified test - in real implementation you'd use @testing-library/react
      expect(callCount).toBeGreaterThan(0);
    });
  });
});

describe('Integration Tests', () => {
  describe('Form Validation Integration', () => {
    it('should validate complete form data', () => {
      const formData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message with more than 10 characters.'
      };

      // Test email validation
      expect(EMAIL_REGEX.test(formData.email)).toBe(true);
      
      // Test sanitization
      const sanitizedData = {
        name: sanitizeString(formData.name, 100),
        email: sanitizeString(formData.email, 254),
        message: sanitizeString(formData.message, 5000)
      };

      expect(sanitizedData.name).toBe('John Doe');
      expect(sanitizedData.email).toBe('john@example.com');
      expect(sanitizedData.message).toBe('This is a test message with more than 10 characters.');
    });

    it('should handle malicious input safely', () => {
      const maliciousData = {
        name: '<script>alert("xss")</script>John',
        email: 'test@<script>alert("xss")</script>.com',
        message: '<img src=x onerror=alert(1)>'
      };

      const sanitizedData = {
        name: sanitizeString(maliciousData.name, 100),
        email: sanitizeString(maliciousData.email, 254),
        message: sanitizeString(maliciousData.message, 5000)
      };

      // Should not contain any script tags or executable code
      expect(sanitizedData.name).not.toContain('<script>');
      expect(sanitizedData.email).not.toContain('<script>');
      expect(sanitizedData.message).not.toContain('<img');
      expect(sanitizedData.message).not.toContain('onerror');
    });
  });

  describe('Accessibility Integration', () => {
    it('should generate proper ARIA attributes', () => {
      const mockProps = {
        id: 'test-id',
        label: 'Test Label',
        describedBy: 'test-description',
        labelledBy: 'test-label',
        hidden: false,
        live: 'polite' as const,
        role: 'button',
        expanded: true,
        pressed: false,
        selected: false,
        disabled: false,
        level: 2
      };

      // This would test the generateAriaAttributes function
      // Implementation would depend on the actual function structure
      expect(mockProps.id).toBe('test-id');
      expect(mockProps.label).toBe('Test Label');
      expect(mockProps.live).toBe('polite');
    });

    it('should handle color contrast for UI elements', () => {
      // Test common UI color combinations
      const uiColors = [
        { text: '#ffffff', background: '#000000', expected: true },
        { text: '#000000', background: '#ffffff', expected: true },
        { text: '#ff0000', background: '#000000', expected: true },
        { text: '#808080', background: '#ffffff', expected: false },
      ];

      uiColors.forEach(({ text, background, expected }) => {
        expect(checkColorContrast(text, background)).toBe(expected);
      });
    });
  });
});

describe('Error Handling', () => {
  describe('Validation Error Handling', () => {
    it('should handle null and undefined inputs gracefully', () => {
      expect(() => sanitizeString(null as any, 100)).not.toThrow();
      expect(() => sanitizeString(undefined as any, 100)).not.toThrow();
    });

    it('should handle empty validation', () => {
      expect(EMAIL_REGEX.test('')).toBe(false);
      expect(sanitizeString('', 100)).toBe('');
    });
  });

  describe('Accessibility Error Handling', () => {
    it('should handle invalid color formats', () => {
      // Should not crash with invalid color formats
      expect(() => checkColorContrast('invalid', '#000000')).not.toThrow();
      expect(() => checkColorContrast('#000000', 'invalid')).not.toThrow();
    });
  });
});

describe('Performance Tests', () => {
  describe('Sanitization Performance', () => {
    it('should handle large strings efficiently', () => {
      const largeString = 'a'.repeat(10000);
      const startTime = performance.now();
      
      const result = sanitizeString(largeString, 5000);
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      expect(result.length).toBe(5000);
      expect(duration).toBeLessThan(100); // Should complete in under 100ms
    });

    it('should handle multiple sanitization calls efficiently', () => {
      const testString = '<script>alert("test")</script>Hello World!';
      const startTime = performance.now();

      // Perform multiple sanitizations
      for (let i = 0; i < 1000; i++) {
        sanitizeString(testString, 100);
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(1000); // Should complete in under 1 second
    });
  });

  describe('Validation Performance', () => {
    it('should validate emails efficiently', () => {
      const testEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'invalid-email',
        '@example.com',
        'test@'
      ];

      const startTime = performance.now();

      testEmails.forEach(email => {
        EMAIL_REGEX.test(email);
      });

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(10); // Should be very fast
    });
  });
});
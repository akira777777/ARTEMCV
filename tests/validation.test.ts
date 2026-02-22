import { describe, it, expect } from 'vitest';
import * as validation from '../lib/validation';

describe('Validation Utilities', () => {
  describe('isLength', () => {
    const { isLength } = validation;

    it('should return valid: true for strings within bounds', () => {
      expect(isLength('hello', 3, 10)).toEqual({ valid: true });
      expect(isLength('test', 2, 5)).toEqual({ valid: true });
    });

    it('should return valid: true for strings at boundary (min)', () => {
      expect(isLength('abc', 3, 10)).toEqual({ valid: true });
    });

    it('should return valid: true for strings at boundary (max)', () => {
      expect(isLength('abcdefghij', 3, 10)).toEqual({ valid: true });
    });

    it('should return valid: false for strings below min length', () => {
      const result = isLength('ab', 3, 10, 'Name');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Name must be at least 3 characters');
    });

    it('should return valid: false for strings above max length', () => {
      const result = isLength('abcdefghijk', 3, 10, 'Name');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Name must be no more than 10 characters');
    });

    it('should trim strings before checking length', () => {
      expect(isLength('  abc  ', 3, 10)).toEqual({ valid: true });
      expect(isLength('  a  ', 3, 10).valid).toBe(false);
    });

    it('should use default field name if not provided', () => {
      const result = isLength('a', 3, 10);
      expect(result.error).toBe('Field must be at least 3 characters');
    });

    it('should handle non-string inputs', () => {
      // @ts-expect-error - testing invalid input
      const result = isLength(123, 3, 10, 'Number');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Number must be a string');
    });
  });

  describe('isRequired', () => {
    const { isRequired } = validation;

    it('should return valid: true for non-empty strings', () => {
      expect(isRequired('hello')).toEqual({ valid: true });
      expect(isRequired(' ')).toEqual({ valid: true }); // Space is technically non-empty if not trimmed
    });

    it('should return valid: false for empty strings', () => {
      expect(isRequired('')).toEqual({ valid: false, error: 'This field is required' });
    });

    it('should return valid: false for null or undefined', () => {
      expect(isRequired(null)).toEqual({ valid: false, error: 'This field is required' });
      expect(isRequired(undefined)).toEqual({ valid: false, error: 'This field is required' });
    });
  });

  describe('isEmail', () => {
    const { isEmail } = validation;

    it('should return valid: true for valid email addresses', () => {
      expect(isEmail('test@example.com')).toEqual({ valid: true });
      expect(isEmail('USER@domain.co.uk')).toEqual({ valid: true });
    });

    it('should return valid: false for invalid email addresses', () => {
      expect(isEmail('invalid-email').valid).toBe(false);
      expect(isEmail('test@').valid).toBe(false);
      expect(isEmail('@example.com').valid).toBe(false);
    });

    it('should return valid: false for too long emails', () => {
      const longEmail = 'a'.repeat(246) + '@test.com'; // > 254 chars
      expect(isEmail(longEmail).valid).toBe(false);
      expect(isEmail(longEmail).error).toBe('Email is too long');
    });

    it('should handle empty or non-string inputs', () => {
      // @ts-expect-error - testing invalid input
      expect(isEmail('').valid).toBe(false);
      // @ts-expect-error - testing invalid input
      expect(isEmail(null).valid).toBe(false);
    });
  });

  describe('isPhoneNumber', () => {
    const { isPhoneNumber } = validation;

    it('should return valid: true for valid phone numbers', () => {
      expect(isPhoneNumber('+1234567890')).toEqual({ valid: true });
      expect(isPhoneNumber('123-456-7890')).toEqual({ valid: true });
      expect(isPhoneNumber('(123) 456-7890')).toEqual({ valid: true });
    });

    it('should return valid: false for invalid phone numbers', () => {
      expect(isPhoneNumber('not-a-phone-number').valid).toBe(false);
      expect(isPhoneNumber('123').valid).toBe(false);
    });

    it('should handle empty or non-string inputs', () => {
      // @ts-expect-error - testing invalid input
      expect(isPhoneNumber('').valid).toBe(false);
      // @ts-expect-error - testing invalid input
      expect(isPhoneNumber(undefined).valid).toBe(false);
    });
  });

  describe('isUrl', () => {
    const { isUrl } = validation;

    it('should return valid: true for valid URLs', () => {
      expect(isUrl('https://example.com')).toEqual({ valid: true });
      expect(isUrl('example.com')).toEqual({ valid: true });
    });

    it('should return valid: false for invalid URLs', () => {
      expect(isUrl('not-a-url').valid).toBe(false);
    });

    it('should require protocol when specified', () => {
      expect(isUrl('example.com', true).valid).toBe(false);
      expect(isUrl('https://example.com', true).valid).toBe(true);
    });

    it('should handle empty or non-string inputs', () => {
      // @ts-expect-error - testing invalid input
      expect(isUrl('').valid).toBe(false);
      // @ts-expect-error - testing invalid input
      expect(isUrl(null as any).valid).toBe(false);
    });
  });

  describe('isValidName', () => {
    const { isValidName } = validation;

    it('should return valid: true for valid names', () => {
      expect(isValidName('John Doe').valid).toBe(true);
      expect(isValidName('Anne-Marie').valid).toBe(true);
    });

    it('should return valid: false for names with invalid characters', () => {
      expect(isValidName('John 123').valid).toBe(false);
      expect(isValidName('John <script>').valid).toBe(false);
    });

    it('should return valid: false for names too short or too long', () => {
      expect(isValidName('A').valid).toBe(false);
      expect(isValidName('a'.repeat(101)).valid).toBe(false);
    });
  });

  describe('isValidMessage', () => {
    const { isValidMessage } = validation;

    it('should return valid: true for valid messages', () => {
      expect(isValidMessage('This is a valid message that is long enough.').valid).toBe(true);
    });

    it('should return valid: false for messages too short', () => {
      expect(isValidMessage('short').valid).toBe(false);
    });

    it('should return valid: false for messages with excessive repetition', () => {
      expect(isValidMessage('aaaaaaaaaaaaaaaaaaaa').valid).toBe(false);
    });
  });

  describe('isValidSubject', () => {
    const { isValidSubject } = validation;

    it('should return valid: true for valid subjects', () => {
      expect(isValidSubject('General Inquiry').valid).toBe(true);
    });

    it('should return valid: true for empty subject (optional)', () => {
      expect(isValidSubject('').valid).toBe(true);
      expect(isValidSubject(undefined as any).valid).toBe(true);
    });

    it('should return valid: false for subjects too long', () => {
      expect(isValidSubject('a'.repeat(201)).valid).toBe(false);
    });
  });

  describe('isStrongPassword', () => {
    const { isStrongPassword } = validation;

    it('should return valid: true for strong passwords', () => {
      expect(isStrongPassword('Password123!').valid).toBe(true);
    });

    it('should return valid: false for weak passwords', () => {
      expect(isStrongPassword('weak').valid).toBe(false);
      expect(isStrongPassword('alllowercase123!').valid).toBe(false);
      expect(isStrongPassword('ALLUPPERCASE123!').valid).toBe(false);
      expect(isStrongPassword('NoSpecialChar123').valid).toBe(false);
      expect(isStrongPassword('NoNumber!').valid).toBe(false);
    });
  });

  describe('escapeHtml', () => {
    const { escapeHtml } = validation;

    it('should escape dangerous characters', () => {
      expect(escapeHtml('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;',
      );
      expect(escapeHtml('Hello & World')).toBe('Hello &amp; World');
    });
  });

  describe('stripHtml', () => {
    const { stripHtml } = validation;

    it('should remove HTML tags', () => {
      expect(stripHtml('<p>Hello <b>World</b></p>')).toBe('Hello World');
    });

    it('should handle strings without tags', () => {
      expect(stripHtml('Hello World')).toBe('Hello World');
    });
  });

  describe('composeValidators', () => {
    const { composeValidators, isRequired, isEmail } = validation;

    it('should pass when all validators pass', () => {
      const validator = composeValidators(isRequired, isEmail);
      expect(validator('test@example.com').valid).toBe(true);
    });

    it('should fail when any validator fails', () => {
      const validator = composeValidators(isRequired, isEmail);
      expect(validator('').valid).toBe(false);
      expect(validator('not-an-email').valid).toBe(false);
    });
  });

  describe('validateObject', () => {
    const { validateObject, isRequired, isEmail } = validation;

    it('should return valid: true for objects that satisfy the schema', () => {
      const schema = {
        name: isRequired,
        email: isEmail,
      };
      const obj = {
        name: 'John',
        email: 'john@example.com',
      };
      expect(validateObject(obj, schema)).toEqual({ valid: true, errors: {} });
    });

    it('should return valid: false and collect errors for objects that fail the schema', () => {
      const schema = {
        name: isRequired,
        email: isEmail,
      };
      const obj = {
        name: '',
        email: 'invalid',
      };
      const result = validateObject(obj, schema);
      expect(result.valid).toBe(false);
      expect(result.errors.name).toBeDefined();
      expect(result.errors.email).toBeDefined();
    });
  });
});

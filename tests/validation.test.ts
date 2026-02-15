import { describe, it, expect } from 'vitest';
import {
  isValidMessage,
  isValidName,
  isValidSubject,
  isStrongPassword,
  VALIDATION_LIMITS
} from '../lib/validation';

describe('Validation Utilities', () => {
  describe('isValidMessage', () => {
    it('should validate correct messages', () => {
      const validMessage = 'This is a valid message that is long enough.';
      expect(isValidMessage(validMessage).valid).toBe(true);
    });

    it('should reject empty messages', () => {
      expect(isValidMessage('').valid).toBe(false);
      expect(isValidMessage('   ').valid).toBe(false);
    });

    it('should reject messages that are too short', () => {
      const shortMessage = 'Hi';
      expect(isValidMessage(shortMessage).valid).toBe(false);
      expect(isValidMessage(shortMessage).error).toContain(`at least ${VALIDATION_LIMITS.MESSAGE_MIN}`);
    });

    it('should reject messages that are too long', () => {
      const longMessage = 'a'.repeat(VALIDATION_LIMITS.MESSAGE_MAX + 1);
      expect(isValidMessage(longMessage).valid).toBe(false);
      expect(isValidMessage(longMessage).error).toContain(`no more than ${VALIDATION_LIMITS.MESSAGE_MAX}`);
    });

    it('should reject messages with excessive repeated characters (spam)', () => {
      const spamMessage = 'This is spam ' + 'a'.repeat(50);
      const result = isValidMessage(spamMessage);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Message contains excessive repeated characters');
    });

    it('should allow messages with normal repetition', () => {
      // "Continuous" has 2 'u's, "running" has 2 'n's - these should be fine
      const normalMessage = 'This is a continuous running process with successful results.';
      expect(isValidMessage(normalMessage).valid).toBe(true);
    });

    it('should handle boundary length messages', () => {
      const minMessage = 'a'.repeat(VALIDATION_LIMITS.MESSAGE_MIN);
      expect(isValidMessage(minMessage).valid).toBe(true);

      const maxMessage = 'a'.repeat(VALIDATION_LIMITS.MESSAGE_MAX);
      // Ensure max message doesn't trigger spam detection if it's not repeated chars
      // But 'a'.repeat(5000) WILL trigger spam detection.
      // We need a long message without excessive repetition.
      const longSafeMessage = 'This is a test message. '.repeat(Math.floor(VALIDATION_LIMITS.MESSAGE_MAX / 24)).slice(0, VALIDATION_LIMITS.MESSAGE_MAX);
      expect(isValidMessage(longSafeMessage).valid).toBe(true);
    });
  });

  describe('isValidName', () => {
    it('should validate correct names', () => {
      expect(isValidName('John Doe').valid).toBe(true);
      expect(isValidName('Jean-Luc Picard').valid).toBe(true);
      expect(isValidName("O'Connor").valid).toBe(true);
    });

    it('should reject invalid characters in names', () => {
      expect(isValidName('John123').valid).toBe(false);
      expect(isValidName('John@Doe').valid).toBe(false);
      expect(isValidName('John_Doe').valid).toBe(false); // Underscore not allowed based on regex
    });

    it('should enforce length constraints', () => {
      expect(isValidName('J').valid).toBe(false); // Too short
      expect(isValidName('a'.repeat(VALIDATION_LIMITS.NAME_MAX + 1)).valid).toBe(false); // Too long
    });
  });

  describe('isValidSubject', () => {
    it('should allow empty subjects (optional)', () => {
      expect(isValidSubject('').valid).toBe(true);
      // @ts-ignore - testing runtime behavior
      expect(isValidSubject(null).valid).toBe(true);
      // @ts-ignore - testing runtime behavior
      expect(isValidSubject(undefined).valid).toBe(true);
    });

    it('should validate correct subjects', () => {
      expect(isValidSubject('Inquiry').valid).toBe(true);
    });

    it('should reject subjects that are too long', () => {
      const longSubject = 'a'.repeat(VALIDATION_LIMITS.SUBJECT_MAX + 1);
      expect(isValidSubject(longSubject).valid).toBe(false);
    });
  });

  describe('isStrongPassword', () => {
    it('should validate strong passwords', () => {
      expect(isStrongPassword('Password123!').valid).toBe(true);
    });

    it('should reject weak passwords', () => {
      expect(isStrongPassword('weak').valid).toBe(false); // Too short
      expect(isStrongPassword('password123').valid).toBe(false); // No uppercase, no special
      expect(isStrongPassword('PASSWORD123!').valid).toBe(false); // No lowercase
      expect(isStrongPassword('Password!').valid).toBe(false); // No number
    });
  });
});

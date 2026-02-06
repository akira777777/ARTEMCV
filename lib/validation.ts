/**
 * Validation Utilities
 * 
 * Provides comprehensive validation functions for forms, user input,
 * and data sanitization throughout the application.
 * 
 * All validators return { valid: true } on success or 
 * { valid: false, error: string } on failure for consistent handling.
 */

// ============================================================================
// Types
// ============================================================================

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export type Validator<T> = (value: T) => ValidationResult;

// ============================================================================
// Constants
// ============================================================================

export const VALIDATION_LIMITS = {
  NAME_MIN: 2,
  NAME_MAX: 100,
  EMAIL_MAX: 254, // RFC 5321
  SUBJECT_MIN: 0,
  SUBJECT_MAX: 200,
  MESSAGE_MIN: 10,
  MESSAGE_MAX: 5000,
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 128,
  USERNAME_MIN: 3,
  USERNAME_MAX: 30,
} as const;

// RFC 5322 compliant email regex (simplified but effective)
export const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Phone number regex (international format support)
export const PHONE_REGEX = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/;

// URL regex
export const URL_REGEX = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

// ============================================================================
// String Validators
// ============================================================================

/**
 * Validates that a value is a non-empty string
 */
export function isRequired(value: unknown): ValidationResult {
  if (value === undefined || value === null || value === '') {
    return { valid: false, error: 'This field is required' };
  }
  return { valid: true };
}

/**
 * Validates string length is within specified bounds
 */
export function isLength(
  value: string,
  min: number,
  max: number,
  fieldName = 'Field'
): ValidationResult {
  if (typeof value !== 'string') {
    return { valid: false, error: `${fieldName} must be a string` };
  }
  
  const trimmed = value.trim();
  
  if (trimmed.length < min) {
    return { 
      valid: false, 
      error: `${fieldName} must be at least ${min} characters` 
    };
  }
  
  if (trimmed.length > max) {
    return { 
      valid: false, 
      error: `${fieldName} must be no more than ${max} characters` 
    };
  }
  
  return { valid: true };
}

/**
 * Validates email address format
 */
export function isEmail(value: string): ValidationResult {
  if (!value || typeof value !== 'string') {
    return { valid: false, error: 'Email is required' };
  }
  
  const trimmed = value.trim().toLowerCase();
  
  if (trimmed.length > VALIDATION_LIMITS.EMAIL_MAX) {
    return { valid: false, error: 'Email is too long' };
  }
  
  if (!EMAIL_REGEX.test(trimmed)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }
  
  return { valid: true };
}

/**
 * Validates phone number format
 */
export function isPhoneNumber(value: string): ValidationResult {
  if (!value || typeof value !== 'string') {
    return { valid: false, error: 'Phone number is required' };
  }
  
  if (!PHONE_REGEX.test(value.trim())) {
    return { valid: false, error: 'Please enter a valid phone number' };
  }
  
  return { valid: true };
}

/**
 * Validates URL format
 */
export function isUrl(value: string, requireProtocol = false): ValidationResult {
  if (!value || typeof value !== 'string') {
    return { valid: false, error: 'URL is required' };
  }
  
  let url = value.trim();
  
  if (requireProtocol && !url.startsWith('http')) {
    return { valid: false, error: 'URL must start with http:// or https://' };
  }
  
  if (!requireProtocol && !url.startsWith('http')) {
    url = 'https://' + url;
  }
  
  if (!URL_REGEX.test(url)) {
    return { valid: false, error: 'Please enter a valid URL' };
  }
  
  return { valid: true };
}

// ============================================================================
// Specialized Validators
// ============================================================================

/**
 * Validates a contact form name field
 */
export function isValidName(value: string): ValidationResult {
  const required = isRequired(value);
  if (!required.valid) return required;
  
  const length = isLength(
    value as string, 
    VALIDATION_LIMITS.NAME_MIN, 
    VALIDATION_LIMITS.NAME_MAX, 
    'Name'
  );
  if (!length.valid) return length;
  
  // Check for only letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s\-'']+$/;
  if (!nameRegex.test((value as string).trim())) {
    return { valid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
  }
  
  return { valid: true };
}

/**
 * Validates a contact form message field
 */
export function isValidMessage(value: string): ValidationResult {
  const required = isRequired(value);
  if (!required.valid) return required;
  
  const length = isLength(
    value as string,
    VALIDATION_LIMITS.MESSAGE_MIN,
    VALIDATION_LIMITS.MESSAGE_MAX,
    'Message'
  );
  if (!length.valid) return length;
  
  // Check for excessive repetition (possible spam)
  const trimmed = (value as string).trim();
  const repeatedCharRegex = /(.)\1{10,}/;
  if (repeatedCharRegex.test(trimmed)) {
    return { valid: false, error: 'Message contains excessive repeated characters' };
  }
  
  return { valid: true };
}

/**
 * Validates a contact form subject field (optional)
 */
export function isValidSubject(value: string): ValidationResult {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { valid: true }; // Subject is optional
  }
  
  return isLength(
    value as string,
    VALIDATION_LIMITS.SUBJECT_MIN,
    VALIDATION_LIMITS.SUBJECT_MAX,
    'Subject'
  );
}

/**
 * Validates password strength
 */
export function isStrongPassword(value: string): ValidationResult {
  if (!value || typeof value !== 'string') {
    return { valid: false, error: 'Password is required' };
  }
  
  const length = isLength(
    value,
    VALIDATION_LIMITS.PASSWORD_MIN,
    VALIDATION_LIMITS.PASSWORD_MAX,
    'Password'
  );
  if (!length.valid) return length;
  
  const checks = [
    { test: /[a-z]/, name: 'lowercase letter' },
    { test: /[A-Z]/, name: 'uppercase letter' },
    { test: /[0-9]/, name: 'number' },
    { test: /[^a-zA-Z0-9]/, name: 'special character' },
  ];
  
  const missing = checks
    .filter(check => !check.test.test(value))
    .map(check => check.name);
  
  if (missing.length > 0) {
    return { 
      valid: false, 
      error: `Password must contain at least one ${missing.join(', ')}` 
    };
  }
  
  return { valid: true };
}

// ============================================================================
// Sanitization Functions
// ============================================================================

/**
 * Sanitizes a string by trimming and removing control characters
 */
export function sanitizeString(value: string, maxLength?: number): string {
  if (typeof value !== 'string') return '';
  
  let sanitized = value
    .trim()
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ''); // Remove control characters
  
  if (maxLength && maxLength > 0) {
    sanitized = sanitized.slice(0, maxLength);
  }
  
  return sanitized;
}

/**
 * Sanitizes HTML to prevent XSS attacks
 */
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Removes all HTML tags from a string
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

// ============================================================================
// Composition Utilities
// ============================================================================

/**
 * Combines multiple validators into a single validator
 * All validators must pass for the combined validator to pass
 */
export function composeValidators<T>(...validators: Validator<T>[]): Validator<T> {
  return (value: T): ValidationResult => {
    for (const validator of validators) {
      const result = validator(value);
      if (!result.valid) {
        return result;
      }
    }
    return { valid: true };
  };
}

/**
 * Validates an object against a schema of validators
 */
export function validateObject<T extends Record<string, unknown>>(
  obj: T,
  schema: { [K in keyof T]?: Validator<T[K]> }
): { valid: boolean; errors: Partial<Record<keyof T, string>> } {
  const errors: Partial<Record<keyof T, string>> = {};
  let valid = true;
  
  for (const [key, validator] of Object.entries(schema)) {
    if (validator) {
      const result = (validator as Validator<unknown>)(obj[key]);
      if (!result.valid) {
        errors[key as keyof T] = result.error;
        valid = false;
      }
    }
  }
  
  return { valid, errors };
}

export default {
  isRequired,
  isLength,
  isEmail,
  isPhoneNumber,
  isUrl,
  isValidName,
  isValidMessage,
  isValidSubject,
  isStrongPassword,
  sanitizeString,
  escapeHtml,
  stripHtml,
  composeValidators,
  validateObject,
};

import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Enhanced Form Management Utilities
 *
 * Advanced form handling with validation, state management,
 * performance optimization, and accessibility features.
 */

// ============================================================================
// TYPES
// ============================================================================

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | boolean | Promise<string | boolean>;
}

export interface FieldConfig {
  name: string;
  type:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'tel'
    | 'url'
    | 'textarea'
    | 'select'
    | 'checkbox'
    | 'radio';
  label: string;
  placeholder?: string;
  validation?: FieldValidation;
  defaultValue?: any;
  options?: Array<{ value: string; label: string }>; // For select/radio
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
}

export interface FormState {
  values: Record<string, any>;
  errors: Record<string, string | null>;
  touched: Record<string, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
  submitCount: number;
}

export interface UseFormOptions {
  initialValues?: Record<string, any>;
  validationSchema?: Record<string, FieldValidation>;
  onSubmit?: (values: Record<string, any>) => Promise<void> | void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  debounceMs?: number;
  persistKey?: string;
  resetOnSubmit?: boolean;
}

export interface UseFieldResult {
  value: any;
  error: string | null;
  touched: boolean;
  isValid: boolean;
  onChange: (value: any) => void;
  onBlur: () => void;
  onFocus: () => void;
  setValue: (value: any) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Enhanced form management hook with validation and state persistence
 */
export function useForm(options: UseFormOptions = {}) {
  const {
    initialValues = {},
    validationSchema = {},
    onSubmit,
    validateOnChange = true,
    validateOnBlur = true,
    debounceMs = 300,
    persistKey,
    resetOnSubmit = false,
  } = options;

  const [state, setState] = useState<FormState>({
    values: { ...initialValues },
    errors: {},
    touched: {},
    isValid: true,
    isSubmitting: false,
    isDirty: false,
    submitCount: 0,
  });

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // Load persisted state
  useEffect(() => {
    if (!persistKey) return;

    try {
      const persisted = localStorage.getItem(persistKey);
      if (persisted) {
        const parsed = JSON.parse(persisted);
        setState((prev) => ({
          ...prev,
          values: { ...initialValues, ...parsed.values },
          touched: parsed.touched || {},
        }));
      }
    } catch (error) {
      console.warn(`Failed to load persisted form state: ${persistKey}`, error);
    }
  }, [persistKey, initialValues]);

  // Save state to localStorage
  useEffect(() => {
    if (!persistKey) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      try {
        localStorage.setItem(
          persistKey,
          JSON.stringify({
            values: state.values,
            touched: state.touched,
          }),
        );
      } catch (error) {
        console.warn(`Failed to persist form state: ${persistKey}`, error);
      }
    }, debounceMs);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [state.values, state.touched, persistKey, debounceMs]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Validation function
  const validateField = useCallback(
    async (name: string, value: any): Promise<string | null> => {
      const validation = validationSchema[name];
      if (!validation) return null;

      // Required validation
      if (validation.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
        return 'This field is required';
      }

      // Min length validation
      if (validation.minLength && value && value.length < validation.minLength) {
        return `Minimum length is ${validation.minLength} characters`;
      }

      // Max length validation
      if (validation.maxLength && value && value.length > validation.maxLength) {
        return `Maximum length is ${validation.maxLength} characters`;
      }

      // Pattern validation
      if (validation.pattern && value && !validation.pattern.test(value)) {
        return 'Invalid format';
      }

      // Custom validation
      if (validation.custom) {
        const result = await validation.custom(value);
        if (typeof result === 'string') {
          return result;
        } else if (result === false) {
          return 'Invalid value';
        }
      }

      return null;
    },
    [validationSchema],
  );

  // Update field value
  const setValue = useCallback(
    async (name: string, value: any) => {
      setState((prev) => {
        const newValues = { ...prev.values, [name]: value };
        const newTouched = { ...prev.touched, [name]: true };
        const newIsDirty = JSON.stringify(newValues) !== JSON.stringify(initialValues);

        return {
          ...prev,
          values: newValues,
          touched: newTouched,
          isDirty: newIsDirty,
        };
      });

      // Validate on change if enabled
      if (validateOnChange) {
        const error = await validateField(name, value);
        setState((prev) => ({
          ...prev,
          errors: { ...prev.errors, [name]: error },
        }));
      }
    },
    [validateField, validateOnChange, initialValues],
  );

  // Handle field blur
  const handleBlur = useCallback(
    async (name: string) => {
      if (validateOnBlur) {
        const error = await validateField(name, state.values[name]);
        setState((prev) => ({
          ...prev,
          errors: { ...prev.errors, [name]: error },
          touched: { ...prev.touched, [name]: true },
        }));
      }
    },
    [validateField, validateOnBlur, state.values],
  );

  // Validate entire form
  const validateForm = useCallback(async (): Promise<boolean> => {
    const errors: Record<string, string> = {};

    for (const [name, value] of Object.entries(state.values)) {
      const error = await validateField(name, value);
      if (error) {
        errors[name] = error;
      }
    }

    setState((prev) => ({
      ...prev,
      errors,
    }));

    return Object.keys(errors).length === 0;
  }, [state.values, validateField]);

  // Submit form
  const submit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();

      setState((prev) => ({ ...prev, isSubmitting: true }));

      try {
        const isValid = await validateForm();
        setState((prev) => ({ ...prev, submitCount: prev.submitCount + 1 }));

        if (isValid && onSubmit) {
          await onSubmit(state.values);

          if (resetOnSubmit) {
            setState({
              values: { ...initialValues },
              errors: {},
              touched: {},
              isValid: true,
              isSubmitting: false,
              isDirty: false,
              submitCount: 0,
            });
          } else {
            setState((prev) => ({ ...prev, isSubmitting: false }));
          }
        } else {
          setState((prev) => ({ ...prev, isSubmitting: false }));
        }
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isSubmitting: false,
          errors: {
            ...prev.errors,
            submit: error instanceof Error ? error.message : 'Submission failed',
          },
        }));
      }
    },
    [validateForm, onSubmit, state.values, resetOnSubmit, initialValues],
  );

  // Reset form
  const reset = useCallback(() => {
    setState({
      values: { ...initialValues },
      errors: {},
      touched: {},
      isValid: true,
      isSubmitting: false,
      isDirty: false,
      submitCount: 0,
    });

    if (persistKey) {
      try {
        localStorage.removeItem(persistKey);
      } catch (error) {
        console.warn(`Failed to clear persisted form state: ${persistKey}`, error);
      }
    }
  }, [initialValues, persistKey]);

  // Clear errors
  const clearErrors = useCallback(() => {
    setState((prev) => ({ ...prev, errors: {} }));
  }, []);

  // Check if form is valid
  const isFormValid = useCallback(async () => {
    const errors = await Promise.all(
      Object.entries(state.values).map(async ([name, value]) => ({
        [name]: await validateField(name, value),
      })),
    );

    const errorObj = Object.assign({}, ...errors);
    const isValid = Object.values(errorObj).every((error) => !error);

    setState((prev) => ({ ...prev, errors: errorObj }));
    return isValid;
  }, [state.values, validateField]);

  return {
    ...state,
    setValue,
    handleBlur,
    validateForm,
    submit,
    reset,
    clearErrors,
    isFormValid,
  };
}

/**
 * Individual field hook for form management
 */
export function useField(
  name: string,
  form: ReturnType<typeof useForm>,
  config?: FieldConfig,
): UseFieldResult {
  const { values, errors, touched, setValue, handleBlur } = form;
  const [isFocused, setIsFocused] = useState(false);

  const value = values[name];
  const error = errors[name];
  const isTouched = touched[name];
  const isValid = !error && isTouched;

  const onChange = useCallback(
    (newValue: any) => {
      setValue(name, newValue);
    },
    [name, setValue],
  );

  const onBlur = useCallback(() => {
    setIsFocused(false);
    handleBlur(name);
  }, [name, handleBlur]);

  const onFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const setValueDirect = useCallback(
    (newValue: any) => {
      setValue(name, newValue);
    },
    [name, setValue],
  );

  const setError = useCallback(
    (newError: string | null) => {
      // Use internal state update - we need to pass this through the form's setValue
      // For now, we'll clear/touch the field to trigger validation
      if (newError === null) {
        // Clearing error - just touch the field
      }
    },
    [name],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  return {
    value,
    error,
    touched: isTouched,
    isValid,
    onChange,
    onBlur,
    onFocus,
    setValue: setValueDirect,
    setError,
    clearError,
  };
}

/**
 * Form validation utilities
 */
export const formValidation = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address',
  },
  phone: {
    pattern: /^\+?[\d\s\-()]{10,}$/,
    message: 'Please enter a valid phone number',
  },
  url: {
    pattern: /^https?:\/\/.+\..+$/,
    message: 'Please enter a valid URL',
  },
  password: {
    minLength: 8,
    hasUppercase: true,
    hasLowercase: true,
    hasNumbers: true,
    hasSpecialChar: true,
    validate: (password: string) => {
      const errors: string[] = [];

      if (password.length < 8) errors.push('Password must be at least 8 characters long');
      if (!/[a-z]/.test(password))
        errors.push('Password must contain at least one lowercase letter');
      if (!/[A-Z]/.test(password))
        errors.push('Password must contain at least one uppercase letter');
      if (!/\d/.test(password)) errors.push('Password must contain at least one number');
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
        errors.push('Password must contain at least one special character');

      return errors.length === 0 ? true : errors.join('. ');
    },
  },
  name: {
    pattern: /^[a-zA-Z\s\-']+$/,
    minLength: 2,
    message: 'Please enter a valid name',
  },
};

/**
 * Form persistence utilities
 */
export const formPersistence = {
  save: (key: string, formState: FormState): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(formState));
      return true;
    } catch (error) {
      console.error(`Failed to save form state: ${key}`, error);
      return false;
    }
  },

  load: (key: string): FormState | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Failed to load form state: ${key}`, error);
      return null;
    }
  },

  remove: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Failed to remove form state: ${key}`, error);
      return false;
    }
  },
};

/**
 * Accessibility helpers for forms
 */
export const formAccessibility = {
  generateAriaProps: (fieldName: string, error?: string, required?: boolean) => ({
    'aria-label': fieldName,
    'aria-required': required || undefined,
    'aria-invalid': error ? 'true' : undefined,
    'aria-describedby': error ? `${fieldName}-error` : undefined,
  }),

  generateErrorId: (fieldName: string) => `${fieldName}-error`,

  focusFirstError: (formRef: React.RefObject<HTMLFormElement>) => {
    if (formRef.current) {
      const firstError = formRef.current.querySelector('[aria-invalid="true"]');
      if (firstError && typeof (firstError as HTMLElement).focus === 'function') {
        (firstError as HTMLElement).focus();
      }
    }
  },
};

export default {
  useForm,
  useField,
  formValidation,
  formPersistence,
  formAccessibility,
};

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Props for the Input component
 */
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Label text */
  label?: string;
  /** Error message */
  error?: string;
  /** Helper text */
  helper?: string;
  /** Icon to display on the left side */
  leftIcon?: React.ReactNode;
  /** Icon or element to display on the right side */
  rightElement?: React.ReactNode;
  /** Size of the input */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the input takes full width */
  fullWidth?: boolean;
  /** Custom class names */
  className?: string;
  /** Custom class names for the input wrapper */
  wrapperClassName?: string;
}

/**
 * Input size styles
 */
const inputSizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-base',
} as const;

/**
 * Input component with label, error handling and icons
 *
 * @example
 * ```tsx
 * <Input
 *   label="Email"
 *   placeholder="Enter your email"
 *   leftIcon={<MailIcon />}
 *   error="Invalid email address"
 * />
 * ```
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helper,
      leftIcon,
      rightElement,
      size = 'md',
      fullWidth = true,
      className,
      wrapperClassName,
      disabled,
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id || React.useId();
    const hasError = !!error;

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full', wrapperClassName)}>
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-zinc-300">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <motion.input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full bg-zinc-900 border rounded-lg text-zinc-100 placeholder:text-zinc-500',
              'focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'transition-all duration-200',
              hasError && 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500/50',
              !hasError && 'border-zinc-700 hover:border-zinc-600',
              inputSizes[size],
              leftIcon && 'pl-10',
              rightElement && 'pr-10',
              className,
            )}
            whileFocus={!disabled ? { scale: 1.005 } : undefined}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined
            }
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
              {rightElement}
            </div>
          )}
        </div>
        {hasError ? (
          <motion.p
            id={`${inputId}-error`}
            className="text-xs text-red-400"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </motion.p>
        ) : helper ? (
          <p id={`${inputId}-helper`} className="text-xs text-zinc-500">
            {helper}
          </p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = 'Input';

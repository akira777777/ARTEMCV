import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for merging tailwind classes
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Button Variants
 */
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Button Props Interface
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

/**
 * Modern Button Component
 *
 * @example
 * <Button variant="primary" size="md">Click me</Button>
 * <Button variant="secondary" leftIcon={<Icon />}>With Icon</Button>
 * <Button isLoading>Loading...</Button>
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center gap-2
      font-semibold rounded-full
      transition-all duration-200 ease-out
      focus-visible:outline-none focus-visible:ring-2 
      focus-visible:ring-emerald-500 focus-visible:ring-offset-2
      focus-visible:ring-offset-[#0a0a0a]
      disabled:opacity-50 disabled:cursor-not-allowed
      active:scale-95
    `;

    const variants = {
      primary: `
        bg-gradient-to-r from-emerald-500 to-emerald-600
        text-white
        hover:from-emerald-400 hover:to-emerald-500
        hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]
        hover:-translate-y-0.5
      `,
      secondary: `
        bg-[#1a1a1a]
        text-white
        border border-white/10
        hover:border-white/20
        hover:bg-[#262626]
      `,
      ghost: `
        bg-transparent
        text-zinc-400
        hover:text-white
        hover:bg-white/5
      `,
      outline: `
        bg-transparent
        text-emerald-400
        border border-emerald-500/50
        hover:bg-emerald-500/10
        hover:border-emerald-500
      `,
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-sm',
      lg: 'px-8 py-4 text-base',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], fullWidth && 'w-full', className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <span className="animate-spin">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </span>
        )}
        {!isLoading && leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;

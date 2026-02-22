import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Typography Components
 * Unified text styles for the application
 */

/**
 * Heading Component
 */
interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: 'display' | 'xl' | 'lg' | 'md' | 'sm' | 'xs';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'black';
  gradient?: boolean;
  balance?: boolean;
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      as: Component = 'h2',
      size = 'md',
      weight = 'bold',
      gradient = false,
      balance = true,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const sizes = {
      display: 'text-5xl sm:text-6xl lg:text-7xl xl:text-8xl',
      xl: 'text-4xl sm:text-5xl lg:text-6xl',
      lg: 'text-3xl sm:text-4xl lg:text-5xl',
      md: 'text-2xl sm:text-3xl lg:text-4xl',
      sm: 'text-xl sm:text-2xl lg:text-3xl',
      xs: 'text-lg sm:text-xl lg:text-2xl',
    };

    const weights = {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
      black: 'font-black',
    };

    return (
      <Component
        ref={ref}
        className={cn(
          'tracking-tight leading-tight',
          sizes[size],
          weights[weight],
          gradient && 'text-gradient',
          balance && 'text-balance',
          className,
        )}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

Heading.displayName = 'Heading';

/**
 * Text Component
 */
interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'tertiary' | 'muted';
  weight?: 'normal' | 'medium' | 'semibold';
  leading?: 'tight' | 'normal' | 'relaxed';
}

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  (
    {
      size = 'base',
      color = 'secondary',
      weight = 'normal',
      leading = 'normal',
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const sizes = {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    };

    const colors = {
      primary: 'text-white',
      secondary: 'text-zinc-400',
      tertiary: 'text-zinc-500',
      muted: 'text-zinc-600',
    };

    const weights = {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
    };

    const leadings = {
      tight: 'leading-tight',
      normal: 'leading-normal',
      relaxed: 'leading-relaxed',
    };

    return (
      <p
        ref={ref}
        className={cn(sizes[size], colors[color], weights[weight], leadings[leading], className)}
        {...props}
      >
        {children}
      </p>
    );
  },
);

Text.displayName = 'Text';

/**
 * Label Component
 * For small text like badges, labels, captions
 */
interface LabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: 'xs' | 'sm';
  weight?: 'normal' | 'medium' | 'semibold';
  uppercase?: boolean;
  tracking?: 'normal' | 'wide' | 'wider';
}

export const Label = React.forwardRef<HTMLSpanElement, LabelProps>(
  (
    {
      size = 'xs',
      weight = 'medium',
      uppercase = false,
      tracking = 'wide',
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const sizes = {
      xs: 'text-xs',
      sm: 'text-sm',
    };

    const weights = {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
    };

    const trackings = {
      normal: 'tracking-normal',
      wide: 'tracking-wide',
      wider: 'tracking-wider',
    };

    return (
      <span
        ref={ref}
        className={cn(
          sizes[size],
          weights[weight],
          trackings[tracking],
          uppercase && 'uppercase',
          className,
        )}
        {...props}
      >
        {children}
      </span>
    );
  },
);

Label.displayName = 'Label';

/**
 * GradientText Component
 */
interface GradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  animate?: boolean;
}

export const GradientText = React.forwardRef<HTMLSpanElement, GradientTextProps>(
  ({ animate = false, className, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent',
        animate && 'animate-gradient-shift bg-[length:200%_auto]',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  ),
);

GradientText.displayName = 'GradientText';

export default { Heading, Text, Label, GradientText };

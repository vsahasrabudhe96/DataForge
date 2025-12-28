'use client';

import { clsx } from 'clsx';
import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  isLoading,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-semibold rounded-xl
    transition-all duration-200 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--background)]
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-purple)]
      text-white
      hover:shadow-[var(--glow-cyan)]
      hover:-translate-y-0.5
      focus:ring-[var(--accent-cyan)]
    `,
    secondary: `
      bg-[var(--background-tertiary)]
      text-[var(--foreground)]
      border border-[var(--card-border)]
      hover:border-[var(--accent-cyan)]
      hover:text-[var(--accent-cyan)]
      focus:ring-[var(--accent-cyan)]
    `,
    ghost: `
      bg-transparent
      text-[var(--foreground-muted)]
      hover:bg-[var(--background-tertiary)]
      hover:text-[var(--foreground)]
      focus:ring-[var(--accent-cyan)]
    `,
    danger: `
      bg-gradient-to-r from-[var(--accent-magenta)] to-[var(--accent-orange)]
      text-white
      hover:shadow-[var(--glow-magenta)]
      hover:-translate-y-0.5
      focus:ring-[var(--accent-magenta)]
    `,
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  };

  return (
    <button
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
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
      ) : (
        leftIcon
      )}
      {children}
      {rightIcon}
    </button>
  );
}


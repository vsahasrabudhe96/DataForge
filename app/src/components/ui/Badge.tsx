'use client';

import { clsx } from 'clsx';
import { ReactNode } from 'react';

interface BadgeProps {
  variant?: 'cyan' | 'green' | 'magenta' | 'purple' | 'yellow' | 'orange' | 'default';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  icon?: ReactNode;
  pulse?: boolean;
  className?: string;
}

export function Badge({
  variant = 'default',
  size = 'md',
  children,
  icon,
  pulse = false,
  className,
}: BadgeProps) {
  const variants = {
    default: 'bg-[var(--background-tertiary)] text-[var(--foreground-muted)] border-[var(--card-border)]',
    cyan: 'bg-[rgba(0,212,255,0.15)] text-[var(--accent-cyan)] border-[rgba(0,212,255,0.3)]',
    green: 'bg-[rgba(0,255,157,0.15)] text-[var(--accent-green)] border-[rgba(0,255,157,0.3)]',
    magenta: 'bg-[rgba(255,51,102,0.15)] text-[var(--accent-magenta)] border-[rgba(255,51,102,0.3)]',
    purple: 'bg-[rgba(168,85,247,0.15)] text-[var(--accent-purple)] border-[rgba(168,85,247,0.3)]',
    yellow: 'bg-[rgba(255,217,61,0.15)] text-[var(--accent-yellow)] border-[rgba(255,217,61,0.3)]',
    orange: 'bg-[rgba(255,149,0,0.15)] text-[var(--accent-orange)] border-[rgba(255,149,0,0.3)]',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 font-semibold rounded-full border uppercase tracking-wider',
        variants[variant],
        sizes[size],
        pulse && 'animate-pulse',
        className
      )}
    >
      {icon}
      {children}
    </span>
  );
}

interface DifficultyBadgeProps {
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function DifficultyBadge({ difficulty, size = 'md', className }: DifficultyBadgeProps) {
  const config = {
    beginner: { variant: 'green' as const, label: 'Beginner' },
    intermediate: { variant: 'cyan' as const, label: 'Intermediate' },
    advanced: { variant: 'purple' as const, label: 'Advanced' },
    expert: { variant: 'magenta' as const, label: 'Expert' },
  };

  const { variant, label } = config[difficulty];

  return (
    <Badge variant={variant} size={size} className={className}>
      {label}
    </Badge>
  );
}

interface LevelBadgeProps {
  level: 'junior' | 'mid' | 'senior' | 'staff' | 'principal';
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LevelBadge({ level, showIcon = true, size = 'md', className }: LevelBadgeProps) {
  const config = {
    junior: { variant: 'green' as const, label: 'Junior', icon: '🌱' },
    mid: { variant: 'cyan' as const, label: 'Mid', icon: '🌿' },
    senior: { variant: 'purple' as const, label: 'Senior', icon: '🌳' },
    staff: { variant: 'yellow' as const, label: 'Staff', icon: '⭐' },
    principal: { variant: 'magenta' as const, label: 'Principal', icon: '👑' },
  };

  const { variant, label, icon } = config[level];

  return (
    <Badge 
      variant={variant} 
      size={size} 
      icon={showIcon ? <span>{icon}</span> : undefined}
      className={className}
    >
      {label}
    </Badge>
  );
}

interface StreakBadgeProps {
  streak: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StreakBadge({ streak, size = 'md', className }: StreakBadgeProps) {
  const variant = streak >= 30 ? 'magenta' : streak >= 7 ? 'orange' : 'yellow';
  
  return (
    <Badge 
      variant={variant} 
      size={size}
      icon={<span>🔥</span>}
      pulse={streak >= 7}
      className={className}
    >
      {streak} Day{streak !== 1 ? 's' : ''}
    </Badge>
  );
}

interface TopicBadgeProps {
  topic: string;
  color?: 'cyan' | 'green' | 'magenta' | 'purple' | 'yellow' | 'orange';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function TopicBadge({ topic, color = 'cyan', size = 'sm', className }: TopicBadgeProps) {
  return (
    <Badge variant={color} size={size} className={className}>
      {topic}
    </Badge>
  );
}


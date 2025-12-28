'use client';

import { clsx } from 'clsx';
import { Lock, Zap } from 'lucide-react';

interface AchievementBadgeProps {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'mastery' | 'streak' | 'speed' | 'challenge';
  unlocked: boolean;
  xpReward: number;
  progress?: number;
  maxProgress?: number;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  onClick?: () => void;
}

export function AchievementBadge({
  id,
  name,
  description,
  icon,
  category,
  unlocked,
  xpReward,
  progress = 0,
  maxProgress = 1,
  size = 'md',
  showTooltip = true,
  onClick,
}: AchievementBadgeProps) {
  const categoryColors = {
    mastery: {
      bg: 'bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-cyan)]',
      border: 'border-[var(--accent-purple)]/50',
      glow: 'shadow-[0_0_20px_rgba(168,85,247,0.4)]',
    },
    streak: {
      bg: 'bg-gradient-to-br from-[var(--accent-orange)] to-[var(--accent-yellow)]',
      border: 'border-[var(--accent-orange)]/50',
      glow: 'shadow-[0_0_20px_rgba(255,149,0,0.4)]',
    },
    speed: {
      bg: 'bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-green)]',
      border: 'border-[var(--accent-cyan)]/50',
      glow: 'shadow-[0_0_20px_rgba(0,212,255,0.4)]',
    },
    challenge: {
      bg: 'bg-gradient-to-br from-[var(--accent-magenta)] to-[var(--accent-purple)]',
      border: 'border-[var(--accent-magenta)]/50',
      glow: 'shadow-[0_0_20px_rgba(255,51,102,0.4)]',
    },
  };

  const sizes = {
    sm: {
      wrapper: 'w-14 h-14',
      icon: 'text-xl',
      ring: 'w-16 h-16',
    },
    md: {
      wrapper: 'w-20 h-20',
      icon: 'text-3xl',
      ring: 'w-[5.5rem] h-[5.5rem]',
    },
    lg: {
      wrapper: 'w-28 h-28',
      icon: 'text-4xl',
      ring: 'w-[7.5rem] h-[7.5rem]',
    },
  };

  const colors = categoryColors[category];
  const sizeConfig = sizes[size];
  const progressPercent = (progress / maxProgress) * 100;

  return (
    <div
      className={clsx(
        'relative group cursor-pointer transition-transform duration-200',
        onClick && 'hover:scale-105',
        showTooltip && 'tooltip'
      )}
      data-tooltip={unlocked ? name : `${name} - ${progress}/${maxProgress}`}
      onClick={onClick}
    >
      {/* Progress ring (only for locked badges with progress) */}
      {!unlocked && progress > 0 && (
        <svg
          className={clsx(
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            sizeConfig.ring
          )}
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="var(--background-tertiary)"
            strokeWidth="4"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="var(--accent-cyan)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${progressPercent * 2.83} 283`}
            transform="rotate(-90 50 50)"
            className="transition-all duration-500"
          />
        </svg>
      )}

      {/* Badge container */}
      <div
        className={clsx(
          'rounded-2xl flex items-center justify-center transition-all duration-300',
          sizeConfig.wrapper,
          unlocked ? [colors.bg, colors.glow] : 'bg-[var(--background-tertiary)]',
          !unlocked && 'grayscale opacity-50',
          'border-2',
          unlocked ? colors.border : 'border-[var(--card-border)]'
        )}
      >
        {unlocked ? (
          <span className={sizeConfig.icon}>{icon}</span>
        ) : (
          <Lock className={clsx(
            'text-[var(--foreground-muted)]',
            size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8'
          )} />
        )}
      </div>

      {/* XP reward indicator */}
      {unlocked && (
        <div className="absolute -bottom-1 -right-1 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[var(--accent-yellow)]/20 border border-[var(--accent-yellow)]/30">
          <Zap className="w-2.5 h-2.5 text-[var(--accent-yellow)]" />
          <span className="text-[10px] font-bold text-[var(--accent-yellow)]">
            {xpReward}
          </span>
        </div>
      )}
    </div>
  );
}

interface AchievementCardProps {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'mastery' | 'streak' | 'speed' | 'challenge';
  unlocked: boolean;
  xpReward: number;
  progress?: number;
  maxProgress?: number;
  unlockedAt?: Date;
}

export function AchievementCard({
  id,
  name,
  description,
  icon,
  category,
  unlocked,
  xpReward,
  progress = 0,
  maxProgress = 1,
  unlockedAt,
}: AchievementCardProps) {
  const categoryLabels = {
    mastery: 'Mastery',
    streak: 'Streak',
    speed: 'Speed',
    challenge: 'Challenge',
  };

  const categoryColors = {
    mastery: 'text-[var(--accent-purple)]',
    streak: 'text-[var(--accent-orange)]',
    speed: 'text-[var(--accent-cyan)]',
    challenge: 'text-[var(--accent-magenta)]',
  };

  return (
    <div
      className={clsx(
        'p-4 rounded-xl border transition-all duration-200',
        'bg-[var(--card-bg)] backdrop-blur-xl',
        unlocked
          ? 'border-[var(--card-hover-border)]'
          : 'border-[var(--card-border)] opacity-60'
      )}
    >
      <div className="flex items-start gap-4">
        <AchievementBadge
          id={id}
          name={name}
          description={description}
          icon={icon}
          category={category}
          unlocked={unlocked}
          xpReward={xpReward}
          progress={progress}
          maxProgress={maxProgress}
          size="md"
          showTooltip={false}
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={clsx(
              'font-semibold',
              unlocked ? 'text-[var(--foreground)]' : 'text-[var(--foreground-muted)]'
            )}>
              {name}
            </h4>
            <span className={clsx('text-xs font-medium', categoryColors[category])}>
              {categoryLabels[category]}
            </span>
          </div>
          
          <p className="text-sm text-[var(--foreground-muted)] mb-2">
            {description}
          </p>
          
          {!unlocked && maxProgress > 1 && (
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-[var(--background-tertiary)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--accent-cyan)] rounded-full transition-all duration-500"
                  style={{ width: `${(progress / maxProgress) * 100}%` }}
                />
              </div>
              <span className="text-xs text-[var(--foreground-muted)]">
                {progress}/{maxProgress}
              </span>
            </div>
          )}
          
          {unlocked && unlockedAt && (
            <p className="text-xs text-[var(--accent-green)]">
              Unlocked {new Date(unlockedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}


'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import {
  LayoutDashboard,
  BookOpen,
  Target,
  Trophy,
  FileText,
  Code,
  Settings,
  ChevronLeft,
  ChevronRight,
  Flame,
  Zap,
} from 'lucide-react';
import { useStore, useUserProgress } from '@/store/useStore';
import { XPProgressBar } from '@/components/ui/ProgressBar';
import { LevelBadge, StreakBadge } from '@/components/ui/Badge';
import { LEVEL_THRESHOLDS } from '@/types';

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Learn',
    href: '/learn',
    icon: BookOpen,
    children: [
      { label: 'Data Modeling', href: '/learn/data-modeling' },
      { label: 'SCD Types', href: '/learn/scd' },
      { label: 'Loading Patterns', href: '/learn/loading-patterns' },
      { label: 'Data Lakehouse', href: '/learn/lakehouse' },
      { label: 'Data Quality', href: '/learn/data-quality' },
      { label: 'Performance', href: '/learn/performance' },
    ],
  },
  {
    label: 'Practice',
    href: '/practice',
    icon: Target,
    children: [
      { label: 'Challenges', href: '/practice/challenges' },
      { label: 'Quiz', href: '/practice/quiz' },
      { label: 'Flashcards', href: '/practice/flashcards' },
    ],
  },
  {
    label: 'Code Sandbox',
    href: '/sandbox',
    icon: Code,
  },
  {
    label: 'Progress',
    href: '/progress',
    icon: Trophy,
    children: [
      { label: 'Stats', href: '/progress/stats' },
      { label: 'Achievements', href: '/progress/achievements' },
      { label: 'Leaderboard', href: '/progress/leaderboard' },
    ],
  },
  {
    label: 'Resources',
    href: '/resources',
    icon: FileText,
    children: [
      { label: 'Cheat Sheets', href: '/resources/cheat-sheets' },
      { label: 'SQL Library', href: '/resources/sql-library' },
      { label: 'Interview Tips', href: '/resources/interview-tips' },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useStore();
  const userProgress = useUserProgress();

  const levelThreshold = LEVEL_THRESHOLDS[userProgress.level];

  return (
    <aside
      className={clsx(
        'fixed left-0 top-0 h-screen z-40',
        'bg-[var(--background-secondary)]/80 backdrop-blur-xl',
        'border-r border-[var(--card-border)]',
        'transition-all duration-300 ease-out',
        'flex flex-col',
        sidebarOpen ? 'w-64' : 'w-20'
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-[var(--card-border)]">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-purple)] flex items-center justify-center text-xl font-bold text-white">
            DF
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <h1 className="text-lg font-bold gradient-text whitespace-nowrap">
                DataForge
              </h1>
              <p className="text-[10px] text-[var(--foreground-muted)] uppercase tracking-wider">
                Interview Prep
              </p>
            </div>
          )}
        </Link>
      </div>

      {/* User Stats */}
      {sidebarOpen && (
        <div className="p-4 border-b border-[var(--card-border)]">
          <div className="flex items-center gap-2 mb-3">
            <LevelBadge level={userProgress.level} size="sm" />
            <StreakBadge streak={userProgress.streak} size="sm" />
          </div>
          <XPProgressBar
            currentXP={userProgress.totalXp}
            levelMinXP={levelThreshold.min}
            levelMaxXP={levelThreshold.max === Infinity ? levelThreshold.min + 30000 : levelThreshold.max}
            level={levelThreshold.title}
          />
        </div>
      )}

      {/* Collapsed stats */}
      {!sidebarOpen && (
        <div className="p-3 border-b border-[var(--card-border)] flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-purple)] flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-[var(--accent-yellow)]">
            <Flame className="w-3 h-3" />
            {userProgress.streak}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const hasChildren = item.children && item.children.length > 0;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl',
                    'transition-all duration-200',
                    'group',
                    isActive
                      ? 'bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan)]'
                      : 'text-[var(--foreground-muted)] hover:bg-[var(--background-tertiary)] hover:text-[var(--foreground)]'
                  )}
                >
                  <Icon
                    className={clsx(
                      'w-5 h-5 flex-shrink-0',
                      isActive && 'text-[var(--accent-cyan)]'
                    )}
                  />
                  {sidebarOpen && (
                    <span className="font-medium text-sm truncate">
                      {item.label}
                    </span>
                  )}
                  {isActive && (
                    <div className="absolute left-0 w-1 h-6 bg-[var(--accent-cyan)] rounded-r-full" />
                  )}
                </Link>

                {/* Sub-navigation */}
                {sidebarOpen && hasChildren && isActive && (
                  <ul className="mt-1 ml-6 pl-3 border-l border-[var(--card-border)] space-y-1">
                    {item.children?.map((child) => {
                      const isChildActive = pathname === child.href;
                      return (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className={clsx(
                              'block px-3 py-1.5 text-sm rounded-lg transition-colors',
                              isChildActive
                                ? 'text-[var(--accent-cyan)] bg-[var(--accent-cyan)]/5'
                                : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
                            )}
                          >
                            {child.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Settings & Toggle */}
      <div className="p-3 border-t border-[var(--card-border)]">
        <Link
          href="/settings"
          className={clsx(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl mb-2',
            'text-[var(--foreground-muted)] hover:bg-[var(--background-tertiary)] hover:text-[var(--foreground)]',
            'transition-colors'
          )}
        >
          <Settings className="w-5 h-5" />
          {sidebarOpen && <span className="text-sm font-medium">Settings</span>}
        </Link>

        <button
          onClick={toggleSidebar}
          className={clsx(
            'w-full flex items-center justify-center gap-2 px-3 py-2',
            'rounded-xl border border-[var(--card-border)]',
            'text-[var(--foreground-muted)] hover:text-[var(--foreground)]',
            'hover:border-[var(--accent-cyan)]/40',
            'transition-all'
          )}
        >
          {sidebarOpen ? (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span className="text-xs">Collapse</span>
            </>
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </div>
    </aside>
  );
}


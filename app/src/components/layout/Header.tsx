'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Bell, Search, User, Zap, Flame, Menu, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useStore, useUserProgress, useSidebarOpen } from '@/store/useStore';
import { Button } from '@/components/ui/Button';
import { clsx } from 'clsx';

export function Header() {
  const { data: session, status } = useSession();
  const userProgress = useUserProgress();
  const sidebarOpen = useSidebarOpen();
  const { toggleSidebar } = useStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className={clsx(
        'fixed top-0 right-0 h-16 z-30',
        'bg-[var(--background)]/80 backdrop-blur-xl',
        'border-b border-[var(--card-border)]',
        'flex items-center justify-between px-6',
        'transition-all duration-300',
        sidebarOpen ? 'left-64' : 'left-20'
      )}
    >
      {/* Left side - Mobile menu & Search */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-[var(--background-tertiary)] text-[var(--foreground-muted)]"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
          <input
            type="text"
            placeholder="Search topics, questions..."
            className={clsx(
              'w-64 lg:w-80 pl-10 pr-4 py-2',
              'bg-[var(--background-tertiary)] border border-[var(--card-border)]',
              'rounded-xl text-sm text-[var(--foreground)]',
              'placeholder:text-[var(--foreground-muted)]',
              'focus:outline-none focus:border-[var(--accent-cyan)]/50',
              'transition-colors'
            )}
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] text-[var(--foreground-muted)] bg-[var(--background-secondary)] border border-[var(--card-border)] rounded">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right side - Stats & User */}
      <div className="flex items-center gap-4">
        {/* Quick Stats */}
        <div className="hidden md:flex items-center gap-3">
          {/* XP */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent-yellow)]/10 border border-[var(--accent-yellow)]/30">
            <Zap className="w-4 h-4 text-[var(--accent-yellow)]" />
            <span className="text-sm font-bold text-[var(--accent-yellow)]">
              {userProgress.totalXp.toLocaleString()}
            </span>
          </div>

          {/* Streak */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent-orange)]/10 border border-[var(--accent-orange)]/30">
            <Flame className="w-4 h-4 text-[var(--accent-orange)]" />
            <span className="text-sm font-bold text-[var(--accent-orange)]">
              {userProgress.streak}
            </span>
          </div>
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-[var(--background-tertiary)] text-[var(--foreground-muted)] transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--accent-magenta)]" />
        </button>

        {/* User Menu */}
        {status === 'loading' ? (
          <div className="w-8 h-8 rounded-lg bg-[var(--background-tertiary)] animate-pulse" />
        ) : session?.user ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={clsx(
                'flex items-center gap-2 px-2 py-1.5 rounded-xl',
                'hover:bg-[var(--background-tertiary)] transition-colors',
                showUserMenu && 'bg-[var(--background-tertiary)]'
              )}
            >
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  className="w-8 h-8 rounded-lg object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-purple)] flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {session.user.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
              )}
              <span className="hidden lg:inline text-sm font-medium text-[var(--foreground)]">
                {session.user.name?.split(' ')[0] || 'User'}
              </span>
              <ChevronDown className={clsx(
                'w-4 h-4 text-[var(--foreground-muted)] transition-transform hidden lg:block',
                showUserMenu && 'rotate-180'
              )} />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 py-2 rounded-xl bg-[var(--background-secondary)] border border-[var(--card-border)] shadow-xl shadow-black/20 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-[var(--card-border)]">
                  <p className="text-sm font-medium text-[var(--foreground)]">
                    {session.user.name}
                  </p>
                  <p className="text-xs text-[var(--foreground-muted)] truncate">
                    {session.user.email}
                  </p>
                </div>
                
                <div className="py-1">
                  <Link
                    href="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-tertiary)] transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                </div>
                
                <div className="border-t border-[var(--card-border)] pt-1">
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link href="/auth/signin">
            <Button variant="primary" size="sm">
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}

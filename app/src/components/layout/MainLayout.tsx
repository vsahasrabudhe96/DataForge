'use client';

import { ReactNode } from 'react';
import { clsx } from 'clsx';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useSidebarOpen } from '@/store/useStore';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const sidebarOpen = useSidebarOpen();

  return (
    <div className="min-h-screen bg-[var(--background)] grid-pattern">
      <Sidebar />
      <Header />
      <main
        className={clsx(
          'pt-16 min-h-screen',
          'transition-all duration-300',
          sidebarOpen ? 'pl-64' : 'pl-20'
        )}
      >
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}


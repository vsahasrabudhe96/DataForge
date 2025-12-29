'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useStore, useUserProgress, useTheme } from '@/store/useStore';
import {
  Settings,
  User,
  Moon,
  Sun,
  Trash2,
  Download,
  RefreshCw,
  Bell,
  Shield,
  AlertTriangle,
  Check,
} from 'lucide-react';
import { clsx } from 'clsx';

export default function SettingsPage() {
  const { resetProgress, toggleTheme } = useStore();
  const userProgress = useUserProgress();
  const theme = useTheme();
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    weeklyReport: true,
    achievements: true,
  });
  const [saved, setSaved] = useState(false);

  const handleResetProgress = () => {
    resetProgress();
    setShowResetConfirm(false);
    showSavedMessage();
  };

  const handleDeleteAccount = () => {
    // Clear all localStorage data
    localStorage.clear();
    // Reset progress
    resetProgress();
    // Redirect to home
    window.location.href = '/';
  };

  const handleExportData = () => {
    const data = {
      userProgress,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `databay-progress-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const showSavedMessage = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
    showSavedMessage();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Badge variant="cyan" size="md">
            <Settings className="w-4 h-4" />
            SETTINGS
          </Badge>
          {saved && (
            <Badge variant="green" size="sm" className="animate-pulse">
              <Check className="w-3 h-3" />
              Saved
            </Badge>
          )}
        </div>
        <h1 className="text-3xl font-bold text-[var(--foreground)]">
          Settings
        </h1>
        <p className="text-[var(--foreground-muted)]">
          Manage your account preferences and data
        </p>
      </div>

      {/* Profile Section */}
      <Card variant="default" padding="lg">
        <div className="flex items-center gap-3 mb-4">
          <User className="w-5 h-5 text-[var(--accent-cyan)]" />
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Profile</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--background-tertiary)]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-purple)] flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-medium text-[var(--foreground)]">Data Engineer</p>
                <p className="text-sm text-[var(--foreground-muted)]">
                  Progress saved locally on this device
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-[var(--background-tertiary)]">
              <p className="text-sm text-[var(--foreground-muted)]">Total XP Earned</p>
              <p className="text-2xl font-bold text-[var(--accent-yellow)]">
                {userProgress.totalXp.toLocaleString()}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-[var(--background-tertiary)]">
              <p className="text-sm text-[var(--foreground-muted)]">Modules Completed</p>
              <p className="text-2xl font-bold text-[var(--accent-cyan)]">
                {userProgress.completedModules.length}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Appearance Section */}
      <Card variant="default" padding="lg">
        <div className="flex items-center gap-3 mb-4">
          <Moon className="w-5 h-5 text-[var(--accent-purple)]" />
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Appearance</h2>
        </div>
        
        <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--background-tertiary)]">
          <div className="flex items-center gap-3">
            {theme === 'dark' ? (
              <Moon className="w-5 h-5 text-[var(--accent-purple)]" />
            ) : (
              <Sun className="w-5 h-5 text-[var(--accent-yellow)]" />
            )}
            <div>
              <p className="font-medium text-[var(--foreground)]">Theme</p>
              <p className="text-sm text-[var(--foreground-muted)]">
                {theme === 'dark' ? 'Dark mode is enabled' : 'Light mode is enabled'}
              </p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={toggleTheme}>
            {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          </Button>
        </div>
      </Card>

      {/* Notifications Section */}
      <Card variant="default" padding="lg">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-5 h-5 text-[var(--accent-green)]" />
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Notifications</h2>
        </div>
        
        <div className="space-y-3">
          {[
            { key: 'dailyReminder' as const, label: 'Daily Reminder', desc: 'Get reminded to practice every day' },
            { key: 'weeklyReport' as const, label: 'Weekly Report', desc: 'Receive a weekly progress summary' },
            { key: 'achievements' as const, label: 'Achievements', desc: 'Get notified when you unlock achievements' },
          ].map(({ key, label, desc }) => (
            <div 
              key={key}
              className="flex items-center justify-between p-4 rounded-lg bg-[var(--background-tertiary)]"
            >
              <div>
                <p className="font-medium text-[var(--foreground)]">{label}</p>
                <p className="text-sm text-[var(--foreground-muted)]">{desc}</p>
              </div>
              <button
                onClick={() => toggleNotification(key)}
                className={clsx(
                  'w-12 h-6 rounded-full relative transition-colors',
                  notifications[key] ? 'bg-[var(--accent-green)]' : 'bg-[var(--background-secondary)]'
                )}
              >
                <span 
                  className={clsx(
                    'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
                    notifications[key] ? 'left-7' : 'left-1'
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Data Management Section */}
      <Card variant="default" padding="lg">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-[var(--accent-cyan)]" />
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Data Management</h2>
        </div>
        
        <div className="space-y-3">
          {/* Export Data */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--background-tertiary)]">
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-[var(--foreground-muted)]" />
              <div>
                <p className="font-medium text-[var(--foreground)]">Export Progress</p>
                <p className="text-sm text-[var(--foreground-muted)]">
                  Download your progress as a JSON file
                </p>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={handleExportData}>
              Export
            </Button>
          </div>

          {/* Reset Progress */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--background-tertiary)]">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-[var(--accent-yellow)]" />
              <div>
                <p className="font-medium text-[var(--foreground)]">Reset Progress</p>
                <p className="text-sm text-[var(--foreground-muted)]">
                  Reset XP and completed modules to start fresh
                </p>
              </div>
            </div>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => setShowResetConfirm(true)}
            >
              Reset
            </Button>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card variant="default" padding="lg" className="border-red-500/30">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h2 className="text-lg font-semibold text-red-400">Danger Zone</h2>
        </div>
        
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trash2 className="w-5 h-5 text-red-500" />
              <div>
                <p className="font-medium text-[var(--foreground)]">Delete All Data</p>
                <p className="text-sm text-[var(--foreground-muted)]">
                  Permanently delete all your progress and settings
                </p>
              </div>
            </div>
            <Button 
              variant="danger" 
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete
            </Button>
          </div>
        </div>
      </Card>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <Card variant="default" padding="lg" className="max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="w-6 h-6 text-[var(--accent-yellow)]" />
              <h3 className="text-xl font-bold text-[var(--foreground)]">Reset Progress?</h3>
            </div>
            <p className="text-[var(--foreground-muted)] mb-6">
              This will reset your XP to 0 and clear all completed modules. 
              Your settings will be preserved.
            </p>
            <div className="flex gap-3 justify-end">
              <Button 
                variant="secondary" 
                onClick={() => setShowResetConfirm(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleResetProgress}
              >
                Reset Progress
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <Card variant="default" padding="lg" className="max-w-md mx-4 border-red-500/30">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h3 className="text-xl font-bold text-red-400">Delete All Data?</h3>
            </div>
            <p className="text-[var(--foreground-muted)] mb-4">
              This action cannot be undone. All your data will be permanently deleted:
            </p>
            <ul className="list-disc list-inside text-sm text-[var(--foreground-muted)] mb-6 space-y-1">
              <li>All progress and XP</li>
              <li>Completed modules</li>
              <li>Quiz history</li>
              <li>Settings and preferences</li>
            </ul>
            <div className="flex gap-3 justify-end">
              <Button 
                variant="secondary" 
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="danger" 
                onClick={handleDeleteAccount}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Everything
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

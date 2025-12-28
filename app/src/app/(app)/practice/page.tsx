'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ChallengeCard } from '@/components/ChallengeCard';
import {
  Target,
  Zap,
  Brain,
  Clock,
  Trophy,
  Flame,
  BookOpen,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { clsx } from 'clsx';

const practiceTypes = [
  {
    id: 'quiz',
    title: 'Quick Quiz',
    description: 'Test your knowledge with randomized multiple choice questions.',
    icon: <Zap className="w-6 h-6" />,
    color: 'cyan',
    stats: '500+ questions',
    href: '/practice/quiz',
  },
  {
    id: 'flashcards',
    title: 'Flashcards',
    description: 'Review concepts with spaced repetition for better retention.',
    icon: <BookOpen className="w-6 h-6" />,
    color: 'purple',
    stats: 'Smart review',
    href: '/practice/flashcards',
  },
  {
    id: 'challenges',
    title: 'Daily Challenges',
    description: 'Complete daily and weekly challenges for bonus XP.',
    icon: <Target className="w-6 h-6" />,
    color: 'yellow',
    stats: 'New daily',
    href: '/practice/challenges',
  },
  {
    id: 'sandbox',
    title: 'SQL Sandbox',
    description: 'Practice SQL queries in an interactive editor.',
    icon: <Brain className="w-6 h-6" />,
    color: 'green',
    stats: 'Live SQL',
    href: '/sandbox',
  },
];

const dailyChallenge = {
  id: 'daily-today',
  title: 'SCD Type 2 Mastery',
  description: 'Implement a complete SCD Type 2 merge statement with proper versioning.',
  type: 'daily' as const,
  difficulty: 'intermediate' as const,
  xpReward: 100,
  questionsCount: 3,
  timeLimit: 15,
  expiresIn: '18h 30m',
  href: '/practice/challenges/daily',
};

const weeklyChallenge = {
  id: 'weekly-current',
  title: 'Data Warehouse Design Sprint',
  description: 'Design a complete star schema for an e-commerce analytics platform.',
  type: 'weekly' as const,
  difficulty: 'advanced' as const,
  xpReward: 500,
  questionsCount: 10,
  timeLimit: 60,
  expiresIn: '5d 12h',
  href: '/practice/challenges/weekly',
};

export default function PracticePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="purple" size="md">
            <Target className="w-4 h-4" />
            Practice Mode
          </Badge>
        </div>
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
          Sharpen Your Skills
        </h1>
        <p className="text-[var(--foreground-muted)] max-w-2xl">
          Practice makes perfect. Choose from quizzes, flashcards, challenges, or hands-on SQL exercises.
        </p>
      </div>

      {/* Featured Challenges */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-5 h-5 text-[var(--accent-orange)]" />
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Today&apos;s Challenge
            </h2>
            <Badge variant="orange" size="sm" pulse>
              NEW
            </Badge>
          </div>
          <ChallengeCard {...dailyChallenge} />
        </div>
        
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-[var(--accent-purple)]" />
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Weekly Quest
            </h2>
          </div>
          <ChallengeCard {...weeklyChallenge} />
        </div>
      </div>

      {/* Practice Types */}
      <div>
        <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
          Choose Your Practice Mode
        </h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {practiceTypes.map((type) => {
            const colorClasses = {
              cyan: 'from-[var(--accent-cyan)]/20 to-transparent border-[var(--accent-cyan)]/30 hover:border-[var(--accent-cyan)]/60',
              purple: 'from-[var(--accent-purple)]/20 to-transparent border-[var(--accent-purple)]/30 hover:border-[var(--accent-purple)]/60',
              green: 'from-[var(--accent-green)]/20 to-transparent border-[var(--accent-green)]/30 hover:border-[var(--accent-green)]/60',
              yellow: 'from-[var(--accent-yellow)]/20 to-transparent border-[var(--accent-yellow)]/30 hover:border-[var(--accent-yellow)]/60',
            };

            const iconClasses = {
              cyan: 'bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)]',
              purple: 'bg-[var(--accent-purple)]/20 text-[var(--accent-purple)]',
              green: 'bg-[var(--accent-green)]/20 text-[var(--accent-green)]',
              yellow: 'bg-[var(--accent-yellow)]/20 text-[var(--accent-yellow)]',
            };

            return (
              <Link key={type.id} href={type.href} className="block group">
                <Card
                  variant="interactive"
                  padding="lg"
                  className={clsx(
                    'h-full bg-gradient-to-br transition-all duration-300',
                    colorClasses[type.color as keyof typeof colorClasses]
                  )}
                >
                  <div
                    className={clsx(
                      'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
                      'transition-transform group-hover:scale-110',
                      iconClasses[type.color as keyof typeof iconClasses]
                    )}
                  >
                    {type.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                    {type.title}
                  </h3>
                  <p className="text-sm text-[var(--foreground-muted)] mb-4">
                    {type.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="default" size="sm">
                      {type.stats}
                    </Badge>
                    <ArrowRight className="w-4 h-4 text-[var(--foreground-muted)] group-hover:text-[var(--accent-cyan)] group-hover:translate-x-1 transition-all" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Start */}
      <Card variant="highlight" padding="lg">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-[var(--accent-cyan)]" />
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                Quick Start
              </h2>
            </div>
            <p className="text-[var(--foreground-muted)]">
              Short on time? Take a 5-minute quiz covering all topics to warm up your brain.
            </p>
          </div>
          <Link href="/practice/quiz?mode=quick">
            <Button 
              variant="primary" 
              size="lg"
              leftIcon={<Clock className="w-5 h-5" />}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              5-Minute Quiz
            </Button>
          </Link>
        </div>
      </Card>

      {/* Topic-Based Practice */}
      <div>
        <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
          Practice by Topic
        </h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { id: 'data-modeling', name: 'Data Modeling', icon: '🏗️', questions: 25 },
            { id: 'scd', name: 'SCD Types', icon: '🔄', questions: 20 },
            { id: 'loading-patterns', name: 'Loading Patterns', icon: '📥', questions: 18 },
            { id: 'lakehouse', name: 'Data Lakehouse', icon: '🏠', questions: 22 },
            { id: 'data-quality', name: 'Data Quality', icon: '✅', questions: 15 },
            { id: 'performance', name: 'Performance', icon: '⚡', questions: 20 },
          ].map((topic) => (
            <Link 
              key={topic.id} 
              href={`/practice/quiz?topic=${topic.id}`}
              className="block group"
            >
              <Card variant="interactive" padding="md">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{topic.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[var(--foreground)] group-hover:text-[var(--accent-cyan)] transition-colors">
                      {topic.name}
                    </h3>
                    <p className="text-sm text-[var(--foreground-muted)]">
                      {topic.questions} questions
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[var(--foreground-muted)] group-hover:text-[var(--accent-cyan)] group-hover:translate-x-1 transition-all" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}


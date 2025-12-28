'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Database,
  Layers,
  Zap,
  Target,
  Trophy,
  BookOpen,
  Code,
  ArrowRight,
  Play,
  Sparkles,
  Users,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';

const features = [
  {
    icon: <Database className="w-6 h-6" />,
    title: 'Data Modeling Mastery',
    description: 'Learn fact tables, dimension tables, star schemas, and key types through interactive lessons.',
    color: 'cyan',
  },
  {
    icon: <Layers className="w-6 h-6" />,
    title: 'SCD Deep Dives',
    description: 'Master all Slowly Changing Dimension types with real-world SQL examples.',
    color: 'purple',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Loading Patterns',
    description: 'Understand full loads, incremental loads, watermarking, and CDC strategies.',
    color: 'yellow',
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: 'SQL Sandbox',
    description: 'Practice queries in an interactive editor with instant feedback.',
    color: 'green',
  },
];

const topics = [
  'Star Schema Design',
  'Snowflake Schema',
  'SCD Type 2',
  'Incremental Loading',
  'Delta Lake',
  'Data Quality',
  'Query Optimization',
  'Partitioning',
];

const stats = [
  { value: '100+', label: 'Interactive Lessons' },
  { value: '500+', label: 'Practice Questions' },
  { value: '50+', label: 'SQL Challenges' },
  { value: '20+', label: 'Achievements' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--background)] overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 grid-pattern opacity-50" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-[var(--accent-cyan)]/10 rounded-full blur-[128px]" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-[var(--accent-purple)]/10 rounded-full blur-[128px]" />

      {/* Navigation */}
      <nav className="relative z-10 border-b border-[var(--card-border)] bg-[var(--background)]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-purple)] flex items-center justify-center text-xl font-bold text-white">
              DF
            </div>
            <span className="text-xl font-bold gradient-text">DataForge</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/learn" className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">
              Learn
            </Link>
            <Link href="/practice" className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">
              Practice
            </Link>
            <Link href="/resources" className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">
              Resources
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="secondary" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="primary" size="sm">
                Start Free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <Badge variant="purple" size="lg" className="mb-6 animate-slide-up">
            <Sparkles className="w-4 h-4" />
            Gamified Learning Experience
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold text-[var(--foreground)] mb-6 animate-slide-up stagger-1">
            Master{' '}
            <span className="gradient-text">Data Engineering</span>
            <br />
            Interviews
          </h1>

          <p className="text-xl text-[var(--foreground-muted)] max-w-2xl mx-auto mb-10 animate-slide-up stagger-2">
            Learn real-world concepts through interactive challenges, quizzes, and hands-on practice.
            Level up from Junior to Principal with our gamified learning system.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up stagger-3">
            <Link href="/dashboard">
              <Button variant="primary" size="lg" rightIcon={<Play className="w-5 h-5" />}>
                Start Learning Free
              </Button>
            </Link>
            <Link href="/learn">
              <Button variant="secondary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Explore Topics
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 animate-slide-up stagger-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-[var(--foreground-muted)]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Topics Marquee */}
      <section className="relative z-10 py-8 border-y border-[var(--card-border)] bg-[var(--background-secondary)]/50 overflow-hidden">
        <div className="flex gap-8 animate-marquee">
          {[...topics, ...topics].map((topic, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--background-tertiary)] border border-[var(--card-border)] whitespace-nowrap"
            >
              <CheckCircle2 className="w-4 h-4 text-[var(--accent-green)]" />
              <span className="text-sm font-medium text-[var(--foreground)]">{topic}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="cyan" size="md" className="mb-4">
              <BookOpen className="w-4 h-4" />
              Comprehensive Coverage
            </Badge>
            <h2 className="text-4xl font-bold text-[var(--foreground)] mb-4">
              Everything You Need to Ace Your Interview
            </h2>
            <p className="text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto">
              From data modeling fundamentals to advanced optimization techniques,
              master the concepts that top companies test in interviews.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <Card
                key={feature.title}
                variant="interactive"
                padding="lg"
                glow={feature.color as 'cyan' | 'purple' | 'green'}
                className="group"
              >
                <div
                  className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center transition-transform group-hover:scale-110`}
                  style={{
                    background: `var(--accent-${feature.color})20`,
                    color: `var(--accent-${feature.color})`,
                  }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
                  {feature.title}
                </h3>
                <p className="text-[var(--foreground-muted)]">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gamification Section */}
      <section className="relative z-10 py-24 px-6 bg-gradient-to-b from-[var(--background-secondary)]/50 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="yellow" size="md" className="mb-4">
                <Trophy className="w-4 h-4" />
                Gamified Learning
              </Badge>
              <h2 className="text-4xl font-bold text-[var(--foreground)] mb-6">
                Level Up Your Skills
              </h2>
              <p className="text-lg text-[var(--foreground-muted)] mb-8">
                Earn XP, unlock achievements, and climb the leaderboard as you master
                data engineering concepts. Our gamification system keeps you motivated
                and tracks your progress.
              </p>

              <div className="space-y-4">
                {[
                  { icon: <Zap className="w-5 h-5 text-[var(--accent-yellow)]" />, text: 'Earn XP for every correct answer' },
                  { icon: <Target className="w-5 h-5 text-[var(--accent-cyan)]" />, text: 'Complete daily and weekly challenges' },
                  { icon: <Trophy className="w-5 h-5 text-[var(--accent-purple)]" />, text: 'Unlock achievement badges' },
                  { icon: <TrendingUp className="w-5 h-5 text-[var(--accent-green)]" />, text: 'Progress from Junior to Principal' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--background-tertiary)] flex items-center justify-center">
                      {item.icon}
                    </div>
                    <span className="text-[var(--foreground)]">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              {/* Achievement cards mockup */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: '🏗️', name: 'Data Modeler', unlocked: true },
                  { icon: '🔄', name: 'SCD Master', unlocked: true },
                  { icon: '⚡', name: 'Speed Demon', unlocked: false },
                  { icon: '🔥', name: '7-Day Streak', unlocked: true },
                  { icon: '👑', name: 'Principal', unlocked: false },
                  { icon: '🎯', name: 'Perfect Score', unlocked: false },
                ].map((badge, i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 border transition-all duration-300
                      ${badge.unlocked
                        ? 'bg-gradient-to-br from-[var(--accent-purple)]/20 to-[var(--accent-cyan)]/20 border-[var(--accent-purple)]/30 shadow-[0_0_20px_rgba(168,85,247,0.2)]'
                        : 'bg-[var(--background-tertiary)] border-[var(--card-border)] opacity-50'
                      }
                    `}
                  >
                    <span className="text-3xl">{badge.icon}</span>
                    <span className="text-xs font-medium text-[var(--foreground-muted)]">
                      {badge.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Card
            variant="highlight"
            padding="lg"
            className="bg-gradient-to-br from-[var(--accent-cyan)]/10 via-[var(--accent-purple)]/10 to-[var(--accent-magenta)]/10"
          >
            <div className="py-8">
              <div className="flex justify-center gap-2 mb-6">
                <Users className="w-6 h-6 text-[var(--accent-cyan)]" />
                <span className="text-sm font-semibold text-[var(--accent-cyan)]">
                  Join 10,000+ learners
                </span>
              </div>
              <h2 className="text-4xl font-bold text-[var(--foreground)] mb-4">
                Ready to Ace Your Interview?
              </h2>
              <p className="text-lg text-[var(--foreground-muted)] mb-8 max-w-xl mx-auto">
                Start your journey to becoming a confident data engineer today.
                It&apos;s free to get started!
              </p>
              <Link href="/dashboard">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Start Learning Now
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[var(--card-border)] py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-purple)] flex items-center justify-center text-sm font-bold text-white">
              DF
            </div>
            <span className="text-sm text-[var(--foreground-muted)]">
              © 2024 DataForge. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-[var(--foreground-muted)]">
            <Link href="/privacy" className="hover:text-[var(--foreground)] transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[var(--foreground)] transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-[var(--foreground)] transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>

      {/* Marquee animation styles */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}

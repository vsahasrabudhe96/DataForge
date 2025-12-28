'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { QuizComponent, QuizResults } from '@/components/QuizComponent';
import { getRandomQuestions, QUESTIONS } from '@/data/questions';
import { TOPIC_METADATA } from '@/types';
import type { TopicCategory, Question } from '@/types';
import {
  ArrowLeft,
  Play,
  Target,
  Clock,
  Zap,
  BookOpen,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { clsx } from 'clsx';

interface QuizResult {
  questionId: string;
  correct: boolean;
  userAnswer: string;
  timeSpent: number;
  hintsUsed: number;
}

function QuizPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const topicParam = searchParams.get('topic') as TopicCategory | null;
  const modeParam = searchParams.get('mode');

  const [quizState, setQuizState] = useState<'setup' | 'active' | 'results'>('setup');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<TopicCategory | 'all'>(topicParam || 'all');
  const [questionCount, setQuestionCount] = useState(modeParam === 'quick' ? 5 : 10);

  const startQuiz = () => {
    const quizQuestions = getRandomQuestions(
      questionCount,
      selectedTopic === 'all' ? undefined : selectedTopic
    );
    setQuestions(quizQuestions);
    setQuizState('active');
  };

  const handleComplete = (quizResults: QuizResult[]) => {
    setResults(quizResults);
    setQuizState('results');
  };

  const handleRetry = () => {
    startQuiz();
  };

  const handleExit = () => {
    router.push('/practice');
  };

  if (quizState === 'active' && questions.length > 0) {
    return <QuizComponent questions={questions} onComplete={handleComplete} />;
  }

  if (quizState === 'results') {
    return (
      <QuizResults
        results={results}
        questions={questions}
        onRetry={handleRetry}
        onExit={handleExit}
      />
    );
  }

  // Setup screen
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <Link 
          href="/practice"
          className="inline-flex items-center gap-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Practice</span>
        </Link>
        
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
          Quick Quiz
        </h1>
        <p className="text-[var(--foreground-muted)]">
          Test your knowledge with randomized questions. Configure your quiz settings below.
        </p>
      </div>

      {/* Quiz Settings */}
      <Card variant="highlight" padding="lg">
        <div className="flex items-center gap-2 mb-6">
          <Settings className="w-5 h-5 text-[var(--accent-cyan)]" />
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Quiz Settings
          </h2>
        </div>

        {/* Topic Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[var(--foreground)] mb-3">
            Select Topic
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTopic('all')}
              className={clsx(
                'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                selectedTopic === 'all'
                  ? 'bg-[var(--accent-cyan)] text-white'
                  : 'bg-[var(--background-tertiary)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
              )}
            >
              All Topics
            </button>
            {Object.entries(TOPIC_METADATA).map(([id, meta]) => (
              <button
                key={id}
                onClick={() => setSelectedTopic(id as TopicCategory)}
                className={clsx(
                  'px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2',
                  selectedTopic === id
                    ? 'bg-[var(--accent-cyan)] text-white'
                    : 'bg-[var(--background-tertiary)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
                )}
              >
                <span>{meta.icon}</span>
                <span>{meta.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Question Count */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[var(--foreground)] mb-3">
            Number of Questions
          </label>
          <div className="flex gap-3">
            {[5, 10, 15, 20].map((count) => (
              <button
                key={count}
                onClick={() => setQuestionCount(count)}
                className={clsx(
                  'px-6 py-3 rounded-xl text-sm font-semibold transition-all',
                  questionCount === count
                    ? 'bg-[var(--accent-cyan)] text-white'
                    : 'bg-[var(--background-tertiary)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
                )}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Quiz Preview */}
        <div className="p-4 rounded-xl bg-[var(--background-tertiary)] border border-[var(--card-border)]">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center gap-1 text-[var(--accent-cyan)] mb-1">
                <BookOpen className="w-4 h-4" />
                <span className="text-xl font-bold">{questionCount}</span>
              </div>
              <p className="text-xs text-[var(--foreground-muted)]">Questions</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 text-[var(--accent-purple)] mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-xl font-bold">~{questionCount * 1}</span>
              </div>
              <p className="text-xs text-[var(--foreground-muted)]">Minutes</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 text-[var(--accent-yellow)] mb-1">
                <Zap className="w-4 h-4" />
                <span className="text-xl font-bold">{questionCount * 15}</span>
              </div>
              <p className="text-xs text-[var(--foreground-muted)]">Max XP</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Start Button */}
      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={startQuiz}
        leftIcon={<Play className="w-5 h-5" />}
      >
        Start Quiz
      </Button>

      {/* Available Questions Info */}
      <p className="text-center text-sm text-[var(--foreground-muted)]">
        {selectedTopic === 'all'
          ? `${QUESTIONS.length} questions available across all topics`
          : `${QUESTIONS.filter(q => q.topic === selectedTopic).length} questions available for ${TOPIC_METADATA[selectedTopic]?.name}`
        }
      </p>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="animate-pulse">Loading quiz...</div>
      </div>
    }>
      <QuizPageContent />
    </Suspense>
  );
}


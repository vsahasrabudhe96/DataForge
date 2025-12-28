'use client';

import { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge, DifficultyBadge, TopicBadge } from './ui/Badge';
import { ProgressBar } from './ui/ProgressBar';
import { useStore } from '@/store/useStore';
import { TOPIC_METADATA } from '@/types';
import type { Question, TopicCategory } from '@/types';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ArrowRight,
  Trophy,
  Zap,
  RotateCcw,
} from 'lucide-react';
import { clsx } from 'clsx';

interface QuizComponentProps {
  questions: Question[];
  onComplete: (results: QuizResult[]) => void;
  showTimer?: boolean;
}

interface QuizResult {
  questionId: string;
  correct: boolean;
  userAnswer: string;
  timeSpent: number;
  hintsUsed: number;
}

export function QuizComponent({ questions, onComplete, showTimer = true }: QuizComponentProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [startTime, setStartTime] = useState(Date.now());
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const { addXp, recordQuizResult } = useStore();

  const question = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const isCorrect = selectedAnswer === question.correctAnswer;
  const topicMeta = TOPIC_METADATA[question.topic];

  useEffect(() => {
    setStartTime(Date.now());
    if (question.timeLimit && showTimer) {
      setTimeLeft(question.timeLimit);
    }
  }, [currentIndex, question.timeLimit, showTimer]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || showResult) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showResult]);

  const handleSubmit = () => {
    if (!selectedAnswer) return;

    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    const result: QuizResult = {
      questionId: question.id,
      correct: isCorrect,
      userAnswer: selectedAnswer,
      timeSpent,
      hintsUsed,
    };

    setResults(prev => [...prev, result]);
    setShowResult(true);

    if (isCorrect) {
      addXp(question.xpReward, question.topic);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onComplete([...results]);
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowHint(false);
      setHintsUsed(0);
    }
  };

  const handleShowHint = () => {
    if (question.hints && question.hints.length > hintsUsed) {
      setShowHint(true);
      setHintsUsed(prev => prev + 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--foreground-muted)]">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <div className="flex items-center gap-4">
            {showTimer && timeLeft !== null && (
              <div className={clsx(
                'flex items-center gap-1.5 px-3 py-1 rounded-lg',
                timeLeft <= 10 
                  ? 'bg-[var(--accent-magenta)]/20 text-[var(--accent-magenta)]' 
                  : 'bg-[var(--background-tertiary)] text-[var(--foreground-muted)]'
              )}>
                <Clock className="w-4 h-4" />
                <span className="font-mono font-medium">{formatTime(timeLeft)}</span>
              </div>
            )}
            <Badge variant="yellow" size="sm">
              <Zap className="w-3 h-3" />
              +{question.xpReward} XP
            </Badge>
          </div>
        </div>
        <ProgressBar
          value={currentIndex + 1}
          max={questions.length}
          variant="gradient"
          size="sm"
        />
      </div>

      {/* Question Card */}
      <Card variant="highlight" padding="lg">
        {/* Meta */}
        <div className="flex items-center gap-2 mb-4">
          <TopicBadge 
            topic={topicMeta.name} 
            color={topicMeta.color as 'cyan' | 'purple' | 'green' | 'yellow' | 'magenta' | 'orange'}
          />
          <DifficultyBadge difficulty={question.difficulty} />
        </div>

        {/* Question */}
        <h2 className="text-xl font-semibold text-[var(--foreground)] mb-6">
          {question.question}
        </h2>

        {/* Options */}
        {question.type === 'mcq' && question.options && (
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isCorrectOption = option === question.correctAnswer;
              
              let optionState = 'default';
              if (showResult) {
                if (isCorrectOption) optionState = 'correct';
                else if (isSelected && !isCorrect) optionState = 'incorrect';
              } else if (isSelected) {
                optionState = 'selected';
              }

              return (
                <button
                  key={index}
                  onClick={() => !showResult && setSelectedAnswer(option)}
                  disabled={showResult}
                  className={clsx(
                    'w-full p-4 rounded-xl text-left transition-all duration-200',
                    'border-2',
                    {
                      'border-[var(--card-border)] hover:border-[var(--accent-cyan)]/50 bg-[var(--background-tertiary)]': optionState === 'default',
                      'border-[var(--accent-cyan)] bg-[var(--accent-cyan)]/10': optionState === 'selected',
                      'border-[var(--accent-green)] bg-[var(--accent-green)]/10': optionState === 'correct',
                      'border-[var(--accent-magenta)] bg-[var(--accent-magenta)]/10': optionState === 'incorrect',
                    },
                    showResult && 'cursor-default'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className={clsx(
                      'w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm',
                      {
                        'bg-[var(--background-secondary)] text-[var(--foreground-muted)]': optionState === 'default',
                        'bg-[var(--accent-cyan)] text-white': optionState === 'selected',
                        'bg-[var(--accent-green)] text-white': optionState === 'correct',
                        'bg-[var(--accent-magenta)] text-white': optionState === 'incorrect',
                      }
                    )}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className={clsx(
                      'flex-1',
                      optionState === 'correct' && 'text-[var(--accent-green)] font-medium',
                      optionState === 'incorrect' && 'text-[var(--accent-magenta)]',
                      optionState === 'default' || optionState === 'selected' ? 'text-[var(--foreground)]' : ''
                    )}>
                      {option}
                    </span>
                    {showResult && isCorrectOption && (
                      <CheckCircle2 className="w-5 h-5 text-[var(--accent-green)]" />
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-[var(--accent-magenta)]" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Hint */}
        {!showResult && question.hints && question.hints.length > 0 && (
          <div className="mt-4">
            {showHint ? (
              <div className="p-4 rounded-xl bg-[var(--accent-yellow)]/10 border border-[var(--accent-yellow)]/30">
                <div className="flex items-center gap-2 mb-2 text-[var(--accent-yellow)]">
                  <Lightbulb className="w-4 h-4" />
                  <span className="text-sm font-medium">Hint</span>
                </div>
                <p className="text-sm text-[var(--foreground-muted)]">
                  {question.hints[hintsUsed - 1]}
                </p>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShowHint}
                leftIcon={<Lightbulb className="w-4 h-4" />}
              >
                Show Hint ({question.hints.length - hintsUsed} left)
              </Button>
            )}
          </div>
        )}
      </Card>

      {/* Result/Explanation */}
      {showResult && (
        <Card 
          variant="default" 
          padding="lg"
          className={clsx(
            'border-l-4',
            isCorrect ? 'border-l-[var(--accent-green)]' : 'border-l-[var(--accent-magenta)]'
          )}
        >
          <div className="flex items-start gap-3 mb-4">
            {isCorrect ? (
              <CheckCircle2 className="w-6 h-6 text-[var(--accent-green)] flex-shrink-0" />
            ) : (
              <XCircle className="w-6 h-6 text-[var(--accent-magenta)] flex-shrink-0" />
            )}
            <div>
              <h3 className={clsx(
                'font-semibold mb-1',
                isCorrect ? 'text-[var(--accent-green)]' : 'text-[var(--accent-magenta)]'
              )}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </h3>
              {isCorrect && (
                <div className="flex items-center gap-1 text-sm text-[var(--accent-yellow)]">
                  <Zap className="w-4 h-4" />
                  <span>+{question.xpReward} XP earned</span>
                </div>
              )}
            </div>
          </div>
          <p className="text-[var(--foreground-muted)]">
            {question.explanation}
          </p>
        </Card>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        {!showResult ? (
          <>
            <div className="text-sm text-[var(--foreground-muted)]">
              {selectedAnswer ? 'Answer selected' : 'Select an answer'}
            </div>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={!selectedAnswer}
              rightIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Submit Answer
            </Button>
          </>
        ) : (
          <>
            <div className="text-sm text-[var(--foreground-muted)]">
              {results.filter(r => r.correct).length} of {results.length} correct
            </div>
            <Button
              variant="primary"
              onClick={handleNext}
              rightIcon={isLastQuestion ? <Trophy className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            >
              {isLastQuestion ? 'See Results' : 'Next Question'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

interface QuizResultsProps {
  results: QuizResult[];
  questions: Question[];
  onRetry: () => void;
  onExit: () => void;
}

export function QuizResults({ results, questions, onRetry, onExit }: QuizResultsProps) {
  const correctCount = results.filter(r => r.correct).length;
  const totalXp = results.reduce((sum, r) => {
    if (r.correct) {
      const question = questions.find(q => q.id === r.questionId);
      return sum + (question?.xpReward || 0);
    }
    return sum;
  }, 0);
  const accuracy = Math.round((correctCount / questions.length) * 100);
  const avgTime = Math.round(results.reduce((sum, r) => sum + r.timeSpent, 0) / results.length);

  const getGrade = () => {
    if (accuracy >= 90) return { letter: 'A', color: 'green', message: 'Outstanding!' };
    if (accuracy >= 80) return { letter: 'B', color: 'cyan', message: 'Great job!' };
    if (accuracy >= 70) return { letter: 'C', color: 'yellow', message: 'Good effort!' };
    if (accuracy >= 60) return { letter: 'D', color: 'orange', message: 'Keep practicing!' };
    return { letter: 'F', color: 'magenta', message: 'Needs improvement' };
  };

  const grade = getGrade();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Main Result Card */}
      <Card variant="highlight" padding="lg" className="text-center">
        <div className="mb-6">
          <div className={clsx(
            'w-24 h-24 mx-auto rounded-2xl flex items-center justify-center text-4xl font-bold',
            `bg-[var(--accent-${grade.color})]/20 text-[var(--accent-${grade.color})]`
          )}>
            {grade.letter}
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
          {grade.message}
        </h2>
        <p className="text-[var(--foreground-muted)] mb-6">
          You got {correctCount} out of {questions.length} questions correct
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-[var(--background-tertiary)]">
            <p className="text-2xl font-bold text-[var(--accent-cyan)]">{accuracy}%</p>
            <p className="text-sm text-[var(--foreground-muted)]">Accuracy</p>
          </div>
          <div className="p-4 rounded-xl bg-[var(--background-tertiary)]">
            <p className="text-2xl font-bold text-[var(--accent-yellow)]">+{totalXp}</p>
            <p className="text-sm text-[var(--foreground-muted)]">XP Earned</p>
          </div>
          <div className="p-4 rounded-xl bg-[var(--background-tertiary)]">
            <p className="text-2xl font-bold text-[var(--accent-purple)]">{avgTime}s</p>
            <p className="text-sm text-[var(--foreground-muted)]">Avg Time</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-4">
          <Button variant="secondary" onClick={onRetry} leftIcon={<RotateCcw className="w-4 h-4" />}>
            Try Again
          </Button>
          <Button variant="primary" onClick={onExit}>
            Back to Practice
          </Button>
        </div>
      </Card>

      {/* Question Review */}
      <div>
        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
          Question Review
        </h3>
        <div className="space-y-3">
          {results.map((result, index) => {
            const question = questions.find(q => q.id === result.questionId);
            if (!question) return null;

            return (
              <Card key={result.questionId} variant="default" padding="md">
                <div className="flex items-start gap-3">
                  <div className={clsx(
                    'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                    result.correct 
                      ? 'bg-[var(--accent-green)]/20 text-[var(--accent-green)]'
                      : 'bg-[var(--accent-magenta)]/20 text-[var(--accent-magenta)]'
                  )}>
                    {result.correct ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <XCircle className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[var(--foreground)] mb-1">
                      {index + 1}. {question.title}
                    </p>
                    {!result.correct && (
                      <p className="text-sm text-[var(--foreground-muted)]">
                        Correct: {question.correctAnswer}
                      </p>
                    )}
                  </div>
                  <div className="text-sm text-[var(--foreground-muted)]">
                    {result.timeSpent}s
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}


'use client';

import { useState, useCallback, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useStore } from '@/store/useStore';
import {
  FLASHCARDS,
  FLASHCARD_CATEGORIES,
  getFlashcardsByDifficulty,
  getFlashcardsByCategory,
  getRandomFlashcards,
  type Flashcard,
} from '@/data/flashcards';
import {
  Layers,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Check,
  X,
  BookOpen,
  Zap,
  Filter,
  ArrowRight,
} from 'lucide-react';
import { clsx } from 'clsx';

type DifficultyFilter = 'all' | 'beginner' | 'intermediate' | 'advanced';
type CategoryFilter = 'all' | string;

export default function FlashcardsPage() {
  const { addXp } = useStore();
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('all');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [knownCards, setKnownCards] = useState<Set<string>>(new Set());
  const [reviewCards, setReviewCards] = useState<Set<string>>(new Set());
  const [sessionStarted, setSessionStarted] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Initialize cards
  const initializeCards = useCallback(() => {
    let filtered = [...FLASHCARDS];
    
    if (difficulty !== 'all') {
      filtered = filtered.filter(c => c.difficulty === difficulty);
    }
    
    if (category !== 'all') {
      filtered = filtered.filter(c => c.category === category);
    }
    
    // Shuffle
    filtered.sort(() => Math.random() - 0.5);
    setCards(filtered);
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownCards(new Set());
    setReviewCards(new Set());
  }, [difficulty, category]);

  useEffect(() => {
    initializeCards();
  }, [initializeCards]);

  const currentCard = cards[currentIndex];
  const progress = cards.length > 0 ? ((currentIndex + 1) / cards.length) * 100 : 0;
  const knownCount = knownCards.size;
  const reviewCount = reviewCards.size;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleKnow = () => {
    if (currentCard) {
      setKnownCards(prev => new Set(prev).add(currentCard.id));
      setReviewCards(prev => {
        const next = new Set(prev);
        next.delete(currentCard.id);
        return next;
      });
      // Award XP
      addXp(10);
      handleNext();
    }
  };

  const handleReview = () => {
    if (currentCard) {
      setReviewCards(prev => new Set(prev).add(currentCard.id));
      setKnownCards(prev => {
        const next = new Set(prev);
        next.delete(currentCard.id);
        return next;
      });
      handleNext();
    }
  };

  const handleShuffle = () => {
    initializeCards();
  };

  const handleStartSession = () => {
    initializeCards();
    setSessionStarted(true);
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'beginner': return 'green';
      case 'intermediate': return 'cyan';
      case 'advanced': return 'purple';
      default: return 'cyan';
    }
  };

  // Session not started - show setup screen
  if (!sessionStarted) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <Badge variant="purple" size="md">
            <Layers className="w-4 h-4" />
            FLASHCARDS
          </Badge>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">
            Quick Review Flashcards
          </h1>
          <p className="text-[var(--foreground-muted)]">
            Test your knowledge with bite-sized Q&A cards. Swipe through concepts, mark what you know, and track your progress.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4">
          <Card variant="default" padding="md" className="text-center">
            <div className="text-3xl font-bold text-[var(--accent-cyan)]">
              {FLASHCARDS.filter(f => f.difficulty === 'beginner').length}
            </div>
            <div className="text-sm text-[var(--foreground-muted)]">Beginner</div>
          </Card>
          <Card variant="default" padding="md" className="text-center">
            <div className="text-3xl font-bold text-[var(--accent-purple)]">
              {FLASHCARDS.filter(f => f.difficulty === 'intermediate').length}
            </div>
            <div className="text-sm text-[var(--foreground-muted)]">Intermediate</div>
          </Card>
          <Card variant="default" padding="md" className="text-center">
            <div className="text-3xl font-bold text-[var(--accent-yellow)]">
              {FLASHCARDS.filter(f => f.difficulty === 'advanced').length}
            </div>
            <div className="text-sm text-[var(--foreground-muted)]">Advanced</div>
          </Card>
        </div>

        {/* Filters */}
        <Card variant="default" padding="lg" className="space-y-6">
          <h3 className="text-lg font-semibold text-[var(--foreground)] flex items-center gap-2">
            <Filter className="w-5 h-5 text-[var(--accent-cyan)]" />
            Choose Your Cards
          </h3>

          {/* Difficulty Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-[var(--foreground-muted)]">
              Difficulty Level
            </label>
            <div className="flex flex-wrap gap-2">
              {(['all', 'beginner', 'intermediate', 'advanced'] as DifficultyFilter[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={clsx(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    difficulty === d
                      ? 'bg-[var(--accent-cyan)] text-white'
                      : 'bg-[var(--background-tertiary)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
                  )}
                >
                  {d === 'all' ? 'All Levels' : d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Category Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-[var(--foreground-muted)]">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategory('all')}
                className={clsx(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  category === 'all'
                    ? 'bg-[var(--accent-cyan)] text-white'
                    : 'bg-[var(--background-tertiary)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
                )}
              >
                All Categories
              </button>
              {FLASHCARD_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={clsx(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    category === cat
                      ? 'bg-[var(--accent-cyan)] text-white'
                      : 'bg-[var(--background-tertiary)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Card Count Preview */}
          <div className="p-4 rounded-lg bg-[var(--background-tertiary)]">
            <p className="text-[var(--foreground-muted)]">
              <span className="text-2xl font-bold text-[var(--foreground)] mr-2">
                {cards.length}
              </span>
              cards match your selection
            </p>
          </div>

          {/* Start Button */}
          <Button
            variant="primary"
            size="lg"
            className="w-full justify-center"
            onClick={handleStartSession}
            disabled={cards.length === 0}
            rightIcon={<ArrowRight className="w-5 h-5" />}
          >
            Start Flashcard Session
          </Button>
        </Card>
      </div>
    );
  }

  // Session ended
  if (currentIndex >= cards.length || cards.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[var(--accent-green)] to-[var(--accent-cyan)] flex items-center justify-center">
          <Check className="w-12 h-12 text-white" />
        </div>
        
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
            Session Complete! 🎉
          </h1>
          <p className="text-[var(--foreground-muted)]">
            You've reviewed all {cards.length} cards in this session.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card variant="default" padding="lg" className="text-center">
            <div className="text-4xl font-bold text-[var(--accent-green)] mb-2">
              {knownCount}
            </div>
            <div className="text-[var(--foreground-muted)]">Cards Known</div>
          </Card>
          <Card variant="default" padding="lg" className="text-center">
            <div className="text-4xl font-bold text-[var(--accent-orange)] mb-2">
              {reviewCount}
            </div>
            <div className="text-[var(--foreground-muted)]">Need Review</div>
          </Card>
        </div>

        <div className="text-[var(--accent-yellow)] font-medium">
          +{knownCount * 10} XP earned!
        </div>

        <div className="flex gap-4 justify-center">
          <Button variant="secondary" onClick={() => setSessionStarted(false)}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Change Settings
          </Button>
          <Button variant="primary" onClick={handleShuffle}>
            <Shuffle className="w-4 h-4 mr-2" />
            Review Again
          </Button>
        </div>
      </div>
    );
  }

  // Active session
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="purple" size="md">
            <Layers className="w-4 h-4" />
            FLASHCARDS
          </Badge>
          <Badge variant={getDifficultyColor(currentCard?.difficulty || 'beginner') as 'green' | 'cyan' | 'purple'} size="sm">
            {currentCard?.difficulty}
          </Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setSessionStarted(false)}>
          Exit Session
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-[var(--foreground-muted)]">
          <span>Card {currentIndex + 1} of {cards.length}</span>
          <span className="flex items-center gap-4">
            <span className="text-[var(--accent-green)]">✓ {knownCount}</span>
            <span className="text-[var(--accent-orange)]">⟳ {reviewCount}</span>
          </span>
        </div>
        <div className="h-2 bg-[var(--background-tertiary)] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-purple)] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Category Tag */}
      <div className="text-center">
        <span className="text-sm text-[var(--foreground-muted)]">
          {currentCard?.category}
        </span>
      </div>

      {/* Flashcard */}
      <div
        className="perspective-1000 cursor-pointer"
        onClick={handleFlip}
      >
        <div
          className={clsx(
            'relative w-full min-h-[320px] transition-transform duration-500 transform-style-3d',
            isFlipped && 'rotate-y-180'
          )}
        >
          {/* Front */}
          <Card
            variant="highlight"
            padding="lg"
            className={clsx(
              'absolute inset-0 backface-hidden flex flex-col items-center justify-center text-center',
              isFlipped && 'invisible'
            )}
          >
            <div className="mb-4">
              <BookOpen className="w-8 h-8 text-[var(--accent-cyan)]" />
            </div>
            <h2 className="text-xl font-semibold text-[var(--foreground)] leading-relaxed">
              {currentCard?.front}
            </h2>
            <p className="text-sm text-[var(--foreground-muted)] mt-6">
              Click to reveal answer
            </p>
          </Card>

          {/* Back */}
          <Card
            variant="highlight"
            padding="lg"
            className={clsx(
              'absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-center text-center',
              !isFlipped && 'invisible'
            )}
          >
            <div className="mb-4">
              <Zap className="w-8 h-8 text-[var(--accent-yellow)]" />
            </div>
            <p className="text-lg text-[var(--foreground)] leading-relaxed whitespace-pre-line">
              {currentCard?.back}
            </p>
            <div className="flex flex-wrap gap-2 mt-6">
              {currentCard?.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs rounded-md bg-[var(--background-tertiary)] text-[var(--foreground-muted)]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button
          variant="secondary"
          size="lg"
          onClick={handleReview}
          className="flex-1 max-w-[180px] justify-center"
        >
          <X className="w-5 h-5 mr-2 text-[var(--accent-orange)]" />
          Need Review
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={handleKnow}
          className="flex-1 max-w-[180px] justify-center"
        >
          <Check className="w-5 h-5 mr-2" />
          Got It!
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>
        <Button variant="ghost" size="sm" onClick={handleShuffle}>
          <Shuffle className="w-4 h-4 mr-1" />
          Shuffle
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* CSS for 3D flip effect */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}


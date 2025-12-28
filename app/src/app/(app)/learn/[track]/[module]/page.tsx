'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge, DifficultyBadge } from '@/components/ui/Badge';
import { getModuleById, getSkillTrackById } from '@/data/learning-modules';
import { useStore, useUserProgress } from '@/store/useStore';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Zap,
  Code,
  FileText,
  Trophy,
} from 'lucide-react';
import { clsx } from 'clsx';
import type { SkillLevel } from '@/types';

export default function ModulePage({ 
  params 
}: { 
  params: Promise<{ track: string; module: string }> 
}) {
  const resolvedParams = use(params);
  const trackId = resolvedParams.track as SkillLevel;
  const moduleId = resolvedParams.module;
  
  const track = getSkillTrackById(trackId);
  const module = getModuleById(moduleId);
  const router = useRouter();
  const { completeModule, addXp } = useStore();
  const userProgress = useUserProgress();
  
  const [currentSection, setCurrentSection] = useState(0);
  const [sectionsCompleted, setSectionsCompleted] = useState<Set<number>>(new Set());

  if (!track || !module) {
    notFound();
  }

  const isModuleCompleted = userProgress.completedModules.includes(module.id);
  const section = module.sections[currentSection];
  const isLastSection = currentSection === module.sections.length - 1;

  const handleNextSection = () => {
    setSectionsCompleted(prev => new Set([...prev, currentSection]));
    
    if (isLastSection) {
      // Complete module
      if (!isModuleCompleted) {
        completeModule(module.id);
        addXp(module.xpReward, module.category);
      }
    } else {
      setCurrentSection(prev => prev + 1);
    }
  };

  const handlePrevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    }
  };

  // Render content based on type
  const renderContent = () => {
    if (section.type === 'code' && section.codeExample) {
      return (
        <div className="space-y-4">
          <div 
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: formatContent(section.content) }}
          />
          
          <div className="rounded-xl overflow-hidden border border-[var(--card-border)]">
            {/* Code header */}
            <div className="flex items-center justify-between px-4 py-2 bg-[var(--background-tertiary)] border-b border-[var(--card-border)]">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-[var(--accent-cyan)]" />
                <span className="text-sm font-medium text-[var(--foreground)]">
                  {section.codeExample.description}
                </span>
              </div>
              <Badge variant="cyan" size="sm">
                {section.codeExample.language.toUpperCase()}
              </Badge>
            </div>
            
            {/* Code content */}
            <pre className="p-4 overflow-x-auto bg-[#0d1117] text-sm">
              <code className="text-[var(--foreground)] font-mono leading-relaxed whitespace-pre">
                {section.codeExample.code}
              </code>
            </pre>
          </div>
        </div>
      );
    }

    return (
      <div 
        className="prose prose-invert max-w-none prose-headings:text-[var(--foreground)] prose-p:text-[var(--foreground-muted)] prose-strong:text-[var(--foreground)] prose-code:text-[var(--accent-cyan)] prose-code:bg-[var(--background-tertiary)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-[var(--card-border)]"
        dangerouslySetInnerHTML={{ __html: formatContent(section.content) }}
      />
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link 
          href={`/learn/${trackId}`}
          className="inline-flex items-center gap-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {track.title}</span>
        </Link>
        
        <div className="flex items-center gap-2">
          <Badge variant="cyan" size="sm">
            <Zap className="w-3 h-3" />
            +{module.xpReward} XP
          </Badge>
          <DifficultyBadge difficulty={module.difficulty} size="sm" />
        </div>
      </div>

      {/* Module Header */}
      <Card variant="highlight" padding="lg">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-purple)] flex items-center justify-center text-2xl flex-shrink-0">
            {track.icon}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
              {module.title}
            </h1>
            <p className="text-[var(--foreground-muted)]">
              {module.description}
            </p>
            <div className="flex items-center gap-4 mt-3 text-sm text-[var(--foreground-muted)]">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{module.estimatedTime} min</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>{module.sections.length} sections</span>
              </div>
              {isModuleCompleted && (
                <div className="flex items-center gap-1.5 text-[var(--accent-green)]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Completed</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--foreground-muted)]">
            Section {currentSection + 1} of {module.sections.length}
          </span>
          <span className="text-[var(--foreground)]">
            {Math.round(((currentSection + 1) / module.sections.length) * 100)}%
          </span>
        </div>
        <ProgressBar
          value={currentSection + 1}
          max={module.sections.length}
          variant="gradient"
          size="sm"
        />
      </div>

      {/* Section Navigation Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {module.sections.map((sec, index) => (
          <button
            key={sec.id}
            onClick={() => setCurrentSection(index)}
            className={clsx(
              'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
              currentSection === index
                ? 'bg-[var(--accent-cyan)] text-white'
                : sectionsCompleted.has(index)
                ? 'bg-[var(--accent-green)]/20 text-[var(--accent-green)] border border-[var(--accent-green)]/30'
                : 'bg-[var(--background-tertiary)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
            )}
          >
            {sec.title}
          </button>
        ))}
      </div>

      {/* Content Card */}
      <Card variant="default" padding="lg">
        <div className="flex items-center gap-2 mb-6">
          {section.type === 'code' ? (
            <Code className="w-5 h-5 text-[var(--accent-cyan)]" />
          ) : (
            <FileText className="w-5 h-5 text-[var(--accent-purple)]" />
          )}
          <h2 className="text-xl font-semibold text-[var(--foreground)]">
            {section.title}
          </h2>
        </div>
        
        {renderContent()}
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="secondary"
          onClick={handlePrevSection}
          disabled={currentSection === 0}
          leftIcon={<ChevronLeft className="w-4 h-4" />}
        >
          Previous
        </Button>

        {isLastSection ? (
          <Button
            variant="primary"
            onClick={handleNextSection}
            rightIcon={isModuleCompleted ? <ArrowRight className="w-4 h-4" /> : <Trophy className="w-4 h-4" />}
          >
            {isModuleCompleted ? 'Review Complete' : `Complete & Earn ${module.xpReward} XP`}
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleNextSection}
            rightIcon={<ChevronRight className="w-4 h-4" />}
          >
            Next Section
          </Button>
        )}
      </div>

      {/* Completion Celebration */}
      {isLastSection && sectionsCompleted.has(currentSection) && (
        <Card variant="highlight" padding="lg" className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[var(--accent-green)] to-[var(--accent-cyan)] flex items-center justify-center">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-[var(--foreground)] mb-2">
            {isModuleCompleted ? 'Module Already Completed!' : 'Congratulations! 🎉'}
          </h3>
          <p className="text-[var(--foreground-muted)] mb-4">
            {isModuleCompleted 
              ? 'You\'ve already earned XP for this module.'
              : `You've earned ${module.xpReward} XP for completing "${module.title}"!`
            }
          </p>
          
          <Link href={`/learn/${trackId}`}>
            <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Back to {track.title}
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
}

// Helper function to format markdown-like content to HTML
function formatContent(content: string): string {
  return content
    // Headers
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Code blocks (preserve them)
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
    // Lists
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    // Numbered lists
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    // Tables (basic support)
    .replace(/\|(.+)\|/g, (match) => {
      const cells = match.split('|').filter(c => c.trim());
      const isHeader = match.includes('---');
      if (isHeader) return '';
      return `<tr>${cells.map(c => `<td>${c.trim()}</td>`).join('')}</tr>`;
    })
    // Paragraphs (double newlines)
    .replace(/\n\n/g, '</p><p>')
    // Single newlines in paragraphs
    .replace(/\n(?!<)/g, '<br/>')
    // Wrap in paragraph
    .replace(/^(?!<)/, '<p>')
    .replace(/(?!>)$/, '</p>');
}


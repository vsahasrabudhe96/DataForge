'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge, DifficultyBadge } from '@/components/ui/Badge';
import { getModuleById, getSkillTrackById, getModulesBySkillLevel, getTopicsBySkillLevel } from '@/data/learning-modules';
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
  List,
  Lightbulb,
  AlertCircle,
  Info,
  Copy,
  Check,
} from 'lucide-react';
import { clsx } from 'clsx';
import type { SkillLevel, LearningModule } from '@/types';

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
  const [showToc, setShowToc] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Get all modules in this track for navigation
  const allModules = getModulesBySkillLevel(trackId);
  const currentModuleIndex = allModules.findIndex(m => m.id === moduleId);
  const nextModule = allModules[currentModuleIndex + 1];
  const prevModule = allModules[currentModuleIndex - 1];

  if (!track || !module) {
    notFound();
  }

  const isModuleCompleted = userProgress.completedModules.includes(module.id);
  const section = module.sections[currentSection];
  const isLastSection = currentSection === module.sections.length - 1;
  const allSectionsCompleted = sectionsCompleted.size === module.sections.length || 
    (sectionsCompleted.size === module.sections.length - 1 && currentSection === module.sections.length - 1);

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
      // Scroll to top of content
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Render content based on type
  const renderContent = () => {
    if (section.type === 'code' && section.codeExample) {
      return (
        <div className="space-y-6">
          {/* Introduction text */}
          <div className="prose-content">
            {renderMarkdown(section.content)}
          </div>
          
          {/* Code block with enhanced styling */}
          <div className="rounded-xl overflow-hidden border border-[var(--card-border)] shadow-lg">
            {/* Code header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[var(--background-tertiary)] border-b border-[var(--card-border)]">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
                </div>
                <span className="text-sm font-medium text-[var(--foreground)]">
                  {section.codeExample.description}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="cyan" size="sm">
                  {section.codeExample.language.toUpperCase()}
                </Badge>
                <button
                  onClick={() => handleCopyCode(section.codeExample!.code, section.id)}
                  className="p-2 rounded-lg hover:bg-[var(--background-secondary)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
                  title="Copy code"
                >
                  {copiedCode === section.id ? (
                    <Check className="w-4 h-4 text-[var(--accent-green)]" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            
            {/* Code content with line numbers */}
            <div className="relative">
              <pre className="p-4 overflow-x-auto bg-[#0d1117] text-sm leading-relaxed">
                <code className="text-[var(--foreground)] font-mono whitespace-pre">
                  {section.codeExample.code.split('\n').map((line, i) => (
                    <div key={i} className="table-row">
                      <span className="table-cell pr-4 text-right text-[var(--foreground-muted)]/40 select-none w-8">
                        {i + 1}
                      </span>
                      <span className="table-cell">{highlightSQL(line)}</span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="prose-content">
        {renderMarkdown(section.content)}
      </div>
    );
  };

  return (
    <div className="flex gap-8">
      {/* Table of Contents Sidebar */}
      <aside className={clsx(
        'hidden lg:block w-64 flex-shrink-0 sticky top-24 h-fit max-h-[calc(100vh-8rem)] overflow-y-auto',
        'transition-all duration-300',
        !showToc && 'lg:hidden'
      )}>
        <Card variant="default" padding="md" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[var(--foreground)] flex items-center gap-2">
              <List className="w-4 h-4 text-[var(--accent-cyan)]" />
              Contents
            </h3>
            <span className="text-xs text-[var(--foreground-muted)]">
              {sectionsCompleted.size}/{module.sections.length}
            </span>
          </div>
          
          <nav className="space-y-1">
            {module.sections.map((sec, index) => {
              const isActive = currentSection === index;
              const isCompleted = sectionsCompleted.has(index);
              
              return (
                <button
                  key={sec.id}
                  onClick={() => setCurrentSection(index)}
                  className={clsx(
                    'w-full text-left px-3 py-2 rounded-lg text-sm transition-all',
                    'flex items-center gap-2',
                    isActive
                      ? 'bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan)] font-medium'
                      : isCompleted
                      ? 'text-[var(--accent-green)] hover:bg-[var(--background-tertiary)]'
                      : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-tertiary)]'
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <div className={clsx(
                      'w-4 h-4 rounded-full border flex-shrink-0',
                      isActive ? 'border-[var(--accent-cyan)] bg-[var(--accent-cyan)]' : 'border-[var(--card-border)]'
                    )} />
                  )}
                  <span className="truncate">{sec.title}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Stats */}
          <div className="pt-4 border-t border-[var(--card-border)] space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--foreground-muted)]">Time</span>
              <span className="text-[var(--foreground)] flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {module.estimatedTime} min
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--foreground-muted)]">XP Reward</span>
              <span className="text-[var(--accent-yellow)] font-medium flex items-center gap-1">
                <Zap className="w-3 h-3" />
                +{module.xpReward}
              </span>
            </div>
          </div>
        </Card>
      </aside>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between">
          <Link 
            href={`/learn/${trackId}`}
            className="inline-flex items-center gap-2 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{track.title}</span>
            <span className="sm:hidden">Back</span>
          </Link>
          
          <div className="flex items-center gap-2">
            {isModuleCompleted && (
              <Badge variant="green" size="sm">
                <CheckCircle2 className="w-3 h-3" />
                Completed
              </Badge>
            )}
            <DifficultyBadge difficulty={module.difficulty} size="sm" />
          </div>
        </div>

        {/* Module Header */}
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-purple)] flex items-center justify-center text-2xl flex-shrink-0 shadow-lg shadow-[var(--accent-cyan)]/20">
              {track.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] mb-2">
                {module.title}
              </h1>
              <p className="text-[var(--foreground-muted)] text-base">
                {module.description}
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--foreground-muted)]">
                Section {currentSection + 1} of {module.sections.length}: <span className="text-[var(--foreground)]">{section.title}</span>
              </span>
              <span className="text-[var(--accent-cyan)] font-medium">
                {Math.round(((sectionsCompleted.size + (allSectionsCompleted ? 1 : 0)) / module.sections.length) * 100)}%
              </span>
            </div>
            <ProgressBar
              value={sectionsCompleted.size + (allSectionsCompleted ? 1 : 0)}
              max={module.sections.length}
              variant="gradient"
              size="sm"
            />
          </div>
        </div>

        {/* Content Card */}
        <Card variant="default" padding="lg" className="min-h-[400px]">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--card-border)]">
            {section.type === 'code' ? (
              <div className="w-10 h-10 rounded-lg bg-[var(--accent-cyan)]/10 flex items-center justify-center">
                <Code className="w-5 h-5 text-[var(--accent-cyan)]" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-lg bg-[var(--accent-purple)]/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-[var(--accent-purple)]" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)]">
                {section.title}
              </h2>
              <p className="text-sm text-[var(--foreground-muted)]">
                {section.type === 'code' ? 'Code Example' : 'Study Material'}
              </p>
            </div>
          </div>
          
          {renderContent()}
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="secondary"
            onClick={handlePrevSection}
            disabled={currentSection === 0}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
            className="flex-1 sm:flex-none"
          >
            <span className="hidden sm:inline">Previous</span>
          </Button>

          {isLastSection ? (
            <Button
              variant="primary"
              onClick={handleNextSection}
              rightIcon={isModuleCompleted ? <ArrowRight className="w-4 h-4" /> : <Trophy className="w-4 h-4" />}
              className="flex-1 sm:flex-none"
            >
              <span className="hidden sm:inline">
                {isModuleCompleted ? 'Review Complete' : `Complete & Earn ${module.xpReward} XP`}
              </span>
              <span className="sm:hidden">
                {isModuleCompleted ? 'Done' : `+${module.xpReward} XP`}
              </span>
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleNextSection}
              rightIcon={<ChevronRight className="w-4 h-4" />}
              className="flex-1 sm:flex-none"
            >
              <span className="hidden sm:inline">Next Section</span>
              <span className="sm:hidden">Next</span>
            </Button>
          )}
        </div>

        {/* Completion Celebration */}
        {allSectionsCompleted && (
          <Card variant="highlight" padding="lg" className="text-center space-y-6">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[var(--accent-green)] to-[var(--accent-cyan)] flex items-center justify-center shadow-lg shadow-[var(--accent-green)]/30">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-[var(--foreground)] mb-2">
                {isModuleCompleted ? 'Module Already Completed!' : 'Congratulations! 🎉'}
              </h3>
              <p className="text-[var(--foreground-muted)]">
                {isModuleCompleted 
                  ? 'You\'ve already earned XP for this module.'
                  : `You've earned ${module.xpReward} XP for completing "${module.title}"!`
                }
              </p>
            </div>

            {/* Next Steps */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {nextModule ? (
                <Link href={`/learn/${trackId}/${nextModule.id}`}>
                  <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Next: {nextModule.title}
                  </Button>
                </Link>
              ) : (
                <Link href={`/learn/${trackId}`}>
                  <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Back to {track.title}
                  </Button>
                </Link>
              )}
              
              <Link href="/flashcards">
                <Button variant="secondary">
                  Practice with Flashcards
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {/* Module Navigation */}
        {(prevModule || nextModule) && !allSectionsCompleted && (
          <div className="flex justify-between pt-4 border-t border-[var(--card-border)]">
            {prevModule ? (
              <Link 
                href={`/learn/${trackId}/${prevModule.id}`}
                className="flex items-center gap-2 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">{prevModule.title}</span>
                <span className="sm:hidden">Previous Module</span>
              </Link>
            ) : <div />}
            
            {nextModule && (
              <Link 
                href={`/learn/${trackId}/${nextModule.id}`}
                className="flex items-center gap-2 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
              >
                <span className="hidden sm:inline">{nextModule.title}</span>
                <span className="sm:hidden">Next Module</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// Enhanced markdown renderer
function renderMarkdown(content: string) {
  // Process the content into structured elements
  const lines = content.split('\n');
  const elements: React.ReactElement[] = [];
  let currentList: string[] = [];
  let currentNumberedList: string[] = [];
  let currentTable: string[][] = [];
  let inTable = false;
  let listKey = 0;
  let tableKey = 0;

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`ul-${listKey++}`} className="space-y-2 my-4">
          {currentList.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[var(--foreground-muted)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-cyan)] mt-2 flex-shrink-0" />
              <span dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  const flushNumberedList = () => {
    if (currentNumberedList.length > 0) {
      elements.push(
        <ol key={`ol-${listKey++}`} className="space-y-2 my-4">
          {currentNumberedList.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[var(--foreground-muted)]">
              <span className="w-6 h-6 rounded-lg bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan)] text-sm font-bold flex items-center justify-center flex-shrink-0">
                {i + 1}
              </span>
              <span dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            </li>
          ))}
        </ol>
      );
      currentNumberedList = [];
    }
  };

  const flushTable = () => {
    if (currentTable.length > 0) {
      const [header, ...rows] = currentTable.filter(row => !row.every(cell => cell.includes('---')));
      elements.push(
        <div key={`table-${tableKey++}`} className="my-6 overflow-x-auto rounded-xl border border-[var(--card-border)]">
          <table className="w-full text-sm">
            <thead className="bg-[var(--background-tertiary)]">
              <tr>
                {header?.map((cell, i) => (
                  <th key={i} className="px-4 py-3 text-left font-semibold text-[var(--foreground)] border-b border-[var(--card-border)]">
                    {cell.trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-[var(--card-border)] last:border-0">
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-3 text-[var(--foreground-muted)]">
                      <span dangerouslySetInnerHTML={{ __html: formatInline(cell.trim()) }} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      currentTable = [];
      inTable = false;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    
    // Handle tables
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      flushList();
      flushNumberedList();
      inTable = true;
      const cells = trimmed.split('|').filter(c => c !== '');
      currentTable.push(cells);
      return;
    } else if (inTable) {
      flushTable();
    }

    // Handle headers
    if (trimmed.startsWith('**') && trimmed.endsWith('**') && !trimmed.slice(2, -2).includes('**')) {
      flushList();
      flushNumberedList();
      const text = trimmed.slice(2, -2);
      elements.push(
        <h3 key={index} className="text-lg font-bold text-[var(--foreground)] mt-6 mb-3 flex items-center gap-2">
          {text}
        </h3>
      );
      return;
    }

    // Handle bullet lists
    if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
      flushNumberedList();
      currentList.push(trimmed.slice(2));
      return;
    }

    // Handle numbered lists
    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (numberedMatch) {
      flushList();
      currentNumberedList.push(numberedMatch[2]);
      return;
    }

    // Handle special callouts
    if (trimmed.startsWith('✅') || trimmed.startsWith('❌') || trimmed.startsWith('💡') || trimmed.startsWith('⚠️')) {
      flushList();
      flushNumberedList();
      const isPositive = trimmed.startsWith('✅');
      const isNegative = trimmed.startsWith('❌');
      const isTip = trimmed.startsWith('💡');
      const isWarning = trimmed.startsWith('⚠️');
      
      let bgColor = 'bg-[var(--background-tertiary)]';
      let borderColor = 'border-[var(--card-border)]';
      let icon = null;
      
      if (isPositive) {
        bgColor = 'bg-[var(--accent-green)]/10';
        borderColor = 'border-[var(--accent-green)]/30';
        icon = <CheckCircle2 className="w-5 h-5 text-[var(--accent-green)]" />;
      } else if (isNegative) {
        bgColor = 'bg-red-500/10';
        borderColor = 'border-red-500/30';
        icon = <AlertCircle className="w-5 h-5 text-red-400" />;
      } else if (isTip) {
        bgColor = 'bg-[var(--accent-yellow)]/10';
        borderColor = 'border-[var(--accent-yellow)]/30';
        icon = <Lightbulb className="w-5 h-5 text-[var(--accent-yellow)]" />;
      } else if (isWarning) {
        bgColor = 'bg-[var(--accent-orange)]/10';
        borderColor = 'border-[var(--accent-orange)]/30';
        icon = <AlertCircle className="w-5 h-5 text-[var(--accent-orange)]" />;
      }
      
      elements.push(
        <div key={index} className={`flex items-start gap-3 p-4 rounded-xl ${bgColor} border ${borderColor} my-3`}>
          {icon}
          <span className="text-[var(--foreground-muted)]" dangerouslySetInnerHTML={{ __html: formatInline(trimmed.slice(2)) }} />
        </div>
      );
      return;
    }

    // Handle code blocks
    if (trimmed.startsWith('```')) {
      flushList();
      flushNumberedList();
      return; // Code blocks handled separately
    }

    // Handle empty lines
    if (trimmed === '') {
      flushList();
      flushNumberedList();
      return;
    }

    // Regular paragraph
    flushList();
    flushNumberedList();
    elements.push(
      <p key={index} className="text-[var(--foreground-muted)] leading-relaxed my-3">
        <span dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
      </p>
    );
  });

  flushList();
  flushNumberedList();
  flushTable();

  return <>{elements}</>;
}

// Format inline elements (bold, code, links)
function formatInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-[var(--foreground)] font-semibold">$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-[var(--background-tertiary)] text-[var(--accent-cyan)] text-sm font-mono">$1</code>')
    .replace(/→/g, '<span class="text-[var(--accent-cyan)]">→</span>');
}

// Basic SQL syntax highlighting
function highlightSQL(line: string): React.ReactElement {
  const keywords = /\b(SELECT|FROM|WHERE|JOIN|LEFT|RIGHT|INNER|OUTER|ON|AND|OR|NOT|IN|BETWEEN|LIKE|AS|GROUP BY|ORDER BY|HAVING|LIMIT|OFFSET|UNION|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|INDEX|PRIMARY KEY|FOREIGN KEY|REFERENCES|DROP|ALTER|ADD|COLUMN|DEFAULT|NOT NULL|UNIQUE|CHECK|CONSTRAINT|CASCADE|SERIAL|BIGSERIAL|INT|INTEGER|VARCHAR|TEXT|DECIMAL|DATE|TIMESTAMP|BOOLEAN|TRUE|FALSE|NULL|CASE|WHEN|THEN|ELSE|END|WITH|DISTINCT|COUNT|SUM|AVG|MIN|MAX|COALESCE|NULLIF|CURRENT_TIMESTAMP|CURRENT_DATE|MERGE|MATCHED|TRUNCATE|REINDEX|BEGIN|COMMIT|ROLLBACK|TRANSACTION|DECLARE|EXCEPTION|RAISE)\b/gi;
  const comments = /(--.*$)/gm;
  const strings = /('[^']*')/g;
  const numbers = /\b(\d+)\b/g;

  let highlighted = line
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(comments, '<span class="text-[#6a9955]">$1</span>')
    .replace(strings, '<span class="text-[#ce9178]">$1</span>')
    .replace(keywords, '<span class="text-[#569cd6]">$1</span>')
    .replace(numbers, '<span class="text-[#b5cea8]">$1</span>');

  return <span dangerouslySetInnerHTML={{ __html: highlighted }} />;
}

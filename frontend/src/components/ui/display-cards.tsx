import React from 'react';
import { cn } from '@/lib/utils';
import {
  ExternalLink,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react';

export interface DisplayCardProps {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  date?: string;
  category?: string;
  ministry?: string;
  schemeType?: 'central' | 'state' | string;
  status?: 'Potential Match' | 'More Information Needed' | 'Some Criteria Not Met' | string;
  statusVariant?: 'match' | 'unknown' | 'unmet';
  benefitHighlight?: string;
  actionLabel?: string;
  onAction?: () => void;
  onClick?: () => void;
  officialUrl?: string;
  officialLabel?: string;
  badge?: React.ReactNode;
  iconClassName?: string;
  titleClassName?: string;
  children?: React.ReactNode;
}

export interface DisplayCardsProps {
  cards?: DisplayCardProps[];
  className?: string;
  children?: React.ReactNode;
  mode?: 'grid' | 'stacked';
}

export const DisplayCard: React.FC<DisplayCardProps> = ({
  className,
  icon,
  title,
  description,
  date,
  category,
  ministry,
  schemeType,
  status = 'Potential Match',
  statusVariant,
  benefitHighlight,
  actionLabel = 'View Details',
  onAction,
  onClick,
  officialUrl,
  officialLabel = 'Official Portal',
  badge,
  iconClassName,
  titleClassName,
  children
}) => {
  // Determine variant styling based on status
  const getStatusBadge = () => {
    if (badge) return badge;

    if (statusVariant === 'match' || status.includes('Potential') || status.includes('Likely') || status.includes('Eligible')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#ECFDF3] dark:bg-emerald-950/60 text-[#027A48] dark:text-emerald-300 border border-[#ABEFC6] dark:border-emerald-700/60 shadow-xs">
          <CheckCircle2 className="h-3 w-3 shrink-0" />
          <span>{status || 'Potential Match'}</span>
        </span>
      );
    }
    if (statusVariant === 'unmet' || status.includes('Not Met') || status.includes('Unmet') || status.includes('Near Miss')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 shadow-xs">
          <AlertCircle className="h-3 w-3 shrink-0" />
          <span>{status || 'Some Criteria Not Met'}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#FFFAEB] dark:bg-amber-950/40 text-[#B54708] dark:text-amber-400 border border-[#FEDF89] dark:border-amber-700/50 shadow-xs">
        <HelpCircle className="h-3 w-3 shrink-0" />
        <span>{status || 'More Information Needed'}</span>
      </span>
    );
  };

  // State-conditional border/glow with enhanced hover elevations
  const stateClasses =
    statusVariant === 'match'
      ? 'border-emerald-300/80 dark:border-emerald-800/70 hover:border-emerald-500 dark:hover:border-emerald-500/80 hover:shadow-lg dark:hover:shadow-[0_0_28px_-4px_rgba(52,211,153,0.22)]'
      : statusVariant === 'unmet'
      ? 'border-amber-300 dark:border-amber-600/70 hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-lg dark:hover:shadow-[0_0_24px_-4px_rgba(245,158,11,0.25)]'
      : 'border-[#E1E7EF] dark:border-slate-800/90 hover:border-[#173B67] dark:hover:border-teal-600/70 hover:shadow-lg dark:hover:shadow-[0_0_24px_-4px_rgba(45,212,191,0.18)]';

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative rounded-2xl bg-white dark:bg-slate-900/80 border p-5 sm:p-6 shadow-sm transition-all duration-300 ease-out flex flex-col justify-between text-[#263445] dark:text-slate-200 text-left focus-within:ring-2 focus-within:ring-[#173B67] dark:focus-within:ring-teal-500 focus-within:ring-offset-2 hover:-translate-y-1',
        stateClasses,
        onClick ? 'cursor-pointer' : '',
        className
      )}
    >
      <div>
        {/* Top Meta: Icon, Ministry, Scheme Type & Status Badge */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={cn(
                'h-9 w-9 rounded-xl bg-[#EAF2FA] dark:bg-teal-950/50 border border-[#CBDFF5] dark:border-teal-900/60 flex items-center justify-center text-[#173B67] dark:text-teal-300 shrink-0 transition-colors group-hover:bg-[#DDF1FA] dark:group-hover:bg-teal-900/40 shadow-xs',
                iconClassName
              )}
            >
              {icon || <Sparkles className="h-4 w-4 text-[#168A83] dark:text-teal-400" />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                {schemeType && (
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border shadow-xs shrink-0',
                      schemeType.toLowerCase().includes('state')
                        ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60'
                        : 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800/60'
                    )}
                  >
                    {schemeType.toLowerCase().includes('state') ? '📍 State' : '🏛️ Central'}
                  </span>
                )}
                {(ministry || category) && (
                  <span className="text-[11px] font-medium text-[#667085] dark:text-slate-400 truncate block">
                    {ministry || category}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="shrink-0">{getStatusBadge()}</div>
        </div>

        {/* Scheme Title */}
        {title && (
          <h3
            className={cn(
              'text-base sm:text-lg font-bold text-[#173B67] dark:text-white mb-2 leading-snug group-hover:text-[#112C4E] dark:group-hover:text-teal-200 transition-colors font-heading',
              titleClassName
            )}
          >
            {title}
          </h3>
        )}

        {/* Scheme Description */}
        {description && (
          <p className="text-xs sm:text-sm text-[#667085] dark:text-slate-400 leading-relaxed line-clamp-3 mb-4">
            {description}
          </p>
        )}

        {/* Benefit Highlight — prominent accent display */}
        {benefitHighlight && (
          <div className="mb-4 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-teal-500/5 dark:from-teal-950/50 dark:via-emerald-950/40 dark:to-slate-900 border border-teal-200/80 dark:border-teal-800/60 flex items-center justify-between gap-2 text-xs shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 shrink-0 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
              Benefit
            </span>
            <span className="font-extrabold text-emerald-800 dark:text-emerald-300 text-right text-xs sm:text-sm font-mono tracking-tight">
              {benefitHighlight}
            </span>
          </div>
        )}

        {/* Custom Body Children */}
        {children}
      </div>

      {/* Bottom Footer Actions */}
      <div className="pt-4 border-t border-[#E1E7EF] dark:border-slate-800/70 mt-auto flex items-center justify-between gap-3 text-xs">
        {/* Verification Date or Source Portal */}
        {date ? (
          <span className="text-[11px] text-[#667085] dark:text-slate-500">Verified: {date}</span>
        ) : officialUrl ? (
          <a
            href={officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#168A83] dark:text-teal-400 hover:text-[#116e68] dark:hover:text-teal-300 hover:underline"
          >
            <span>{officialLabel}</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <span className="text-[11px] text-[#667085] dark:text-slate-500">Government Scheme</span>
        )}

        {/* Primary Action Button */}
        {actionLabel && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onAction) onAction();
              else if (onClick) onClick();
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#173B67] dark:bg-teal-600 hover:bg-[#112C4E] dark:hover:bg-teal-500 text-white font-bold text-xs tracking-wide shadow-sm transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>{actionLabel}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

export const DisplayCards: React.FC<DisplayCardsProps> = ({
  cards,
  className,
  children,
  mode = 'grid'
}) => {
  // If children provided, render children inside container
  if (children) {
    if (mode === 'stacked') {
      return (
        <div
          className={cn(
            'grid [grid-template-columns:1fr] relative w-full max-w-sm mx-auto',
            className
          )}
        >
          {children}
        </div>
      );
    }
    return (
      <div
        className={cn(
          'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5',
          className
        )}
      >
        {children}
      </div>
    );
  }

  // If cards array provided
  if (!cards || cards.length === 0) {
    return null;
  }

  if (mode === 'stacked') {
    return (
      <div
        className={cn(
          'grid [grid-template-columns:1fr] relative w-full max-w-sm mx-auto',
          className
        )}
      >
        {cards.slice(0, 3).map((cardProps, index) => {
          // Subtle stacking transforms for up to 3 cards
          const stackTransforms = [
            'z-30 [grid-area:1/1]',
            'z-20 [grid-area:1/1] sm:translate-x-3 sm:translate-y-3 opacity-95',
            'z-10 [grid-area:1/1] sm:translate-x-6 sm:translate-y-6 opacity-90'
          ][index];

          return (
            <DisplayCard
              key={index}
              {...cardProps}
              className={cn(stackTransforms, cardProps.className)}
            />
          );
        })}
      </div>
    );
  }

  // Standard responsive grid for main results discovery
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5',
        className
      )}
    >
      {cards.map((cardProps, index) => (
        <DisplayCard key={index} {...cardProps} />
      ))}
    </div>
  );
};

export default DisplayCards;

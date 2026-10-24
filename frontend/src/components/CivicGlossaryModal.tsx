import React, { useState } from 'react';
import { CIVIC_GLOSSARY, CivicTerm } from '../data/glossary';
import { Language, TRANSLATIONS } from '../data/translations';
import { X, BookOpen, Search } from 'lucide-react';

interface CivicGlossaryModalProps {
  isOpen: boolean;
  currentLang: Language;
  onClose: () => void;
}

export const CivicGlossaryModal: React.FC<CivicGlossaryModalProps> = ({
  isOpen,
  currentLang,
  onClose
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[currentLang];
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTerms = CIVIC_GLOSSARY.filter(term =>
    term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (term.hindiTerm && term.hindiTerm.includes(searchQuery)) ||
    term.shortDefinition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#263445]/50 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-xl bg-white border border-[#E1E7EF] shadow-2xl p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-lg bg-[#F5F8FC] hover:bg-[#EAF2FA] text-[#667085] hover:text-[#173B67] transition-all cursor-pointer"
          aria-label="Close glossary"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-lg bg-[#EAF2FA] border border-[#CBDFF5] flex items-center justify-center text-[#173B67]">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#168A83]">
              {t.glossaryBadge || 'Citizen Plain-Language Guide'}
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#173B67] font-heading">
              {t.glossaryTitle || 'Civic Terms Glossary'}
            </h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#667085] mb-5">
          {t.glossaryModalSub}
        </p>

        {/* Search Input */}
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#667085]" />
          <input
            type="text"
            placeholder={t.glossarySearchPlaceholder}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#F5F8FC] border border-[#E1E7EF] focus:border-[#173B67] focus:ring-1 focus:ring-[#173B67] text-xs text-[#263445] placeholder-[#98A2B3] outline-none transition-all"
          />
        </div>

        {/* Terms List */}
        <div className="space-y-4">
          {filteredTerms.map(term => (
            <div
              key={term.term}
              className="p-5 rounded-lg bg-[#F5F8FC] border border-[#E1E7EF] space-y-2.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base font-bold text-[#173B67]">{term.term}</h3>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#EAF2FA] text-[#173B67] border border-[#CBDFF5]">
                  {term.hindiTerm}
                </span>
              </div>

              <p className="text-xs font-bold text-[#168A83]">
                {term.shortDefinition}
              </p>

              <p className="text-xs text-[#263445] leading-relaxed">
                {term.detailedExplanation}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-[#E1E7EF] text-[11px]">
                <div className="text-[#667085]">
                  <strong className="text-[#263445]">{t.contextLabel || 'Context: '}</strong> {term.officialContext}
                </div>
                <div className="text-[#667085]">
                  <strong className="text-[#263445]">{t.actionLabel || 'Action: '}</strong> {term.howToEnsureCompliance}
                </div>
              </div>
            </div>
          ))}

          {filteredTerms.length === 0 && (
            <div className="text-center py-8 text-[#667085] text-xs">
              No matching terms found. Try searching for DBT or DigiLocker.
            </div>
          )}
        </div>

        {/* Close Action */}
        <div className="flex justify-end pt-5 border-t border-[#E1E7EF] mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg bg-[#173B67] hover:bg-[#112C4E] text-white font-bold text-xs transition-all cursor-pointer"
          >
            {t.closeGlossary || t.closeBtn || 'Close Glossary'}
          </button>
        </div>
      </div>
    </div>
  );
};

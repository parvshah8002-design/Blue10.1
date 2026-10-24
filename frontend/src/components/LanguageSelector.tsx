import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check, Search, X } from 'lucide-react';
import {
  Language,
  SUPPORTED_LANGUAGES,
  getLanguageMeta,
  getTranslation
} from '../i18n';

interface LanguageSelectorProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  variant?: 'navbar' | 'mobile' | 'compact';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLang,
  onLanguageChange,
  variant = 'navbar'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const t = getTranslation(currentLang);
  const currentMeta = getLanguageMeta(currentLang);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Focus search input on open
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const filteredLanguages = SUPPORTED_LANGUAGES.filter(lang => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      lang.name.toLowerCase().includes(query) ||
      lang.nativeName.toLowerCase().includes(query) ||
      lang.code.toLowerCase().includes(query)
    );
  });

  const readyLanguages = filteredLanguages.filter(l => l.status === 'ready');
  const previewLanguages = filteredLanguages.filter(l => l.status === 'preview');

  const handleSelect = (lang: Language) => {
    onLanguageChange(lang);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={t.selectLanguage || 'Select Language'}
        className={`h-9 inline-flex items-center gap-1.5 px-3 rounded-lg bg-[#F5F8FC] dark:bg-gray-900 border border-[#E1E7EF] dark:border-gray-800 hover:border-[#173B67] dark:hover:border-gray-700 text-[#173B67] dark:text-gray-200 text-xs font-bold transition-all cursor-pointer shadow-xs shrink-0 select-none ${
          isOpen ? 'ring-2 ring-[#173B67]/20 border-[#173B67]' : ''
        } ${variant === 'mobile' ? 'w-full justify-between' : ''}`}
      >
        <span className="flex items-center gap-1.5 truncate">
          <Globe className="h-4 w-4 text-[#168A83] shrink-0" />
          <span className="font-semibold text-[#0F172A] dark:text-white truncate">
            {currentMeta.nativeName}
          </span>
          <span className="text-[10px] text-[#667085] dark:text-gray-400 font-mono hidden sm:inline">
            ({currentMeta.code.toUpperCase()})
          </span>
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-[#667085] dark:text-gray-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-1.5 w-80 sm:w-96 rounded-xl bg-white dark:bg-[#090D14] border border-[#E1E7EF] dark:border-gray-800 shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100"
        >
          {/* Header & Search */}
          <div className="p-3 bg-[#F5F8FC] dark:bg-gray-900/60 border-b border-[#E1E7EF] dark:border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#173B67] dark:text-white flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-[#168A83]" />
                <span>{t.selectLanguage || 'Select Indian Language'}</span>
              </span>
              <span className="text-[11px] font-semibold text-[#667085] dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-0.5 rounded-full border border-[#E1E7EF] dark:border-gray-700">
                22+ Eighth Schedule
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#667085] dark:text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t.searchLanguages || 'Search language (e.g. বাংলা, தமிழ், اردو)...'}
                className="w-full h-8 pl-8 pr-7 text-xs rounded-lg bg-white dark:bg-gray-800 border border-[#CBDFF5] dark:border-gray-700 text-[#173B67] dark:text-gray-200 placeholder:text-[#667085] dark:placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#168A83]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#667085] hover:text-[#173B67] dark:text-gray-400"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Language List */}
          <div className="max-h-80 overflow-y-auto p-2 space-y-3">
            {/* Ready / High-Population Languages */}
            {readyLanguages.length > 0 && (
              <div>
                <div className="px-2 py-1 text-[11px] font-bold text-[#667085] dark:text-gray-400 uppercase tracking-wider flex items-center justify-between">
                  <span>{t.majorCitizenLanguages || 'Major Citizen Languages'}</span>
                  <span className="text-[10px] text-[#168A83] font-medium">
                    {t.fullSupportBadge || 'Full Interface'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1 mt-1">
                  {readyLanguages.map(lang => {
                    const isSelected = currentLang === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => handleSelect(lang.code)}
                        className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#173B67] text-white font-bold'
                            : 'hover:bg-[#F5F8FC] dark:hover:bg-gray-800 text-[#263445] dark:text-gray-200'
                        }`}
                      >
                        <div className="truncate">
                          <div className="text-xs font-semibold leading-tight truncate">
                            {lang.nativeName}
                          </div>
                          <div
                            className={`text-[10px] ${
                              isSelected ? 'text-gray-200' : 'text-[#667085] dark:text-gray-400'
                            }`}
                          >
                            {lang.name} {lang.dir === 'rtl' ? '(RTL)' : ''}
                          </div>
                        </div>
                        {isSelected && <Check className="h-3.5 w-3.5 shrink-0 stroke-[2.5]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Constitutional Scheduled Languages */}
            {previewLanguages.length > 0 && (
              <div>
                <div className="px-2 py-1 text-[11px] font-bold text-[#667085] dark:text-gray-400 uppercase tracking-wider flex items-center justify-between border-t border-[#E1E7EF] dark:border-gray-800 pt-2">
                  <span>{t.allScheduledLanguages || 'Eighth Schedule Languages'}</span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                    {t.previewBadge || 'Essential UI'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1 mt-1">
                  {previewLanguages.map(lang => {
                    const isSelected = currentLang === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => handleSelect(lang.code)}
                        className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#173B67] text-white font-bold'
                            : 'hover:bg-[#F5F8FC] dark:hover:bg-gray-800 text-[#263445] dark:text-gray-200'
                        }`}
                      >
                        <div className="truncate">
                          <div className="text-xs font-semibold leading-tight truncate">
                            {lang.nativeName}
                          </div>
                          <div
                            className={`text-[10px] ${
                              isSelected ? 'text-gray-200' : 'text-[#667085] dark:text-gray-400'
                            }`}
                          >
                            {lang.name}
                          </div>
                        </div>
                        {isSelected && <Check className="h-3.5 w-3.5 shrink-0 stroke-[2.5]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {filteredLanguages.length === 0 && (
              <div className="p-4 text-center text-xs text-[#667085] dark:text-gray-400">
                No languages match &ldquo;{searchQuery}&rdquo;
              </div>
            )}
          </div>

          {/* Footer Notice */}
          <div className="px-3 py-2 bg-[#F5F8FC] dark:bg-gray-900 border-t border-[#E1E7EF] dark:border-gray-800 text-[10px] text-[#667085] dark:text-gray-400 flex items-center justify-between">
            <span>🇮🇳 All 22 Eighth Schedule Languages</span>
            <span className="text-[#168A83] font-medium">English Fallback Guaranteed</span>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { schemeNavigatorApi, SchemeSchema } from '../services/api';
import { X, Globe, Plus, CheckCircle2, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { Language, TRANSLATIONS } from '../i18n';

interface SchemeScraperModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  onSchemeImported?: (scheme: SchemeSchema) => void;
}

export const SchemeScraperModal: React.FC<SchemeScraperModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  onSchemeImported
}) => {
  const t = TRANSLATIONS[currentLang];
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [url, setUrl] = useState('https://myscheme.gov.in/schemes/pm-kisan');
  const [bulkUrls, setBulkUrls] = useState(
    'https://myscheme.gov.in/schemes/pm-kisan\nhttps://myscheme.gov.in/schemes/pm-svanidhi'
  );
  const [storeInDb, setStoreInDb] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scrapedResult, setScrapedResult] = useState<SchemeSchema | null>(null);
  const [bulkCount, setBulkCount] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleSingleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setError(null);
    setScrapedResult(null);

    try {
      const result = await schemeNavigatorApi.scrapeSingle(url.trim(), storeInDb);
      setScrapedResult(result);
      if (onSchemeImported) onSchemeImported(result);
    } catch (err: any) {
      setError(err?.message || 'Failed to scrape scheme URL');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    const urls = bulkUrls
      .split('\n')
      .map(u => u.trim())
      .filter(Boolean);

    if (urls.length === 0) return;

    setIsLoading(true);
    setError(null);
    setBulkCount(null);

    try {
      const result = await schemeNavigatorApi.scrapeBulk(urls, storeInDb);
      setBulkCount(result.successful);
      if (result.scraped.length > 0 && onSchemeImported) {
        onSchemeImported(result.scraped[0]);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to execute bulk scrape');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 dark:bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl dark:shadow-[0_24px_80px_-8px_rgba(0,0,0,0.9)] border border-[#E1E7EF] dark:border-slate-700/80 overflow-hidden flex flex-col max-h-[90vh] animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E1E7EF] dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#EAF2FA] dark:bg-teal-950/40 text-[#173B67] dark:text-teal-400">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#173B67] dark:text-white font-heading">
                Scheme Importer & Scraper
              </h2>
              <p className="text-xs text-[#667085] dark:text-slate-400">
                Integrates with <code className="text-[#168A83] dark:text-teal-400">POST /api/v1/scrape/single</code> &amp; <code className="text-[#168A83] dark:text-teal-400">bulk</code>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#667085] hover:text-[#263445] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="flex border-b border-[#E1E7EF] dark:border-slate-800 px-5 pt-3 gap-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMode('single')}
            className={`pb-2.5 border-b-2 transition-all cursor-pointer ${
              mode === 'single'
                ? 'border-[#173B67] dark:border-teal-400 text-[#173B67] dark:text-teal-400 font-bold'
                : 'border-transparent text-[#667085] dark:text-slate-400 hover:text-[#263445]'
            }`}
          >
            Single Scheme URL (/api/v1/scrape/single)
          </button>
          <button
            type="button"
            onClick={() => setMode('bulk')}
            className={`pb-2.5 border-b-2 transition-all cursor-pointer ${
              mode === 'bulk'
                ? 'border-[#173B67] dark:border-teal-400 text-[#173B67] dark:text-teal-400 font-bold'
                : 'border-transparent text-[#667085] dark:text-slate-400 hover:text-[#263445]'
            }`}
          >
            Bulk URLs (/api/v1/scrape/bulk)
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-[#FEF3F2] dark:bg-rose-950/40 border border-[#FECDCA] dark:border-rose-800/50 text-[#B42318] dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'single' ? (
            <form onSubmit={handleSingleScrape} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#173B67] dark:text-white mb-1">
                  Government Scheme Guidelines URL
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://myscheme.gov.in/schemes/pm-kisan"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E1E7EF] dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-[#263445] dark:text-white outline-none focus:border-[#173B67] dark:focus:border-teal-400"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="store-db-single"
                  checked={storeInDb}
                  onChange={e => setStoreInDb(e.target.checked)}
                  className="rounded border-[#CBD5E1] text-[#173B67] focus:ring-[#173B67] cursor-pointer"
                />
                <label htmlFor="store-db-single" className="text-xs text-[#667085] dark:text-slate-300 cursor-pointer">
                  Persist in backend repository (<code className="text-[#168A83]">store: true</code>)
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed ${
                  isLoading
                    ? 'bg-gradient-to-r from-teal-600 via-teal-500 to-teal-600 bg-[length:200%_auto] animate-shimmer text-white opacity-90'
                    : 'bg-[#173B67] dark:bg-teal-600 hover:bg-[#112C4E] dark:hover:bg-teal-500 text-white shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99]'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Scraping & Validating<span className="animate-pulse">...</span></span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    <span>Scrape & Ingest Scheme</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleBulkScrape} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#173B67] dark:text-white mb-1">
                  List of Government Scheme URLs (one per line)
                </label>
                <textarea
                  rows={4}
                  required
                  value={bulkUrls}
                  onChange={e => setBulkUrls(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-[#E1E7EF] dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono text-[#263445] dark:text-white outline-none focus:border-[#173B67] dark:focus:border-teal-400"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="store-db-bulk"
                  checked={storeInDb}
                  onChange={e => setStoreInDb(e.target.checked)}
                  className="rounded border-[#CBD5E1] text-[#173B67] focus:ring-[#173B67] cursor-pointer"
                />
                <label htmlFor="store-db-bulk" className="text-xs text-[#667085] dark:text-slate-300 cursor-pointer">
                  Persist in backend repository (<code className="text-[#168A83]">store: true</code>)
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed ${
                  isLoading
                    ? 'bg-gradient-to-r from-teal-600 via-teal-500 to-teal-600 bg-[length:200%_auto] animate-shimmer text-white opacity-90'
                    : 'bg-[#173B67] dark:bg-teal-600 hover:bg-[#112C4E] dark:hover:bg-teal-500 text-white shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99]'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing Bulk Scrape<span className="animate-pulse">...</span></span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    <span>Execute Bulk Ingestion</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Results Display */}
          {scrapedResult && (
            <div className="p-4 rounded-xl bg-[#ECFDF3] dark:bg-emerald-950/30 border border-[#ABEFC6] dark:border-emerald-800/40 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#027A48] dark:text-emerald-400 font-bold">
                <CheckCircle2 className="h-4 w-4" />
                <span>Successfully Ingested Scheme: {scrapedResult.title_en || scrapedResult.name}</span>
              </div>
              <p className="text-[#263445] dark:text-slate-200">
                {scrapedResult.description || scrapedResult.summary}
              </p>
              <div className="pt-1 flex items-center gap-4 text-[11px] text-[#667085] dark:text-slate-400">
                <span>Department: {scrapedResult.department || scrapedResult.ministry}</span>
                {scrapedResult.source_url && (
                  <a
                    href={scrapedResult.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#173B67] dark:text-teal-400 hover:underline font-bold"
                  >
                    <span>View Official Source</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          )}

          {bulkCount !== null && (
            <div className="p-4 rounded-xl bg-[#ECFDF3] dark:bg-emerald-950/30 border border-[#ABEFC6] dark:border-emerald-800/40 text-xs text-[#027A48] dark:text-emerald-400 font-bold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Bulk Scrape Finished: {bulkCount} schemes successfully processed and ready for evaluation.</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F5F8FC] dark:bg-slate-900 border-t border-[#E1E7EF] dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-[#E1E7EF] dark:border-slate-700 text-xs font-bold text-[#173B67] dark:text-white hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {t.closeBtn || 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

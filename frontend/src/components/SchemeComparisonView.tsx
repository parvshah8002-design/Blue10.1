import React from 'react';
import { Scheme, SchemeEvaluation } from '../types/scheme';
import { Language, TRANSLATIONS, getSchemeText } from '../data/translations';
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ExternalLink,
  Scale
} from 'lucide-react';

interface SchemeComparisonViewProps {
  schemes: Scheme[];
  evaluations: SchemeEvaluation[];
  onBack: () => void;
  onSelectScheme: (scheme: Scheme) => void;
  currentLang: Language;
}

export const SchemeComparisonView: React.FC<SchemeComparisonViewProps> = ({
  schemes,
  evaluations,
  onBack,
  onSelectScheme,
  currentLang
}) => {
  const t = TRANSLATIONS[currentLang];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#F5F8FC]">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-[#E1E7EF] hover:border-[#173B67] text-xs font-bold text-[#173B67] cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t.backToDashboardBtn}</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-[#173B67]">
          <Scale className="h-4 w-4 text-[#168A83]" />
          <span>
            {t.btnComparing} {schemes.length} {t.schemeFoundPlural}
          </span>
        </div>
      </div>

      <div className="p-6 sm:p-8 rounded-xl bg-white border border-[#E1E7EF] shadow-xs">
        <h1 className="text-2xl font-bold text-[#173B67] font-heading">
          {t.comparisonHeading}
        </h1>
        <p className="text-xs text-[#667085] mt-1 max-w-2xl leading-relaxed">
          {t.comparisonSub}
        </p>

        {/* Comparison Cards Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemes.map(scheme => {
            const evaluation = evaluations.find(e => e.scheme.id === scheme.id);
            const state = evaluation?.overallState || 'UNKNOWN';
            const sInfo = getSchemeText(scheme.id, currentLang, {
              name: scheme.name,
              simpleDescription: scheme.simpleDescription,
              benefit: scheme.benefitAmountOrDescription,
              ministry: scheme.ministryOrDepartment
            });

            return (
              <div
                key={scheme.id}
                className="p-6 rounded-xl bg-[#F5F8FC] border border-[#E1E7EF] space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Category & Status */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#EAF2FA] text-[#173B67] border border-[#CBDFF5]">
                      {scheme.beneficiaryGroup}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold ${
                        state === 'MET'
                          ? 'bg-[#ECFDF3] text-[#027A48] border border-[#ABEFC6]'
                          : state === 'NOT MET'
                          ? 'bg-[#FEF3F2] text-[#B42318] border border-[#FECDCA]'
                          : 'bg-[#FFFAEB] text-[#B54708] border border-[#FEDF89]'
                      }`}
                    >
                      {state === 'MET' && <CheckCircle2 className="h-3.5 w-3.5" />}
                      {state === 'NOT MET' && <XCircle className="h-3.5 w-3.5" />}
                      {state === 'UNKNOWN' && <HelpCircle className="h-3.5 w-3.5" />}
                      <span>
                        {state === 'MET'
                          ? t.statusMetBadge
                          : state === 'NOT MET'
                          ? t.statusNotMetBadge
                          : t.statusUnknownBadge}
                      </span>
                    </span>
                  </div>

                  {/* Scheme Name */}
                  <h3 className="text-base font-bold text-[#173B67] leading-snug font-heading">
                    {sInfo.name}
                  </h3>

                  {/* Ministry */}
                  <div className="text-xs text-[#667085] flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-[#168A83] shrink-0" />
                    <span className="truncate">{sInfo.ministry}</span>
                  </div>

                  {/* Direct Benefit Box */}
                  <div className="p-3.5 rounded-lg bg-white border border-[#E1E7EF] text-xs">
                    <span className="text-[10px] uppercase font-bold text-[#168A83] block mb-0.5">
                      {t.directFinancialBenefitCol}
                    </span>
                    <span className="font-bold text-[#173B67]">
                      {sInfo.benefit}
                    </span>
                  </div>

                  {/* Conditions Metric */}
                  <div className="space-y-1.5 text-xs">
                    <div className="font-bold text-[#263445]">
                      {t.keyConditionsCol}:
                    </div>
                    <div className="flex items-center justify-between text-[11px] p-2 rounded-lg bg-white border border-[#E1E7EF]">
                      <span className="text-[#027A48] font-bold">
                        {evaluation?.conditionsMet.length || 0} {t.statusMetBadge}
                      </span>
                      <span className="text-[#B54708] font-bold">
                        {evaluation?.conditionsUnknown.length || 0} {t.statusUnknownBadge}
                      </span>
                      <span className="text-[#B42318] font-bold">
                        {evaluation?.conditionsNotMet.length || 0} {t.statusNotMetBadge}
                      </span>
                    </div>
                  </div>

                  {/* Documents Count */}
                  <div className="text-xs text-[#667085]">
                    <strong className="text-[#263445]">
                      {t.documentsHeading}:
                    </strong>{' '}
                    {scheme.requiredDocuments.length}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-[#E1E7EF] space-y-2">
                  <button
                    onClick={() => onSelectScheme(scheme)}
                    className="w-full py-2.5 rounded-lg bg-[#173B67] hover:bg-[#112C4E] text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                  >
                    {t.btnViewDetails}
                  </button>

                  <a
                    href={scheme.officialSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 rounded-lg bg-white hover:bg-[#EAF2FA] text-[#173B67] border border-[#E1E7EF] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>{t.officialSource}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

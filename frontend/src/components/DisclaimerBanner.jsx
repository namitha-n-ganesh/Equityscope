import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export const DisclaimerBanner = ({ onLearnMore }) => {
  return (
    <div className="bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-emerald-50/70 dark:from-blue-950/30 dark:via-indigo-950/20 dark:to-emerald-950/20 border border-blue-200/80 dark:border-blue-900/50 rounded-xl p-3.5 sm:px-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-blue-900 dark:text-blue-200 shadow-sm mb-6">
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 shrink-0">
          <Info size={16} />
        </div>
        <div>
          <span className="font-semibold text-blue-950 dark:text-white mr-1.5">
            Educational & Analytical Research Platform:
          </span>
          <span className="text-blue-800/90 dark:text-blue-300/90">
            EquityScope provides financial data intelligence and quantitative analytics for Indian mid & small-cap stocks. It does NOT offer SEBI-registered investment advisory services. Always consult an accredited financial advisor.
          </span>
        </div>
      </div>
      {onLearnMore && (
        <button
          onClick={onLearnMore}
          className="whitespace-nowrap px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-colors shrink-0"
        >
          SEBI Guidelines
        </button>
      )}
    </div>
  );
};

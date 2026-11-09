import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export const MetricCard = ({
  title,
  value,
  subtitle,
  change = null,
  changePercent = null,
  icon: Icon,
  badgeText = null,
  isPositive = null,
  prefix = '',
  suffix = '',
  infoTooltip = null
}) => {
  // Determine trend direction
  let positive = isPositive;
  if (positive === null) {
    if (changePercent !== null) {
      positive = changePercent >= 0;
    } else if (change !== null) {
      positive = change >= 0;
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-fintech relative overflow-hidden group">
      {/* Subtle top indicator bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 transition-all duration-300 ${
        positive === true ? 'bg-emerald-500' : positive === false ? 'bg-rose-500' : 'bg-gray-300 dark:bg-gray-700'
      } group-hover:h-1.5`} />

      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400" title={infoTooltip}>
          {title}
        </span>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300">
            <Icon size={16} />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white font-mono">
          {prefix}{value}{suffix}
        </span>
        {badgeText && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            {badgeText}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs">
        {changePercent !== null && (
          <span className={`inline-flex items-center font-semibold px-1.5 py-0.5 rounded ${
            positive
              ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400'
              : 'text-rose-700 bg-rose-50 dark:bg-rose-950/50 dark:text-rose-400'
          }`}>
            {positive ? <ArrowUpRight size={13} className="mr-0.5" /> : <ArrowDownRight size={13} className="mr-0.5" />}
            {positive ? '+' : ''}{changePercent.toFixed(2)}%
          </span>
        )}
        {subtitle && (
          <span className="text-gray-500 dark:text-gray-400 truncate">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};

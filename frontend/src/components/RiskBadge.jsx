import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

export const RiskBadge = ({ level = 'Moderate', score = null }) => {
  const config = {
    'Low': {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-200 dark:border-emerald-800',
      dot: 'bg-emerald-500',
      icon: ShieldCheck,
    },
    'Moderate': {
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-800',
      dot: 'bg-blue-500',
      icon: ShieldCheck,
    },
    'High': {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      text: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-200 dark:border-amber-800',
      dot: 'bg-amber-500',
      icon: AlertTriangle,
    },
    'Very High': {
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      text: 'text-rose-700 dark:text-rose-300',
      border: 'border-rose-200 dark:border-rose-800',
      dot: 'bg-rose-500',
      icon: ShieldAlert,
    }
  };

  const current = config[level] || config['Moderate'];
  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${current.bg} ${current.text} ${current.border}`}
      title={`Risk Level: ${level}${score ? ` (Score: ${score}/10)` : ''}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot} animate-pulse`}></span>
      <span>{level}</span>
      {score !== null && (
        <span className="text-[10px] opacity-75 font-mono">({score})</span>
      )}
    </span>
  );
};

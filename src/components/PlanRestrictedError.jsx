'use client';

import { Lock, Zap } from 'lucide-react';

/**
 * Displays plan tier restriction errors with upgrade CTA
 */
export default function PlanRestrictedError({
  message = 'This feature requires a higher plan',
  currentPlan = 'BRONZE',
  requiredPlans = [],
  onUpgradeClick,
  variant = 'info' // 'info', 'warning', or 'error'
}) {
  const variantStyles = {
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-800 dark:text-blue-400',
      title: 'text-blue-900 dark:text-blue-300',
      button: 'bg-blue-600 hover:bg-blue-700'
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-800',
      text: 'text-amber-800 dark:text-amber-400',
      title: 'text-amber-900 dark:text-amber-300',
      button: 'bg-amber-600 hover:bg-amber-700'
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-800 dark:text-red-400',
      title: 'text-red-900 dark:text-red-300',
      button: 'bg-red-600 hover:bg-red-700'
    }
  };

  const styles = variantStyles[variant];

  return (
    <div className={`${styles.bg} border ${styles.border} rounded-lg p-6`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <Lock className={`w-6 h-6 ${variant === 'info' ? 'text-blue-600' : variant === 'warning' ? 'text-amber-600' : 'text-red-600'}`} />
        </div>

        <div className="flex-1">
          <h3 className={`font-semibold mb-2 ${styles.title}`}>
            Upgrade Required
          </h3>

          <p className={`text-sm ${styles.text} mb-3`}>
            {message}
          </p>

          <div className={`bg-black/5 rounded p-3 mb-4 ${styles.text}`}>
            <div className="text-sm mb-2">
              <span className="font-medium">Current Plan:</span>
              <span className="ml-2 px-2 py-1 bg-black/10 rounded text-xs font-semibold">
                {currentPlan}
              </span>
            </div>
            <div className="text-sm">
              <span className="font-medium">Required Plans:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {requiredPlans.map((plan) => (
                  <span
                    key={plan}
                    className="px-2 py-1 bg-black/20 rounded text-xs font-semibold"
                  >
                    {plan}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={onUpgradeClick}
            className={`${styles.button} text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors flex items-center gap-2`}
          >
            <Zap className="w-4 h-4" />
            Upgrade Plan
          </button>
        </div>
      </div>
    </div>
  );
}

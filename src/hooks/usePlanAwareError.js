'use client';

import { useCallback } from 'react';

/**
 * Hook for handling plan tier restrictions gracefully
 * Detects upgrade requirements from API responses and formats them for UI display
 */
export const usePlanAwareError = () => {
  const parseError = useCallback((err) => {
    const errorData = err?.response?.data;

    // Check if it's a plan tier restriction error
    if (errorData?.upgradeRequired && errorData?.requiredPlans) {
      return {
        message: errorData.message || 'This feature requires a higher plan',
        upgradeRequired: true,
        requiredPlans: errorData.requiredPlans,
        currentPlan: errorData.currentPlan || 'BRONZE'
      };
    }

    // Generic error
    return {
      message: errorData?.message || err?.message || 'An error occurred',
      upgradeRequired: false
    };
  }, []);

  const renderPlanError = useCallback((error) => {
    if (!error) return null;

    if (error.upgradeRequired) {
      return {
        type: 'plan',
        title: 'Upgrade Required',
        icon: '🔒',
        message: error.message,
        currentPlan: error.currentPlan,
        requiredPlans: error.requiredPlans
      };
    }

    return {
      type: 'error',
      title: 'Error',
      icon: '⚠️',
      message: error.message
    };
  }, []);

  return { parseError, renderPlanError };
};

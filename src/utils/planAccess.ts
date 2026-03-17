/**
 * Plan-based Access Control Utility
 * Determines if a user can access features based on their subscription plan
 */

export type PlanLevel = 'BRONZE' | 'SILVER' | 'GOLD' | 'PREMIUM';

// Plan hierarchy - higher index = more features
const PLAN_HIERARCHY: Record<PlanLevel, number> = {
  BRONZE: 0,
  SILVER: 1,
  GOLD: 2,
  PREMIUM: 3,
};

/**
 * Check if user's current plan has access to required plans
 * @param userPlan - User's current subscription plan
 * @param requiredPlans - Array of plans that can access this feature
 * @returns boolean - true if user can access, false otherwise
 */
export function canAccessFeature(
  userPlan: PlanLevel | string = 'BRONZE',
  requiredPlans: PlanLevel[] | string[] = []
): boolean {
  if (!requiredPlans || requiredPlans.length === 0) {
    return true; // No restrictions
  }

  const userPlanLevel = PLAN_HIERARCHY[userPlan as PlanLevel] ?? 0;

  // Check if user's plan is in the required plans
  return requiredPlans.some((plan) => {
    const planLevel = PLAN_HIERARCHY[plan as PlanLevel] ?? -1;
    return userPlanLevel >= planLevel;
  });
}

/**
 * Get the minimum required plan for a feature
 * @param requiredPlans - Array of plans that can access this feature
 * @returns The highest tier plan in requiredPlans (most restrictive)
 */
export function getMinimumRequiredPlan(requiredPlans: PlanLevel[] | string[] = []): PlanLevel | null {
  if (!requiredPlans || requiredPlans.length === 0) {
    return null;
  }

  let maxLevel = -1;
  let maxPlan: PlanLevel | null = null;

  requiredPlans.forEach((plan) => {
    const planLevel = PLAN_HIERARCHY[plan as PlanLevel];
    if (planLevel !== undefined && planLevel > maxLevel) {
      maxLevel = planLevel;
      maxPlan = plan as PlanLevel;
    }
  });

  return maxPlan;
}

/**
 * Get available plans from a list of required plans
 * @param requiredPlans - Array of plans
 * @returns Sorted array of unique plan names
 */
export function formatRequiredPlans(requiredPlans: PlanLevel[] | string[] = []): string[] {
  const uniquePlans = Array.from(new Set(requiredPlans.map((p) => String(p).toUpperCase())));
  return uniquePlans.sort((a, b) => {
    const levelA = PLAN_HIERARCHY[a as PlanLevel] ?? -1;
    const levelB = PLAN_HIERARCHY[b as PlanLevel] ?? -1;
    return levelA - levelB;
  });
}

/**
 * Check if a plan restriction error occurred
 * @param error - Error object from API
 * @returns true if this is a plan restriction error
 */
export function isPlanRestrictionError(error: any): boolean {
  return (
    error?.upgradeRequired === true ||
    error?.requiredPlans !== undefined ||
    error?.currentPlan !== undefined
  );
}

/**
 * Extract plan restriction details from error
 * @param error - Error object from API
 * @returns Plan restriction details or null
 */
export function getPlanRestrictionDetails(error: any): {
  message: string;
  currentPlan: PlanLevel;
  requiredPlans: PlanLevel[];
} | null {
  if (!isPlanRestrictionError(error)) {
    return null;
  }

  return {
    message: error.message || error.error || 'This feature requires a higher plan',
    currentPlan: (error.currentPlan || 'BRONZE') as PlanLevel,
    requiredPlans: (error.requiredPlans || []) as PlanLevel[],
  };
}

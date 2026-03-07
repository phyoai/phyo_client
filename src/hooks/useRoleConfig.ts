import { useMemo } from 'react';
import { useRole } from './useRole';
import { RoleConfig } from '@/config/roleConfig';

/**
 * useRoleConfig Hook
 * Returns the configuration for the current role
 */
export const useRoleConfig = (): RoleConfig => {
  const { config } = useRole();
  return useMemo(() => config, [config]);
};

export default useRoleConfig;

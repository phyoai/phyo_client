import { useRoleContext } from '@/app/context/RoleContext';

export const useRole = () => {
  return useRoleContext();
};

export default useRole;

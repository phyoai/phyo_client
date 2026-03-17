import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchUserProfile,
  updateUserProfile,
  searchUsers,
  getUserById,
  deleteAccount,
} from '@/store/slices/userSlice';
import type { RootState } from '@/store';

export const useUser = () => {
  const dispatch = useDispatch();
  const {
    profile,
    role,
    searchResults,
    loading,
    error,
  } = useSelector((state: RootState) => state.user);

  const fetchProfile = useCallback(
    () => {
      dispatch(fetchUserProfile() as any);
    },
    [dispatch]
  );

  const updateProfile = useCallback(
    (data: any) => {
      dispatch(updateUserProfile(data) as any);
    },
    [dispatch]
  );

  const search = useCallback(
    (params: any) => {
      dispatch((searchUsers as any)(params) as any);
    },
    [dispatch]
  );

  const getUserInfo = useCallback(
    (userId: any) => {
      dispatch((getUserById as any)(userId) as any);
    },
    [dispatch]
  );

  const removeAccount = useCallback(
    () => {
      dispatch(deleteAccount() as any);
    },
    [dispatch]
  );

  return {
    profile,
    role,
    searchResults,
    loading,
    error,
    fetchProfile,
    updateProfile,
    search,
    getUserInfo,
    removeAccount,
  };
};

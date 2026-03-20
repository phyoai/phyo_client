import { useDispatch, useSelector } from 'react-redux';
import {
  getInfluencers,
  getInfluencerById,
  getTrendingInfluencers,
  searchInfluencers,
  clearSelectedInfluencer,
  setFilters,
} from '@/store/slices/influencerSlice';
import { useCallback } from 'react';

/**
 * Custom hook for influencer operations
 * Provides easy access to influencers state and dispatch actions
 */
export const useInfluencers = () => {
  const dispatch = useDispatch();
  const {
    influencers,
    trendingInfluencers,
    selectedInfluencer,
    loading,
    error,
    filters,
  } = useSelector((state: any) => state.influencer);

  const fetchInfluencers = useCallback(
    (params?: any) => {
      dispatch(getInfluencers(params) as any);
    },
    [dispatch]
  );

  const fetchInfluencerById = useCallback(
    (id: string) => {
      dispatch(getInfluencerById(id) as any);
    },
    [dispatch]
  );

  const fetchTrendingInfluencers = useCallback(
    (params?: any) => {
      dispatch(getTrendingInfluencers(params) as any);
    },
    [dispatch]
  );

  const searchForInfluencers = useCallback(
    (query: string) => {
      dispatch(searchInfluencers(query) as any);
    },
    [dispatch]
  );

  const clearSelection = useCallback(() => {
    dispatch(clearSelectedInfluencer() as any);
  }, [dispatch]);

  const updateFilters = useCallback(
    (newFilters: any) => {
      dispatch(setFilters(newFilters) as any);
    },
    [dispatch]
  );

  return {
    // State
    influencers,
    trendingInfluencers,
    selectedInfluencer,
    loading,
    error,
    filters,
    // Actions
    fetchInfluencers,
    fetchInfluencerById,
    fetchTrendingInfluencers,
    searchForInfluencers,
    clearSelection,
    updateFilters,
  };
};

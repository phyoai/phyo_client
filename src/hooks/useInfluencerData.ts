'use client';

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllInfluencers,
  searchInfluencers,
  advancedSearchInfluencers,
  getInfluencerById,
  getInfluencerByUsername,
  getInfluencerStats,
  setAdvancedFilters,
  clearSearchResults,
  selectInfluencer,
  clearSelectedInfluencer,
} from '@/store/slices/influencerDataSlice';

export const useInfluencerData = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: any) => state.influencerData);

  // State
  const {
    allInfluencers,
    searchResults,
    selectedInfluencer,
    advancedFilters,
    categories,
    demographics,
    loading,
    error,
    pagination,
  } = state;

  // Actions
  const fetchAllInfluencers = useCallback(
    (page = 1, limit = 10) => {
      return dispatch(getAllInfluencers({ page, limit }) as any);
    },
    [dispatch]
  );

  const searchByQuery = useCallback(
    (query: string, page = 1, limit = 10) => {
      return dispatch(searchInfluencers({ query, page, limit }) as any);
    },
    [dispatch]
  );

  const advancedSearch = useCallback(
    (filters: {
      city?: string;
      state?: string;
      category?: string;
      gender?: string;
      minFollowers?: number;
      maxFollowers?: number;
      page?: number;
      limit?: number;
    }) => {
      return dispatch(advancedSearchInfluencers(filters) as any);
    },
    [dispatch]
  );

  const fetchInfluencerById = useCallback(
    (id: string) => {
      return dispatch(getInfluencerById(id) as any);
    },
    [dispatch]
  );

  const fetchInfluencerByUsername = useCallback(
    (username: string) => {
      return dispatch(getInfluencerByUsername(username) as any);
    },
    [dispatch]
  );

  const fetchStats = useCallback(() => {
    return dispatch(getInfluencerStats() as any);
  }, [dispatch]);

  const updateFilters = useCallback(
    (filters) => {
      dispatch(setAdvancedFilters(filters) as any);
    },
    [dispatch]
  );

  const clearResults = useCallback(() => {
    dispatch(clearSearchResults() as any);
  }, [dispatch]);

  const selectNewInfluencer = useCallback(
    (influencer) => {
      dispatch(selectInfluencer(influencer) as any);
    },
    [dispatch]
  );

  const clearSelection = useCallback(() => {
    dispatch(clearSelectedInfluencer() as any);
  }, [dispatch]);

  return {
    // State
    allInfluencers,
    searchResults,
    selectedInfluencer,
    advancedFilters,
    categories,
    demographics,
    loading,
    error,
    pagination,

    // Actions
    fetchAllInfluencers,
    searchByQuery,
    advancedSearch,
    fetchInfluencerById,
    fetchInfluencerByUsername,
    fetchStats,
    updateFilters,
    clearResults,
    selectNewInfluencer,
    clearSelection,
  };
};

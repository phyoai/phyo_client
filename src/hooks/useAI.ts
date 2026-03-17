import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  searchWithAI,
  getInfluencerDetails,
  fetchInstagramReelData,
  clearAIResults,
  clearError,
  setSelectedInfluencer,
} from '@/store/slices/aiSlice';
import type { RootState } from '@/store';

export const useAI = () => {
  const dispatch = useDispatch();
  const {
    aiResults,
    selectedInfluencer,
    reelData,
    loading,
    error,
  } = useSelector((state: RootState) => state.ai);

  const search = useCallback(
    (prompt: string) => {
      dispatch(searchWithAI({ prompt }) as any);
    },
    [dispatch]
  );

  const getInfluencerInfo = useCallback(
    (userName: string) => {
      dispatch(getInfluencerDetails(userName) as any);
    },
    [dispatch]
  );

  const fetchReelData = useCallback(
    (reelUrl: string) => {
      dispatch(fetchInstagramReelData({ reelUrl }) as any);
    },
    [dispatch]
  );

  const clearResults = useCallback(
    () => {
      dispatch(clearAIResults() as any);
    },
    [dispatch]
  );

  const removeError = useCallback(
    () => {
      dispatch(clearError() as any);
    },
    [dispatch]
  );

  const selectInfluencer = useCallback(
    (influencer: any) => {
      dispatch(setSelectedInfluencer(influencer) as any);
    },
    [dispatch]
  );

  return {
    aiResults,
    selectedInfluencer,
    reelData,
    loading,
    error,
    search,
    getInfluencerInfo,
    fetchReelData,
    clearResults,
    removeError,
    selectInfluencer,
  };
};

import { useDispatch, useSelector } from 'react-redux';
import {
  getCampaigns,
  getTrendingCampaigns,
  getMyCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  applyToCampaign,
  clearSelectedCampaign,
} from '@/store/slices/campaignSlice';
import { useCallback } from 'react';

/**
 * Custom hook for campaign operations
 * Provides easy access to campaigns state and dispatch actions
 */
export const useCampaigns = () => {
  const dispatch = useDispatch();
  const {
    campaigns,
    trendingCampaigns,
    myCampaigns,
    selectedCampaign,
    loading,
    error,
    pagination,
  } = useSelector((state: any) => state.campaign);

  const fetchCampaigns = useCallback(
    (params?: any) => {
      dispatch(getCampaigns(params) as any);
    },
    [dispatch]
  );

  const fetchTrendingCampaigns = useCallback(
    (params?: any) => {
      dispatch(getTrendingCampaigns(params) as any);
    },
    [dispatch]
  );

  const fetchMyCampaigns = useCallback(
    (params?: any) => {
      dispatch(getMyCampaigns(params) as any);
    },
    [dispatch]
  );

  const fetchCampaignById = useCallback(
    (id: string) => {
      dispatch(getCampaignById(id) as any);
    },
    [dispatch]
  );

  const createNewCampaign = useCallback(
    (data: any) => {
      dispatch(createCampaign(data) as any);
    },
    [dispatch]
  );

  const updateExistingCampaign = useCallback(
    (id: string, data: any) => {
      dispatch(updateCampaign({ id, data }) as any);
    },
    [dispatch]
  );

  const removeCampaign = useCallback(
    (id: string) => {
      dispatch(deleteCampaign(id) as any);
    },
    [dispatch]
  );

  const applyToNewCampaign = useCallback(
    (id: string, applicationData?: any) => {
      dispatch(applyToCampaign({ id, applicationData }) as any);
    },
    [dispatch]
  );

  const clearSelection = useCallback(() => {
    dispatch(clearSelectedCampaign() as any);
  }, [dispatch]);

  return {
    // State
    campaigns,
    trendingCampaigns,
    myCampaigns,
    selectedCampaign,
    loading,
    error,
    pagination,
    // Actions
    fetchCampaigns,
    fetchTrendingCampaigns,
    fetchMyCampaigns,
    fetchCampaignById,
    createNewCampaign,
    updateExistingCampaign,
    removeCampaign,
    applyToNewCampaign,
    clearSelection,
  };
};

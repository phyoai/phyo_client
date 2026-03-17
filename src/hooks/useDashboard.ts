import { useDispatch, useSelector } from 'react-redux';
import {
  getDashboardMetrics,
  getRecentCampaigns,
  getTrendingInfluencers,
  getCampaignStats,
  refreshDashboard,
  clearDashboard,
} from '@/store/slices/dashboardSlice';
import { useCallback } from 'react';

/**
 * Custom hook for dashboard operations
 * Provides easy access to dashboard state and dispatch actions
 */
export const useDashboard = () => {
  const dispatch = useDispatch();
  const {
    metrics,
    recentCampaigns,
    trendingInfluencers,
    campaignStats,
    loading,
    error,
    lastUpdated,
  } = useSelector((state: any) => state.dashboard);

  const fetchMetrics = useCallback(() => {
    dispatch(getDashboardMetrics() as any);
  }, [dispatch]);

  const fetchRecentCampaigns = useCallback(
    (limit?: number) => {
      dispatch(getRecentCampaigns(limit) as any);
    },
    [dispatch]
  );

  const fetchTrendingInfluencers = useCallback(
    (limit?: number) => {
      dispatch(getTrendingInfluencers(limit) as any);
    },
    [dispatch]
  );

  const fetchCampaignStats = useCallback(
    (campaignId?: string) => {
      dispatch(getCampaignStats(campaignId) as any);
    },
    [dispatch]
  );

  const refreshAllDashboard = useCallback(() => {
    dispatch(refreshDashboard() as any);
  }, [dispatch]);

  const clear = useCallback(() => {
    dispatch(clearDashboard() as any);
  }, [dispatch]);

  return {
    // State
    metrics,
    recentCampaigns,
    trendingInfluencers,
    campaignStats,
    loading,
    error,
    lastUpdated,
    // Actions
    fetchMetrics,
    fetchRecentCampaigns,
    fetchTrendingInfluencers,
    fetchCampaignStats,
    refreshAllDashboard,
    clear,
  };
};

/**
 * Custom Hooks for Trending & Nearby APIs
 * Integrates with Redux and API services
 * Date: March 17, 2026
 */

import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getTrendingInfluencers,
  getTrendingCampaigns,
  getTrendingBrands,
  getTrendingCategories,
  getTrendingDashboard,
  getNearbyInfluencers,
  getNearbyBrands,
  getNearbyCampaigns,
  updateUserLocation,
  getSupportedLocations,
  getNearbyDashboard,
} from '@/api/trending-nearby.api';
import {
  TrendingInfluencersResponse,
  TrendingInfluencersQueryParams,
  TrendingCampaignsResponse,
  TrendingCampaignsQueryParams,
  TrendingBrandsResponse,
  TrendingBrandsQueryParams,
  TrendingCategoriesResponse,
  NearbyInfluencersResponse,
  NearbyInfluencersQueryParams,
  NearbyBrandsResponse,
  NearbyBrandsQueryParams,
  NearbyCampaignsResponse,
  NearbyCampaignsQueryParams,
  UpdateUserLocationRequest,
  UpdateUserLocationResponse,
  SupportedLocationsResponse,
  SupportedLocationsQueryParams,
  TrendingDashboard,
  NearbyDashboard,
} from '@/types/trending-nearby.types';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// ============================================================================
// TRENDING INFLUENCERS HOOK
// ============================================================================

export const useTrendingInfluencers = () => {
  const [state, setState] = useState<UseApiState<TrendingInfluencersResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetch = useCallback(async (params?: TrendingInfluencersQueryParams) => {
    setState({ data: null, loading: true, error: null });
    try {
      const response = await getTrendingInfluencers(params);
      setState({ data: response, loading: false, error: null });
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch trending influencers';
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, []);

  return { ...state, fetch };
};

// ============================================================================
// TRENDING CAMPAIGNS HOOK
// ============================================================================

export const useTrendingCampaigns = () => {
  const [state, setState] = useState<UseApiState<TrendingCampaignsResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetch = useCallback(async (params?: TrendingCampaignsQueryParams) => {
    setState({ data: null, loading: true, error: null });
    try {
      const response = await getTrendingCampaigns(params);
      setState({ data: response, loading: false, error: null });
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch trending campaigns';
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, []);

  return { ...state, fetch };
};

// ============================================================================
// TRENDING BRANDS HOOK
// ============================================================================

export const useTrendingBrands = () => {
  const [state, setState] = useState<UseApiState<TrendingBrandsResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetch = useCallback(async (params?: TrendingBrandsQueryParams) => {
    setState({ data: null, loading: true, error: null });
    try {
      const response = await getTrendingBrands(params);
      setState({ data: response, loading: false, error: null });
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch trending brands';
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, []);

  return { ...state, fetch };
};

// ============================================================================
// TRENDING CATEGORIES HOOK
// ============================================================================

export const useTrendingCategories = () => {
  const [state, setState] = useState<UseApiState<TrendingCategoriesResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetch = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const response = await getTrendingCategories();
      setState({ data: response, loading: false, error: null });
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch trending categories';
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, []);

  return { ...state, fetch };
};

// ============================================================================
// TRENDING DASHBOARD HOOK
// ============================================================================

export const useTrendingDashboard = () => {
  const [state, setState] = useState<UseApiState<TrendingDashboard>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetch = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const response = await getTrendingDashboard();
      setState({ data: response, loading: false, error: null });
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch trending dashboard';
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, []);

  return { ...state, fetch };
};

// ============================================================================
// NEARBY INFLUENCERS HOOK
// ============================================================================

export const useNearbyInfluencers = () => {
  const [state, setState] = useState<UseApiState<NearbyInfluencersResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetch = useCallback(async (params: NearbyInfluencersQueryParams) => {
    setState({ data: null, loading: true, error: null });
    try {
      const response = await getNearbyInfluencers(params);
      setState({ data: response, loading: false, error: null });
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch nearby influencers';
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, []);

  return { ...state, fetch };
};

// ============================================================================
// NEARBY BRANDS HOOK
// ============================================================================

export const useNearbyBrands = () => {
  const [state, setState] = useState<UseApiState<NearbyBrandsResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetch = useCallback(async (params: NearbyBrandsQueryParams) => {
    setState({ data: null, loading: true, error: null });
    try {
      const response = await getNearbyBrands(params);
      setState({ data: response, loading: false, error: null });
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch nearby brands';
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, []);

  return { ...state, fetch };
};

// ============================================================================
// NEARBY CAMPAIGNS HOOK
// ============================================================================

export const useNearbyCampaigns = () => {
  const [state, setState] = useState<UseApiState<NearbyCampaignsResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetch = useCallback(async (params: NearbyCampaignsQueryParams) => {
    setState({ data: null, loading: true, error: null });
    try {
      const response = await getNearbyCampaigns(params);
      setState({ data: response, loading: false, error: null });
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch nearby campaigns';
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, []);

  return { ...state, fetch };
};

// ============================================================================
// USER LOCATION HOOK
// ============================================================================

export const useUserLocation = () => {
  const [state, setState] = useState<UseApiState<UpdateUserLocationResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const update = useCallback(async (location: UpdateUserLocationRequest, token: string) => {
    setState({ data: null, loading: true, error: null });
    try {
      const response = await updateUserLocation(location, token);
      setState({ data: response, loading: false, error: null });
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update user location';
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, []);

  return { ...state, update };
};

// ============================================================================
// SUPPORTED LOCATIONS HOOK
// ============================================================================

export const useSupportedLocations = () => {
  const [state, setState] = useState<UseApiState<SupportedLocationsResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetch = useCallback(async (params?: SupportedLocationsQueryParams) => {
    setState({ data: null, loading: true, error: null });
    try {
      const response = await getSupportedLocations(params);
      setState({ data: response, loading: false, error: null });
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch supported locations';
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, []);

  return { ...state, fetch };
};

// ============================================================================
// NEARBY DASHBOARD HOOK
// ============================================================================

export const useNearbyDashboard = () => {
  const [state, setState] = useState<UseApiState<NearbyDashboard>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetch = useCallback(async (latitude: number, longitude: number) => {
    setState({ data: null, loading: true, error: null });
    try {
      const response = await getNearbyDashboard(latitude, longitude);
      setState({ data: response, loading: false, error: null });
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch nearby dashboard';
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, []);

  return { ...state, fetch };
};

// ============================================================================
// GEOLOCATION HOOK (Browser API)
// ============================================================================

interface GeolocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export const useGeolocation = () => {
  const [state, setState] = useState<UseApiState<GeolocationCoordinates>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetch = useCallback(async () => {
    setState({ data: null, loading: true, error: null });

    if (!navigator.geolocation) {
      setState({ data: null, loading: false, error: 'Geolocation not supported' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: GeolocationCoordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        setState({ data: coords, loading: false, error: null });
      },
      (error) => {
        setState({ data: null, loading: false, error: error.message });
      }
    );
  }, []);

  return { ...state, fetch };
};

/**
 * Trending & Nearby API Service
 * Handles all API calls for trending and location-based features
 * Date: March 17, 2026
 */

import api from '@/utils/api';
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

// ============================================================================
// TRENDING INFLUENCERS
// ============================================================================

/**
 * Get trending influencers based on engagement, followers, growth
 * @param params - Query parameters for filtering and pagination
 */
export const getTrendingInfluencers = async (
  params?: TrendingInfluencersQueryParams
): Promise<TrendingInfluencersResponse> => {
  const queryParams: Record<string, any> = {};
  if (params?.limit) queryParams.limit = params.limit;
  if (params?.timeRange) queryParams.timeRange = params.timeRange;
  if (params?.category) queryParams.category = params.category;
  if (params?.minEngagement) queryParams.minEngagement = params.minEngagement;
  if (params?.minFollowers) queryParams.minFollowers = params.minFollowers;
  if (params?.sortBy) queryParams.sortBy = params.sortBy;
  if (params?.page) queryParams.page = params.page;

  const response = await api.get('/trending/influencers', { params: queryParams });
  return response.data;
};

// ============================================================================
// TRENDING CAMPAIGNS
// ============================================================================

/**
 * Get trending campaigns based on applications, budget, engagement
 * @param params - Query parameters for filtering and pagination
 */
export const getTrendingCampaigns = async (
  params?: TrendingCampaignsQueryParams
): Promise<TrendingCampaignsResponse> => {
  const p: Record<string, any> = {};
  if (params?.limit) p.limit = params.limit;
  if (params?.timeRange) p.timeRange = params.timeRange;
  if (params?.category) p.category = params.category;
  if (params?.minBudget) p.minBudget = params.minBudget;
  if (params?.sortBy) p.sortBy = params.sortBy;
  if (params?.page) p.page = params.page;
  const response = await api.get('/campaigns/trending', { params: p });
  return response.data;
};

// ============================================================================
// TRENDING BRANDS
// ============================================================================

/**
 * Get trending brands based on active campaigns, budget, followers
 * @param params - Query parameters for filtering and pagination
 */
export const getTrendingBrands = async (
  params?: TrendingBrandsQueryParams
): Promise<TrendingBrandsResponse> => {
  const p: Record<string, any> = {};
  if (params?.limit) p.limit = params.limit;
  if (params?.timeRange) p.timeRange = params.timeRange;
  if (params?.industry) p.industry = params.industry;
  if (params?.minBudget) p.minBudget = params.minBudget;
  if (params?.sortBy) p.sortBy = params.sortBy;
  if (params?.page) p.page = params.page;
  const response = await api.get('/brands/trending', { params: p });
  return response.data;
};

// ============================================================================
// TRENDING CATEGORIES
// ============================================================================

/**
 * Get trending categories/niches
 */
export const getTrendingCategories = async (): Promise<TrendingCategoriesResponse> => {
  const response = await api.get('/categories/trending');
  return response.data;
};

export const getTrendingDashboard = async (): Promise<TrendingDashboard> => {
  const response = await api.get('/trending/dashboard');
  return response.data;
};

// ============================================================================
// NEARBY INFLUENCERS
// ============================================================================

/**
 * Get nearby influencers based on geographic location
 * @param params - Location and filter parameters
 */
export const getNearbyInfluencers = async (
  params: NearbyInfluencersQueryParams
): Promise<NearbyInfluencersResponse> => {
  if (!params.latitude || !params.longitude) {
    throw new Error('Latitude and longitude are required');
  }
  const p: Record<string, any> = {
    latitude: params.latitude,
    longitude: params.longitude,
  };
  if (params.radius) p.radius = params.radius;
  if (params.limit) p.limit = params.limit;
  if (params.category) p.category = params.category;
  if (params.minFollowers) p.minFollowers = params.minFollowers;
  if (params.maxDistance) p.maxDistance = params.maxDistance;
  if (params.page) p.page = params.page;
  const response = await api.get('/influencers/nearby', { params: p });
  return response.data;
};

export const searchInfluencersByLocation = async (
  city: string,
  country: string
): Promise<NearbyInfluencersResponse> => {
  const response = await api.get('/influencers/location/search', { params: { city, country } });
  return response.data;
};

// ============================================================================
// NEARBY BRANDS
// ============================================================================

/**
 * Get nearby brands based on geographic location
 * @param params - Location and filter parameters
 */
export const getNearbyBrands = async (
  params: NearbyBrandsQueryParams
): Promise<NearbyBrandsResponse> => {
  if (!params.latitude || !params.longitude) {
    throw new Error('Latitude and longitude are required');
  }
  const p: Record<string, any> = {
    latitude: params.latitude,
    longitude: params.longitude,
  };
  if (params.radius) p.radius = params.radius;
  if (params.limit) p.limit = params.limit;
  if (params.industry) p.industry = params.industry;
  if (params.minActiveCampaigns) p.minActiveCampaigns = params.minActiveCampaigns;
  if (params.maxDistance) p.maxDistance = params.maxDistance;
  if (params.page) p.page = params.page;
  const response = await api.get('/brands/nearby', { params: p });
  return response.data;
};

export const searchBrandsByLocation = async (
  city: string,
  country: string
): Promise<NearbyBrandsResponse> => {
  const response = await api.get('/brands/location/search', { params: { city, country } });
  return response.data;
};

// ============================================================================
// NEARBY CAMPAIGNS
// ============================================================================

/**
 * Get campaigns nearby based on brand location
 * @param params - Location and filter parameters
 */
export const getNearbyCampaigns = async (
  params: NearbyCampaignsQueryParams
): Promise<NearbyCampaignsResponse> => {
  const body: Record<string, any> = {
    page: params.page || 1,
    limit: params.limit || 20,
  };

  // Prefer city/state/country (doc-specified payload) over lat/lng
  if ((params as any).city) body.city = (params as any).city;
  if ((params as any).state) body.state = (params as any).state;
  if ((params as any).country) body.country = (params as any).country;
  if (params.category) body.category = params.category;

  const response = await api.post('/campaigns/nearby', body);
  return response.data;
};

// ============================================================================
// LOCATION MANAGEMENT
// ============================================================================

/**
 * Update user's location
 * @param location - Location details
 * @param token - Auth token
 */
export const updateUserLocation = async (
  location: UpdateUserLocationRequest,
  // token param kept for API compatibility but axios sends it automatically
  _token?: string
): Promise<UpdateUserLocationResponse> => {
  const response = await api.post('/users/location', location);
  return response.data;
};

export const getSupportedLocations = async (
  params?: SupportedLocationsQueryParams
): Promise<SupportedLocationsResponse> => {
  const p: Record<string, any> = {};
  if (params?.country) p.country = params.country;
  if (params?.search) p.search = params.search;
  if (params?.limit) p.limit = params.limit;
  if (params?.page) p.page = params.page;
  const response = await api.get('/locations/supported', { params: p });
  return response.data;
};

export const getNearbyDashboard = async (
  latitude: number,
  longitude: number
): Promise<NearbyDashboard> => {
  if (!latitude || !longitude) {
    throw new Error('Latitude and longitude are required');
  }
  const response = await api.get('/nearby/dashboard', { params: { latitude, longitude } });
  return response.data;
};

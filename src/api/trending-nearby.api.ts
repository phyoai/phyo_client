/**
 * Trending & Nearby API Service
 * Handles all API calls for trending and location-based features
 * Date: March 17, 2026
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ?? 'http://localhost:4000';
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
  const queryString = new URLSearchParams();

  if (params?.limit) queryString.append('limit', params.limit.toString());
  if (params?.timeRange) queryString.append('timeRange', params.timeRange);
  if (params?.category) queryString.append('category', params.category);
  if (params?.minEngagement) queryString.append('minEngagement', params.minEngagement.toString());
  if (params?.minFollowers) queryString.append('minFollowers', params.minFollowers.toString());
  if (params?.sortBy) queryString.append('sortBy', params.sortBy);
  if (params?.page) queryString.append('page', params.page.toString());

  const response = await fetch(`${API_BASE_URL}/api/influencers/trending?${queryString}`);
  if (!response.ok) throw new Error(`Failed to fetch trending influencers: ${response.statusText}`);
  return response.json();
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
  const queryString = new URLSearchParams();

  if (params?.limit) queryString.append('limit', params.limit.toString());
  if (params?.timeRange) queryString.append('timeRange', params.timeRange);
  if (params?.category) queryString.append('category', params.category);
  if (params?.minBudget) queryString.append('minBudget', params.minBudget.toString());
  if (params?.sortBy) queryString.append('sortBy', params.sortBy);
  if (params?.page) queryString.append('page', params.page.toString());

  const response = await fetch(`${API_BASE_URL}/api/campaigns/trending?${queryString}`);
  if (!response.ok) throw new Error(`Failed to fetch trending campaigns: ${response.statusText}`);
  return response.json();
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
  const queryString = new URLSearchParams();

  if (params?.limit) queryString.append('limit', params.limit.toString());
  if (params?.timeRange) queryString.append('timeRange', params.timeRange);
  if (params?.industry) queryString.append('industry', params.industry);
  if (params?.minBudget) queryString.append('minBudget', params.minBudget.toString());
  if (params?.sortBy) queryString.append('sortBy', params.sortBy);
  if (params?.page) queryString.append('page', params.page.toString());

  const response = await fetch(`${API_BASE_URL}/api/brands/trending?${queryString}`);
  if (!response.ok) throw new Error(`Failed to fetch trending brands: ${response.statusText}`);
  return response.json();
};

// ============================================================================
// TRENDING CATEGORIES
// ============================================================================

/**
 * Get trending categories/niches
 */
export const getTrendingCategories = async (): Promise<TrendingCategoriesResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/categories/trending`);
  if (!response.ok) throw new Error(`Failed to fetch trending categories: ${response.statusText}`);
  return response.json();
};

// ============================================================================
// TRENDING DASHBOARD
// ============================================================================

/**
 * Get all trending data (influencers, campaigns, brands, categories)
 */
export const getTrendingDashboard = async (): Promise<TrendingDashboard> => {
  const response = await fetch(`${API_BASE_URL}/api/trending/dashboard`);
  if (!response.ok) throw new Error(`Failed to fetch trending dashboard: ${response.statusText}`);
  return response.json();
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

  const queryString = new URLSearchParams();
  queryString.append('latitude', params.latitude.toString());
  queryString.append('longitude', params.longitude.toString());

  if (params.radius) queryString.append('radius', params.radius.toString());
  if (params.limit) queryString.append('limit', params.limit.toString());
  if (params.category) queryString.append('category', params.category);
  if (params.minFollowers) queryString.append('minFollowers', params.minFollowers.toString());
  if (params.maxDistance) queryString.append('maxDistance', params.maxDistance.toString());
  if (params.page) queryString.append('page', params.page.toString());

  const response = await fetch(`${API_BASE_URL}/api/influencers/nearby?${queryString}`);
  if (!response.ok) throw new Error(`Failed to fetch nearby influencers: ${response.statusText}`);
  return response.json();
};

/**
 * Search influencers by location (city/country)
 */
export const searchInfluencersByLocation = async (
  city: string,
  country: string
): Promise<NearbyInfluencersResponse> => {
  const queryString = new URLSearchParams();
  queryString.append('city', city);
  queryString.append('country', country);

  const response = await fetch(`${API_BASE_URL}/api/influencers/location/search?${queryString}`);
  if (!response.ok) throw new Error(`Failed to search influencers by location: ${response.statusText}`);
  return response.json();
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

  const queryString = new URLSearchParams();
  queryString.append('latitude', params.latitude.toString());
  queryString.append('longitude', params.longitude.toString());

  if (params.radius) queryString.append('radius', params.radius.toString());
  if (params.limit) queryString.append('limit', params.limit.toString());
  if (params.industry) queryString.append('industry', params.industry);
  if (params.minActiveCampaigns) queryString.append('minActiveCampaigns', params.minActiveCampaigns.toString());
  if (params.maxDistance) queryString.append('maxDistance', params.maxDistance.toString());
  if (params.page) queryString.append('page', params.page.toString());

  const response = await fetch(`${API_BASE_URL}/api/brands/nearby?${queryString}`);
  if (!response.ok) throw new Error(`Failed to fetch nearby brands: ${response.statusText}`);
  return response.json();
};

/**
 * Search brands by location (city/country)
 */
export const searchBrandsByLocation = async (
  city: string,
  country: string
): Promise<NearbyBrandsResponse> => {
  const queryString = new URLSearchParams();
  queryString.append('city', city);
  queryString.append('country', country);

  const response = await fetch(`${API_BASE_URL}/api/brands/location/search?${queryString}`);
  if (!response.ok) throw new Error(`Failed to search brands by location: ${response.statusText}`);
  return response.json();
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
  if (!params.latitude || !params.longitude) {
    throw new Error('Latitude and longitude are required');
  }

  const queryString = new URLSearchParams();
  queryString.append('latitude', params.latitude.toString());
  queryString.append('longitude', params.longitude.toString());

  if (params.radius) queryString.append('radius', params.radius.toString());
  if (params.limit) queryString.append('limit', params.limit.toString());
  if (params.category) queryString.append('category', params.category);
  if (params.minBudget) queryString.append('minBudget', params.minBudget.toString());
  if (params.maxDistance) queryString.append('maxDistance', params.maxDistance.toString());
  if (params.page) queryString.append('page', params.page.toString());

  const response = await fetch(`${API_BASE_URL}/api/campaigns/nearby?${queryString}`);
  if (!response.ok) throw new Error(`Failed to fetch nearby campaigns: ${response.statusText}`);
  return response.json();
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
  token: string
): Promise<UpdateUserLocationResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/users/location`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(location),
  });

  if (!response.ok) throw new Error(`Failed to update user location: ${response.statusText}`);
  return response.json();
};

/**
 * Get list of supported locations/cities
 * @param params - Search and pagination parameters
 */
export const getSupportedLocations = async (
  params?: SupportedLocationsQueryParams
): Promise<SupportedLocationsResponse> => {
  const queryString = new URLSearchParams();

  if (params?.country) queryString.append('country', params.country);
  if (params?.search) queryString.append('search', params.search);
  if (params?.limit) queryString.append('limit', params.limit.toString());
  if (params?.page) queryString.append('page', params.page.toString());

  const response = await fetch(`${API_BASE_URL}/api/locations/supported?${queryString}`);
  if (!response.ok) throw new Error(`Failed to fetch supported locations: ${response.statusText}`);
  return response.json();
};

// ============================================================================
// NEARBY DASHBOARD
// ============================================================================

/**
 * Get all nearby data based on user's current location
 * @param latitude - User's latitude
 * @param longitude - User's longitude
 */
export const getNearbyDashboard = async (
  latitude: number,
  longitude: number
): Promise<NearbyDashboard> => {
  if (!latitude || !longitude) {
    throw new Error('Latitude and longitude are required');
  }

  const queryString = new URLSearchParams();
  queryString.append('latitude', latitude.toString());
  queryString.append('longitude', longitude.toString());

  const response = await fetch(`${API_BASE_URL}/api/nearby/dashboard?${queryString}`);
  if (!response.ok) throw new Error(`Failed to fetch nearby dashboard: ${response.statusText}`);
  return response.json();
};

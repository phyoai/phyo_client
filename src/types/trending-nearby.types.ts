/**
 * Trending & Nearby APIs Type Definitions
 * Generated from API_INTEGRATION_REPORT.md
 * Date: March 17, 2026
 */

// ============================================================================
// TRENDING INFLUENCERS
// ============================================================================

export interface TrendingInfluencer {
  _id: string;
  id: string;
  name: string;
  username: string;
  avatar: string;
  followers: number;
  engagement: number; // percentage (e.g., 5.8)
  engagementTrend: number; // +/- change from last period
  category: string[];
  trendingScore: number; // 0-100 ranking score
  growth: {
    weekly: number;
    monthly: number;
    quarterly: number;
  };
  platforms: {
    instagram: number;
    youtube: number;
    twitter: number;
    tiktok: number;
  };
  lastActive: string; // ISO timestamp
}

export interface TrendingInfluencersResponse {
  data: TrendingInfluencer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  metadata: {
    timeRange: string;
    generatedAt: string; // ISO timestamp
  };
}

export interface TrendingInfluencersQueryParams {
  limit?: number; // default: 10
  timeRange?: 'week' | 'month' | 'all'; // default: 'week'
  category?: string; // filter by niche
  minEngagement?: number; // minimum engagement rate (0-100)
  minFollowers?: number; // minimum follower count
  sortBy?: 'engagement' | 'followers' | 'growth'; // default: 'engagement'
  page?: number;
}

// ============================================================================
// TRENDING CAMPAIGNS
// ============================================================================

export interface TrendingCampaign {
  _id: string;
  title: string;
  description: string;
  brand: {
    id: string;
    name: string;
    companyName: string;
    avatar: string;
  };
  budget: number;
  applications: number;
  appliedInfluencers?: number;
  category: string[];
  trendingScore: number;
  applicationGrowth: number; // +/- from last period
  estimatedReach: number;
  platforms: string[];
  status: 'Draft' | 'Active' | 'Closed' | 'Completed';
  deadline: string; // ISO timestamp
  startDate: string; // ISO timestamp
  endDate: string; // ISO timestamp
}

export interface TrendingCampaignsResponse {
  data: TrendingCampaign[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  metadata: {
    timeRange: string;
    generatedAt: string;
  };
}

export interface TrendingCampaignsQueryParams {
  limit?: number; // default: 6
  timeRange?: 'week' | 'month' | 'all';
  category?: string;
  minBudget?: number;
  sortBy?: 'applications' | 'budget' | 'engagement';
  page?: number;
}

// ============================================================================
// TRENDING BRANDS
// ============================================================================

export interface TrendingBrand {
  _id: string;
  id: string;
  companyName: string;
  industry: string;
  avatar: string;
  description: string;
  followers: number;
  campaigns: number; // total campaigns created
  activeCampaigns: number; // currently active campaigns
  avgBudget: number;
  trendingScore: number;
  campaignGrowth: number;
  platforms: {
    instagram: number;
    youtube: number;
    twitter: number;
    tiktok: number;
  };
  location: {
    city?: string;
    state?: string;
    country: string;
  };
  website?: string;
}

export interface TrendingBrandsResponse {
  data: TrendingBrand[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  metadata: {
    timeRange: string;
    generatedAt: string;
  };
}

export interface TrendingBrandsQueryParams {
  limit?: number; // default: 6
  timeRange?: 'week' | 'month' | 'all';
  industry?: string;
  minBudget?: number;
  sortBy?: 'campaigns' | 'budget' | 'followers';
  page?: number;
}

// ============================================================================
// TRENDING CATEGORIES/NICHES
// ============================================================================

export interface TrendingCategory {
  name: string;
  influencerCount: number;
  campaignCount: number;
  activeInfluencers: number;
  trendingScore: number;
  growth: number; // percentage
  topInfluencers: Partial<TrendingInfluencer>[]; // top 3
  description: string;
}

export interface TrendingCategoriesResponse {
  data: TrendingCategory[];
  timestamp: string; // ISO timestamp
}

// ============================================================================
// NEARBY INFLUENCERS
// ============================================================================

export interface NearbyInfluencer {
  _id: string;
  id: string;
  name: string;
  username: string;
  avatar: string;
  followers: number;
  engagement: number;
  category: string[];
  distance: number; // in kilometers
  location: {
    city: string;
    state?: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  bio?: string;
  platforms: {
    instagram: number;
    youtube: number;
    twitter: number;
    tiktok: number;
  };
}

export interface NearbyInfluencersResponse {
  data: NearbyInfluencer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  searchCenter: {
    latitude: number;
    longitude: number;
    radiusKm: number;
  };
}

export interface NearbyInfluencersQueryParams {
  latitude: number; // required
  longitude: number; // required
  radius?: number; // in kilometers, default: 50
  limit?: number; // default: 10
  category?: string;
  minFollowers?: number;
  maxDistance?: number;
  page?: number;
}

// ============================================================================
// NEARBY BRANDS
// ============================================================================

export interface NearbyBrand {
  _id: string;
  id: string;
  companyName: string;
  industry: string;
  avatar: string;
  distance: number; // in kilometers
  location: {
    city: string;
    state?: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  activeCampaigns: number;
  followers: number;
  website?: string;
  description?: string;
}

export interface NearbyBrandsResponse {
  data: NearbyBrand[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  searchCenter: {
    latitude: number;
    longitude: number;
    radiusKm: number;
  };
}

export interface NearbyBrandsQueryParams {
  latitude: number; // required
  longitude: number; // required
  radius?: number; // in kilometers, default: 50
  limit?: number; // default: 10
  industry?: string;
  minActiveCampaigns?: number;
  maxDistance?: number;
  page?: number;
}

// ============================================================================
// NEARBY CAMPAIGNS
// ============================================================================

export interface NearbyCampaign {
  _id: string;
  title: string;
  description: string;
  brand: {
    id: string;
    companyName: string;
    avatar: string;
  };
  budget: number;
  distance: number; // in kilometers
  location: {
    city: string;
    state?: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  category: string[];
  status: 'Draft' | 'Active' | 'Closed' | 'Completed';
  deadline: string; // ISO timestamp
  applicationsCount: number;
}

export interface NearbyCampaignsResponse {
  data: NearbyCampaign[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  searchCenter: {
    latitude: number;
    longitude: number;
    radiusKm: number;
  };
}

export interface NearbyCampaignsQueryParams {
  latitude: number; // required
  longitude: number; // required
  radius?: number; // in kilometers, default: 50
  limit?: number; // default: 10
  category?: string;
  minBudget?: number;
  maxDistance?: number;
  page?: number;
}

// ============================================================================
// LOCATION MANAGEMENT
// ============================================================================

export interface UserLocation {
  city: string;
  state?: string;
  country: string;
  latitude: number;
  longitude: number;
  isPublic: boolean;
}

export interface UpdateUserLocationRequest {
  city: string;
  state?: string;
  country: string;
  latitude: number;
  longitude: number;
  isPublic: boolean; // allow location visibility
}

export interface UpdateUserLocationResponse {
  success: boolean;
  message: string;
  location: UserLocation;
  updatedAt: string; // ISO timestamp
}

export interface SupportedLocation {
  city: string;
  state?: string;
  country: string;
  latitude: number;
  longitude: number;
  active: boolean;
  influencerCount?: number;
  brandCount?: number;
}

export interface SupportedLocationsResponse {
  data: SupportedLocation[];
  count: number;
  timestamp: string; // ISO timestamp
}

export interface SupportedLocationsQueryParams {
  country?: string;
  search?: string; // search by city name
  limit?: number; // default: 50
  page?: number;
}

// ============================================================================
// COMBINED/AGGREGATE TRENDING DATA
// ============================================================================

export interface TrendingDashboard {
  trendingInfluencers: TrendingInfluencer[];
  trendingCampaigns: TrendingCampaign[];
  trendingBrands: TrendingBrand[];
  trendingCategories: TrendingCategory[];
  timestamp: string; // ISO timestamp
}

// ============================================================================
// COMBINED/AGGREGATE NEARBY DATA
// ============================================================================

export interface NearbyDashboard {
  nearbyInfluencers: NearbyInfluencer[];
  nearbyBrands: NearbyBrand[];
  nearbyCampaigns: NearbyCampaign[];
  userLocation: UserLocation;
  timestamp: string; // ISO timestamp
}

// ============================================================================
// QUERY PARAMETER COMBINATIONS
// ============================================================================

export interface SearchNearbyQueryParams {
  type: 'influencers' | 'brands' | 'campaigns';
  latitude: number;
  longitude: number;
  radius?: number;
  category?: string;
  limit?: number;
  page?: number;
}

export interface FilteredTrendingQueryParams {
  type: 'influencers' | 'campaigns' | 'brands' | 'categories';
  timeRange?: 'week' | 'month' | 'all';
  limit?: number;
  sortBy?: string;
  page?: number;
  filters?: Record<string, any>;
}

// ============================================================================
// API RESPONSE WRAPPER
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

/**
 * API and Types Index
 * Central export point for all API utilities and type definitions
 *
 * Usage:
 * import { campaignApi, influencerApi } from '@/api';
 * import type { ICampaign, IInfluencer, ICampaignCreate } from '@/api';
 */

// Export all API functions
export { campaignApi, createCampaignFormData } from './campaign-api';
export { influencerApi, buildInfluencerFilter, validateInfluencerFilter } from './influencer-api';
export { accountApi } from './account-api';
export { notificationApi } from './notification-api';
export { favoritesApi } from './favorites-api';
export { messageApi } from './message-api';
export { projectApi } from './project-api';
export { adminApi, type IBrandApprovalRequest, type IInfluencerApprovalRequest, type IApproval, type IAdminUser, type IBlockedUser, type ISystemStats } from './admin-api';
export { analyticsApi, type IDashboardAnalytics, type IDashboardMetrics, type ICampaignMetric, type IInfluencerMetric, type IReportData, type ITrendChart, type ITrendDataPoint } from './analytics-api';
export { metaApi, type IFacebookAccount, type IFacebookMetric, type IFacebookInsight, type ISyncHistory, type IMetaDashboard } from './meta-api';

// Export all types and interfaces
export type {
  // Pagination & Common
  IPagination,
  IApiResponse,
  IErrorResponse,
  // Campaign Types
  ICompensation,
  ITimelines,
  IFollowerRange,
  IAgeRange,
  ITargetInfluencer,
  ICampaignFilter,
  ICampaign,
  ICampaignCreate,
  ICampaignUpdate,
  ICampaignResponse,
  IPaginatedCampaigns,
  IApplyCampaignRequest,
  ICampaignApplication,
  ICampaignActionResponse,
  // Influencer Types
  ISocialMediaStats,
  IInfluencerStats,
  IInfluencerProfile,
  IInfluencer,
  IInfluencerFilter,
  IInfluencerResponse,
  IPaginatedInfluencers,
  // User & Brand Types
  IUser,
  IBrand,
  IBrandSignup,
  IServiceProvider,
  // Auth Types
  IAuthResponse,
  ILoginRequest,
  ISignupRequest,
  // Request/Response Types
  ISelectInfluencerRequest,
  IListQueryParams,
  // Readonly types
  ReadonlyPagination,
  ReadonlyApiResponse,
  ReadonlyErrorResponse,
  ReadonlyCampaign,
  ReadonlyInfluencer,
} from '@/types';

// Export enum values
export {
  CampaignStatus,
  CampaignType,
  CompensationType,
  UserRole,
  Gender,
} from '@/types';

// Export utility functions
export { isErrorResponse, hasPagination } from '@/types';

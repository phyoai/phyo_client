/**
 * Comprehensive TypeScript Types and Interfaces for Phyo API
 * Generated from Postman Collection Analysis
 *
 * This file contains all type definitions for:
 * - Campaign management
 * - Influencer profiles
 * - User and brand data
 * - Common API response structures
 */

// ============================================================================
// ENUMS
// ============================================================================

/**
 * Campaign status enumeration
 */
export enum CampaignStatus {
  Draft = 'Draft',
  Active = 'Active',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
  Archived = 'Archived',
}

/**
 * Campaign type enumeration
 */
export enum CampaignType {
  ProductPromotion = 'Product Promotion',
  ContentCreation = 'Content Creation',
  BrandAwareness = 'Brand Awareness',
  EventPromotion = 'Event Promotion',
  ProductLaunch = 'Product Launch',
  Influencer = 'Influencer',
  SocialMedia = 'Social Media',
  Other = 'Other',
}

/**
 * Compensation type enumeration
 */
export enum CompensationType {
  Monetary = 'Monetary',
  Barter = 'Barter',
  Gifting = 'Gifting',
  Affiliate = 'Affiliate',
  Commission = 'Commission',
  Hybrid = 'Hybrid',
}

/**
 * User role enumeration
 */
export enum UserRole {
  Brand = 'BRAND',
  Influencer = 'INFLUENCER',
  ServiceProvider = 'SERVICE_PROVIDER',
  Admin = 'ADMIN',
  User = 'USER',
}

/**
 * Gender enumeration
 */
export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
  NotSpecified = 'Not Specified',
}

// ============================================================================
// PAGINATION & COMMON TYPES
// ============================================================================

/**
 * Pagination metadata for list responses
 */
export interface IPagination {
  /** Current page number (1-indexed) */
  page: number;
  /** Number of items per page */
  limit: number;
  /** Total number of items */
  total: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether there are more pages */
  hasNextPage: boolean;
  /** Whether there are previous pages */
  hasPreviousPage: boolean;
}

/**
 * Standard API response wrapper
 */
export interface IApiResponse<T = any> {
  /** Success status */
  success: boolean;
  /** Response data payload */
  data?: T;
  /** Error message if any */
  message?: string;
  /** Response status code */
  statusCode?: number;
  /** Pagination info (for list responses) */
  pagination?: IPagination;
  /** Timestamps */
  timestamp?: string;
}

/**
 * Error response structure
 */
export interface IErrorResponse {
  /** Success flag (always false) */
  success: false;
  /** Error message */
  message: string;
  /** HTTP status code */
  statusCode: number;
  /** Error code or type */
  code?: string;
  /** Additional error details */
  details?: Record<string, any>;
  /** Validation errors (for form validation) */
  errors?: Record<string, string[]>;
}

// ============================================================================
// CAMPAIGN TYPES
// ============================================================================

/**
 * Compensation details for a campaign
 */
export interface ICompensation {
  /** Type of compensation */
  type: CompensationType;
  /** Monetary amount */
  amount?: number;
  /** Currency code (USD, EUR, etc.) */
  currency?: string;
  /** Description of compensation terms */
  description?: string;
  /** Additional compensation details */
  [key: string]: any;
}

/**
 * Campaign timeline information
 */
export interface ITimelines {
  /** Application deadline */
  applicationDeadline: string | Date;
  /** Campaign start date */
  campaignStartDate: string | Date;
  /** Campaign end date */
  campaignEndDate: string | Date;
  /** Content submission deadline (optional) */
  contentDeadline?: string | Date;
  /** Payment date (optional) */
  paymentDate?: string | Date;
}

/**
 * Follower count range
 */
export interface IFollowerRange {
  /** Minimum follower count */
  min: number;
  /** Maximum follower count */
  max: number;
}

/**
 * Age range specification
 */
export interface IAgeRange {
  /** Minimum age */
  min: number;
  /** Maximum age */
  max: number;
}

/**
 * Target influencer criteria
 */
export interface ITargetInfluencer {
  /** Number of influencers to target */
  numberOfInfluencers: number;
  /** Target niches/categories */
  targetNiche: string[];
  /** Follower count range */
  followerCount: IFollowerRange;
  /** Target countries */
  countries: string[];
  /** Target gender(s) */
  gender: Gender[];
  /** Target age range */
  ageRange: IAgeRange;
  /** Additional criteria */
  [key: string]: any;
}

/**
 * Campaign filter parameters
 */
export interface ICampaignFilter {
  /** Filter by campaign status */
  status?: CampaignStatus | string;
  /** Filter by campaign type */
  campaignType?: CampaignType | string;
  /** Filter by brand ID */
  brandId?: string;
  /** Search in campaign name, brief, or type */
  search?: string;
  /** Filter by target niche */
  niche?: string;
  /** Minimum budget filter */
  minBudget?: number;
  /** Maximum budget filter */
  maxBudget?: number;
  /** Sort field */
  sortBy?: string;
  /** Sort order (asc/desc) */
  sortOrder?: 'asc' | 'desc';
}

/**
 * Full campaign object
 */
export interface ICampaign {
  /** Unique campaign identifier */
  _id: string;
  /** Brand/owner ID */
  brandId: string;
  /** Campaign name */
  campaignName: string;
  /** Campaign type */
  campaignType: CampaignType | string;
  /** Campaign description/brief */
  campaignBrief: string;
  /** List of deliverables */
  deliverables: string[];
  /** Compensation details */
  compensation: ICompensation;
  /** Total campaign budget */
  budget: number;
  /** Campaign timelines */
  timelines: ITimelines;
  /** Target influencer criteria */
  targetInfluencer: ITargetInfluencer;
  /** Number of live posts required */
  numberOfLivePosts?: number;
  /** Reel URLs */
  reels?: string[];
  /** Campaign status */
  status: CampaignStatus | string;
  /** Product images URLs */
  productImages?: string[];
  /** Number of applicants */
  applicantCount?: number;
  /** Number of selected influencers */
  selectedCount?: number;
  /** Campaign creation date */
  createdAt: string;
  /** Campaign last update date */
  updatedAt: string;
  /** Additional campaign data */
  [key: string]: any;
}

/**
 * Campaign create request payload
 */
export interface ICampaignCreate {
  /** Campaign name (required) */
  campaignName: string;
  /** Campaign type (required) */
  campaignType: CampaignType | string;
  /** Campaign description/brief (required) */
  campaignBrief: string;
  /** Campaign goal / objective (optional) */
  campaignGoal?: string;
  /** List of deliverables (required) */
  deliverables: string[];
  /** Compensation details (required) */
  compensation: ICompensation;
  /** Total campaign budget (required) */
  budget: number;
  /** Campaign timelines (required) */
  timelines: ITimelines;
  /** Target influencer criteria (required) */
  targetInfluencer: ITargetInfluencer;
  /** Product images files (required) - FormData only */
  productImages?: File[];
  /** Number of live posts required (optional) */
  numberOfLivePosts?: number;
  /** Reel URLs (optional) */
  reels?: string[];
  /** Campaign status (optional, defaults to 'Draft') */
  status?: CampaignStatus | string;
}

/**
 * Campaign update request payload
 */
export interface ICampaignUpdate {
  /** Campaign name (optional) */
  campaignName?: string;
  /** Campaign type (optional) */
  campaignType?: CampaignType | string;
  /** Campaign description/brief (optional) */
  campaignBrief?: string;
  /** List of deliverables (optional) */
  deliverables?: string[];
  /** Compensation details (optional) */
  compensation?: Partial<ICompensation>;
  /** Total campaign budget (optional) */
  budget?: number;
  /** Campaign timelines (optional) */
  timelines?: Partial<ITimelines>;
  /** Target influencer criteria (optional) */
  targetInfluencer?: Partial<ITargetInfluencer>;
  /** Product images files (optional) - FormData only */
  productImages?: File[];
  /** Number of live posts required (optional) */
  numberOfLivePosts?: number;
  /** Reel URLs (optional) */
  reels?: string[];
  /** Campaign status (optional) */
  status?: CampaignStatus | string;
}

/**
 * Campaign API response
 */
export interface ICampaignResponse extends IApiResponse<ICampaign> {}

/**
 * Paginated campaigns list response
 */
export interface IPaginatedCampaigns extends IApiResponse<ICampaign[]> {
  pagination: IPagination;
}

/**
 * Apply to campaign request payload
 */
export interface IApplyCampaignRequest {
  /** Optional message from influencer */
  message?: string;
  /** Portfolio or sample work URL */
  portfolioUrl?: string;
  /** Additional information */
  [key: string]: any;
}

/**
 * Campaign application
 */
export interface ICampaignApplication {
  /** Application ID */
  _id: string;
  /** Campaign ID */
  campaignId: string;
  /** Influencer ID */
  influencerId: string;
  /** Application status */
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  /** Application message */
  message?: string;
  /** Application date */
  createdAt: string;
}

// ============================================================================
// INFLUENCER TYPES
// ============================================================================

/**
 * Social media statistics
 */
export interface ISocialMediaStats {
  /** Platform name (Instagram, TikTok, YouTube, etc.) */
  platform: string;
  /** Follower count */
  followers: number;
  /** Following count */
  following: number;
  /** Posts/videos count */
  postsCount: number;
  /** Engagement rate (percentage) */
  engagementRate: number;
  /** Average likes per post */
  avgLikes?: number;
  /** Average comments per post */
  avgComments?: number;
  /** Profile URL */
  profileUrl?: string;
  /** Username */
  username?: string;
}

/**
 * Influencer statistics
 */
export interface IInfluencerStats {
  /** Total followers across platforms */
  totalFollowers: number;
  /** Average engagement rate */
  avgEngagementRate: number;
  /** Primary niche/category */
  primaryNiche: string;
  /** Secondary niches */
  secondaryNiches: string[];
  /** Audience demographics */
  audienceDemographics?: {
    ageRanges?: Record<string, number>;
    genderDistribution?: Record<string, number>;
    topCountries?: string[];
    topCities?: string[];
  };
  /** Social media platforms */
  socialMedia: ISocialMediaStats[];
  /** Total campaigns completed */
  campaignsCompleted: number;
  /** Campaign success rate */
  successRate?: number;
}

/**
 * Influencer profile information
 */
export interface IInfluencerProfile {
  /** User ID */
  userId: string;
  /** Full name */
  name: string;
  /** Username/handle */
  username: string;
  /** Email address */
  email: string;
  /** Bio/description */
  bio?: string;
  /** Profile picture URL */
  profilePicture?: string;
  /** Website URL */
  website?: string;
  /** Location/country */
  location?: string;
  /** Gender */
  gender?: Gender;
  /** Date of birth */
  dateOfBirth?: string;
  /** Phone number */
  phoneNumber?: string;
  /** Verification status */
  isVerified: boolean;
  /** Account status */
  accountStatus: 'active' | 'inactive' | 'suspended';
}

/**
 * Full influencer object
 */
export interface IInfluencer {
  /** Unique influencer identifier */
  _id: string;
  /** Profile information */
  profile: IInfluencerProfile;
  /** Statistics and metrics */
  stats: IInfluencerStats;
  /** Niches/categories the influencer specializes in */
  niches: string[];
  /** Collaborations history */
  collaborations?: {
    totalCollaborations: number;
    brands: string[];
  };
  /** Languages spoken */
  languages?: string[];
  /** Availability status */
  isAvailable: boolean;
  /** Rates/pricing info */
  rates?: {
    postRate?: number;
    reelRate?: number;
    storyRate?: number;
    currency?: string;
  };
  /** Bio/about */
  about?: string;
  /** Verification badge info */
  verified?: boolean;
  /** Account creation date */
  createdAt: string;
  /** Last profile update date */
  updatedAt: string;
  /** Additional influencer data */
  [key: string]: any;
}

/**
 * Influencer filter parameters
 */
export interface IInfluencerFilter {
  /** Filter by niche */
  niche?: string;
  /** Minimum follower count */
  minFollowers?: number;
  /** Maximum follower count */
  maxFollowers?: number;
  /** Filter by country */
  country?: string;
  /** Filter by gender */
  gender?: Gender;
  /** Minimum engagement rate */
  minEngagement?: number;
  /** Maximum engagement rate */
  maxEngagement?: number;
  /** Search query */
  search?: string;
  /** Filter by verification status */
  verified?: boolean;
  /** Sort field */
  sortBy?: string;
  /** Sort order */
  sortOrder?: 'asc' | 'desc';
}

/**
 * Influencer API response
 */
export interface IInfluencerResponse extends IApiResponse<IInfluencer> {}

/**
 * Paginated influencers list response
 */
export interface IPaginatedInfluencers extends IApiResponse<IInfluencer[]> {
  pagination: IPagination;
}

// ============================================================================
// USER & BRAND TYPES
// ============================================================================

/**
 * User/Account base information
 */
export interface IUser {
  /** Unique user identifier */
  _id: string;
  /** Full name */
  name: string;
  /** Email address */
  email: string;
  /** User type/role */
  type: UserRole | string;
  /** Account status */
  accountStatus: 'active' | 'inactive' | 'suspended';
  /** Email verified flag */
  emailVerified: boolean;
  /** Phone number */
  phoneNumber?: string;
  /** Profile picture */
  profilePicture?: string;
  /** Account creation date */
  createdAt: string;
  /** Last update date */
  updatedAt: string;
}

/**
 * Brand user information
 */
export interface IBrand extends IUser {
  /** Company/brand name */
  companyName: string;
  /** Industry */
  industry?: string;
  /** Company website */
  website?: string;
  /** Company description */
  description?: string;
  /** Company logo URL */
  logo?: string;
  /** Company size */
  companySize?: string;
  /** Location */
  location?: string;
  /** Contact person name */
  contactName?: string;
  /** Contact email */
  contactEmail?: string;
  /** Brand verification status */
  isVerified: boolean;
  /** Tax ID or business registration */
  taxId?: string;
  /** Social media links */
  socialMedia?: Record<string, string>;
}

/**
 * Brand signup payload
 */
export interface IBrandSignup {
  /** Company/brand name */
  companyName: string;
  /** Email address */
  email: string;
  /** Password */
  password: string;
  /** Industry */
  industry?: string;
  /** Company website */
  website?: string;
  /** Company description */
  description?: string;
  /** Company size */
  companySize?: string;
  /** Contact person name */
  contactName?: string;
  /** Contact phone */
  contactPhone?: string;
}

/**
 * Service Provider/Business user information
 */
export interface IServiceProvider extends IUser {
  /** Business name */
  businessName: string;
  /** Service type */
  serviceType: string;
  /** Business description */
  businessDescription?: string;
  /** Years of experience */
  yearsOfExperience?: number;
  /** Service categories */
  serviceCategories: string[];
  /** Portfolio URL */
  portfolioUrl?: string;
  /** Hourly rate */
  hourlyRate?: number;
  /** Rating/review score */
  rating?: number;
  /** Number of completed projects */
  completedProjects?: number;
}

// ============================================================================
// AUTHENTICATION & AUTH RESPONSE TYPES
// ============================================================================

/**
 * Authentication response with token
 */
export interface IAuthResponse extends IApiResponse {
  data?: {
    /** JWT token */
    token: string;
    /** Token expiration time */
    expiresIn?: number;
    /** User information */
    user?: IUser;
    /** User type */
    type?: UserRole | string;
  };
}

/**
 * Login request payload
 */
export interface ILoginRequest {
  /** Email address */
  email: string;
  /** Password */
  password: string;
}

/**
 * Signup request payload
 */
export interface ISignupRequest {
  /** Email address */
  email: string;
  /** Password */
  password: string;
  /** User type */
  type: UserRole | string;
  /** Full name */
  name: string;
  /** Username (for some user types) */
  username?: string;
}

// ============================================================================
// REQUEST/RESPONSE COMBINED TYPES
// ============================================================================

/**
 * Select influencer for campaign request
 */
export interface ISelectInfluencerRequest {
  /** Influencer ID to select */
  influencerId: string;
  /** Selection notes/comments (optional) */
  notes?: string;
}

/**
 * Campaign actions response
 */
export interface ICampaignActionResponse extends IApiResponse {
  data?: {
    message: string;
    campaignId: string;
    [key: string]: any;
  };
}

/**
 * List query parameters
 */
export interface IListQueryParams {
  /** Page number (1-indexed) */
  page?: number;
  /** Items per page */
  limit?: number;
  /** Sort field */
  sortBy?: string;
  /** Sort order */
  sortOrder?: 'asc' | 'desc';
  /** Search query */
  search?: string;
}

// ============================================================================
// EXPORT TYPE GUARDS & UTILITY TYPES
// ============================================================================

/**
 * Type guard to check if response is an error
 */
export function isErrorResponse(response: any): response is IErrorResponse {
  return response?.success === false && response?.message;
}

/**
 * Type guard to check if response has pagination
 */
export function hasPagination(response: any): response is IApiResponse & { pagination: IPagination } {
  return !!response?.pagination;
}

/**
 * Create read-only versions of types for API responses
 */
export type ReadonlyPagination = Readonly<IPagination>;
export type ReadonlyApiResponse<T = any> = Readonly<IApiResponse<T>>;
export type ReadonlyErrorResponse = Readonly<IErrorResponse>;
export type ReadonlyCampaign = Readonly<ICampaign>;
export type ReadonlyInfluencer = Readonly<IInfluencer>;

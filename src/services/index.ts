/**
 * Services Index
 * Central export point for all API services
 *
 * This file aggregates all services for easy importing across the application
 * Usage: import { AuthService, CampaignService } from '@/services'
 */

// API Client
export { APIClient, apiClient } from "./api-client";
export type { APIResponse } from "./api-client";

// Authentication Service
export { AuthService } from "./auth-service";
export type {
  AuthResponse,
  SignupPayload,
  LoginPayload,
  ForgotPasswordPayload,
  VerifyResetCodePayload,
  ResetPasswordPayload,
  VerifyOTPPayload,
  ResendOTPPayload,
  GoogleAuthPayload,
} from "./auth-service";

// Campaign Service
export { CampaignService } from "./campaign-service";
export type {
  Campaign,
  CreateCampaignPayload,
  UpdateCampaignPayload,
  Milestone,
  TeamMember,
} from "./campaign-service";

// Brand Service
export { BrandService } from "./brand-service";
export type {
  Brand,
  BrandSignupPayload,
  UpdateBrandPayload,
  ChangePasswordPayload as BrandChangePasswordPayload,
  BrandRequest,
} from "./brand-service";

// Influencer Service
export { InfluencerService } from "./influencer-service";
export type {
  Influencer,
  InfluencerRequest,
  CreateInfluencerPayload,
  UpdateInfluencerPayload,
} from "./influencer-service";

// Messaging Service
export { MessagingService } from "./messaging-service";
export type {
  Conversation,
  Message,
  CreateConversationPayload as MessagingCreateConversationPayload,
  SendMessagePayload,
} from "./messaging-service";

// Notification Service
export { NotificationService } from "./notification-service";
export type {
  Notification,
  NotificationSettings,
  UpdateNotificationSettingsPayload,
} from "./notification-service";

// Analytics Service
export { AnalyticsService } from "./analytics-service";
export type {
  DashboardData,
  InfluencerPerformance,
  CampaignPerformance,
  Report,
  EarningsData,
} from "./analytics-service";

// Payment Service
export { PaymentService } from "./payment-service";
export type {
  PaymentPlan,
  Subscription,
  PaymentTransaction,
  PaymentMethod,
} from "./payment-service";

// User Service
export { UserService } from "./user-service";
export type {
  UserProfile,
  UpdateProfilePayload,
  ChangePasswordPayload,
  UpdateEmailPayload,
  UpdatePhonePayload,
  NotificationPreferences,
} from "./user-service";

// Admin Service
export { AdminService } from "./admin-service";
export type {
  AdminProfile,
  AdminRequest,
  AdminStatistics,
} from "./admin-service";

// Utility Service
export { UtilityService } from "./utility-service";
export type {
  Collaboration,
  Review,
  Portfolio,
  Project,
} from "./utility-service";

// Conversation Service
export { ConversationService } from "./conversation-service";
export type {
  IConversation,
  CreateConversationPayload,
} from "./conversation-service";

// Portfolio Service
export { PortfolioService } from "./portfolio-service";
export type {
  IPortfolio,
  IPortfolioClient,
  CreatePortfolioPayload,
  UpdatePortfolioPayload,
  CreateClientPayload,
} from "./portfolio-service";

// Project Service
export { ProjectService } from "./project-service";
export type {
  IProject,
  CreateProjectPayload,
  UpdateProjectPayload,
  ProjectStats,
} from "./project-service";

// File Upload Service
export { FileUploadService } from "./file-upload-service";
export type {
  IUploadResponse,
} from "./file-upload-service";

// Trending Service
export { TrendingService } from "./trending-service";
export type {
  ITrendingInfluencer,
  ITrendingCampaign,
  ITrendingBrand,
  ITrendingCategory,
} from "./trending-service";

// AI Search Service
export { AISearchService } from "./ai-search-service";
export type {
  IAISearchResult,
  IInfluencerDetails,
  IDebugInfo,
} from "./ai-search-service";

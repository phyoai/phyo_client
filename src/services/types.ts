// ============================================================================
// AUTHENTICATION TYPES
// ============================================================================

export interface SignupRequest {
  email: string;
  password: string;
  confirmPassword: string;
  role: 'brand' | 'influencer' | 'admin';
  firstName?: string;
  lastName?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  role?: 'brand' | 'influencer' | 'admin';
}

export interface AuthResponse {
  token: string;
  user: User;
  refreshToken?: string;
}

export interface ResetPasswordRequest {
  email: string;
  password: string;
  token: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface GoogleAuthRequest {
  token: string;
  role: string;
}

// ============================================================================
// USER TYPES
// ============================================================================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'brand' | 'influencer' | 'admin';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  bio?: string;
  website?: string;
  phone?: string;
  location?: string;
  profileImage?: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  bio?: string;
  website?: string;
  phone?: string;
  location?: string;
  profileImage?: string;
}

export interface UserSearchResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
}

// ============================================================================
// CAMPAIGN TYPES
// ============================================================================

export interface Campaign {
  id: string;
  title: string;
  description: string;
  brand: User;
  startDate: string;
  endDate: string;
  budget: number;
  status: 'active' | 'completed' | 'paused';
  influencerCount: number;
  createdAt: string;
}

export interface CreateCampaignRequest {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  targetAudience?: string;
  requiredFollowers?: number;
  campaignType?: string;
}

export interface UpdateCampaignRequest {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  status?: string;
}

export interface CampaignInfluencer {
  id: string;
  influencer: User;
  status: 'applied' | 'selected' | 'rejected';
  appliedAt: string;
}

// ============================================================================
// CONVERSATION & MESSAGE TYPES
// ============================================================================

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversation: string;
  sender: User;
  content: string;
  fileUrl?: string;
  fileName?: string;
  isRead: boolean;
  createdAt: string;
}

export interface CreateMessageRequest {
  conversationId: string;
  content: string;
  file?: File;
}

export interface MarkAsReadRequest {
  messageIds: string[];
}

// ============================================================================
// FILE UPLOAD TYPES
// ============================================================================

export interface UploadResponse {
  id: string;
  url: string;
  key: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
}

export interface FileMetadata {
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
}

// ============================================================================
// INFLUENCER TYPES
// ============================================================================

export interface Influencer {
  id: string;
  user: User;
  username: string;
  bio: string;
  followers: number;
  engagement: number;
  categories: string[];
  platforms: string[];
  avatar: string;
  verified: boolean;
  rating: number;
}

export interface CreateInfluencerRequest {
  username: string;
  bio: string;
  categories: string[];
  platforms: string[];
  socialMediaLinks?: Record<string, string>;
}

export interface InfluencerSearchRequest {
  query?: string;
  category?: string;
  minFollowers?: number;
  maxFollowers?: number;
  platforms?: string[];
  sortBy?: 'followers' | 'engagement' | 'rating';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface InfluencerSearchResponse {
  data: Influencer[];
  total: number;
  page: number;
  pages: number;
}

// ============================================================================
// PROJECT TYPES
// ============================================================================

export interface Project {
  id: string;
  title: string;
  description: string;
  owner: User;
  status: 'active' | 'completed' | 'archived';
  startDate: string;
  endDate?: string;
  createdAt: string;
}

export interface CreateProjectRequest {
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
}

export interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
}

// ============================================================================
// PORTFOLIO TYPES
// ============================================================================

export interface Portfolio {
  id: string;
  influencer: User;
  title: string;
  description: string;
  images: string[];
  clients: PortfolioClient[];
  rating: number;
  createdAt: string;
}

export interface PortfolioClient {
  id: string;
  name: string;
  industry: string;
  rating: number;
  description: string;
}

export interface CreatePortfolioRequest {
  title: string;
  description: string;
  images: string[];
}

export interface AddClientRequest {
  name: string;
  industry: string;
  rating: number;
  description: string;
}

// ============================================================================
// PAYMENT TYPES
// ============================================================================

export interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  credits: number;
  features: string[];
  popular?: boolean;
}

export interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export interface PaymentVerification {
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
}

export interface PaymentHistory {
  id: string;
  amount: number;
  currency: string;
  status: string;
  credits: number;
  date: string;
}

export interface CurrentPlan {
  planName: string;
  credits: number;
  creditsUsed: number;
  renewalDate: string;
  autoRenewal: boolean;
}

// ============================================================================
// ADMIN TYPES
// ============================================================================

export interface AdminRequest {
  id: string;
  type: 'brand' | 'influencer' | 'other';
  user: User;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalBrands: number;
  totalInfluencers: number;
  totalCampaigns: number;
  totalEarnings: number;
  pendingRequests: number;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ============================================================================
// BRAND REQUEST TYPES
// ============================================================================

export interface BrandRequest {
  id: string;
  brand: User;
  influencer: User;
  campaignId?: string;
  type: string;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBrandRequestRequest {
  influencerId: string;
  campaignId?: string;
  type: string;
  message?: string;
}

// ============================================================================
// INFLUENCER REQUEST TYPES
// ============================================================================

export interface InfluencerRequest {
  id: string;
  influencer: User;
  brand: User;
  campaignId?: string;
  type: string;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInfluencerRequestRequest {
  brandId: string;
  campaignId?: string;
  type: string;
  message?: string;
}

// ============================================================================
// ASK/SEARCH TYPES
// ============================================================================

export interface AskSearchRequest {
  query: string;
  filters?: {
    category?: string;
    platform?: string;
    minFollowers?: number;
    maxFollowers?: number;
  };
}

export interface AskSearchResponse {
  results: any[];
  query: string;
  timestamp: string;
}

export interface ReelData {
  id: string;
  url: string;
  caption: string;
  likes: number;
  comments: number;
  shares: number;
}

// ============================================================================
// META/INSTAGRAM TYPES
// ============================================================================

export interface MetaOAuthResponse {
  url: string;
  state: string;
}

export interface MetaStatus {
  connected: boolean;
  accountId?: string;
  accountName?: string;
  connectedAt?: string;
}

export interface AdAccount {
  id: string;
  name: string;
  currency: string;
  timezone: string;
  status: string;
}

export interface CampaignInsights {
  campaignId: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  roi: number;
}

export interface PageInsights {
  pageId: string;
  followers: number;
  engagement: number;
  reach: number;
  impressions: number;
}

// ============================================================================
// PAGINATION TYPES
// ============================================================================

export interface PaginationParams {
  page?: number;
  limit?: number;
  skip?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pages: number;
  limit: number;
}

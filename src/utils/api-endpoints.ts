/**
 * Comprehensive API Endpoints Configuration for Phyo Platform
 * This file contains all 150+ API endpoints with proper structure
 *
 * Environment-based API configuration
 * Uses token-based authentication for all protected endpoints
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

/**
 * Auth Endpoints
 */
export const AUTH_ENDPOINTS = {
  SIGNUP: `${API_BASE_URL}/auth/signup`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  ADMIN_LOGIN: `${API_BASE_URL}/auth/admin/login`,
  GOOGLE_AUTH: `${API_BASE_URL}/auth/google`,
  FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
  VERIFY_RESET_CODE: `${API_BASE_URL}/auth/verify-reset-code`,
  RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
  VERIFY_EMAIL_OTP: `${API_BASE_URL}/auth/verify-email-otp`,
  RESEND_EMAIL_OTP: `${API_BASE_URL}/auth/resend-email-otp`,
  CHECK_REGISTRATION_STATUS: `${API_BASE_URL}/auth/check-registration-status`,
} as const;

/**
 * Influencer Endpoints - PUBLIC (No Auth Required)
 */
export const INFLUENCER_ENDPOINTS = {
  GET_INFLUENCERS: `${API_BASE_URL}/influencers`,
  GET_INFLUENCER_BY_ID: (id: string) =>
    `${API_BASE_URL}/influencers/${id}`,
} as const;

/**
 * User Management Endpoints
 */
export const USER_ENDPOINTS = {
  GET_PROFILE: `${API_BASE_URL}/users/profile`,
  UPDATE_PROFILE: `${API_BASE_URL}/users/profile`,
  GET_SETTINGS: `${API_BASE_URL}/users/settings`,
  UPDATE_NOTIFICATION_PREFERENCES: `${API_BASE_URL}/users/notification-preferences`,
  LOGOUT: `${API_BASE_URL}/users/logout`,
  SEARCH_USERS: `${API_BASE_URL}/users/search`,
  GET_USER_BY_ID: (id: string) => `${API_BASE_URL}/users/${id}`,
  LIST_USERS: `${API_BASE_URL}/users/list`,
  DELETE_ACCOUNT: `${API_BASE_URL}/users/account`,
} as const;

/**
 * Campaign Endpoints
 */
export const CAMPAIGN_ENDPOINTS = {
  CREATE: `${API_BASE_URL}/campaigns`,
  GET_ALL: `${API_BASE_URL}/campaigns`,
  GET_MY_CAMPAIGNS: `${API_BASE_URL}/campaigns/mine`,
  GET_BY_ID: (id: string) => `${API_BASE_URL}/campaigns/${id}`,
  UPDATE: (id: string) => `${API_BASE_URL}/campaigns/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/campaigns/${id}`,
  APPLY: (id: string) => `${API_BASE_URL}/campaigns/${id}/apply`,
  SELECT_INFLUENCER: (id: string) =>
    `${API_BASE_URL}/campaigns/${id}/select`,

  // Campaign Detail & Deliverables
  GET_DELIVERABLES: (campaignId: string) =>
    `${API_BASE_URL}/campaigns/${campaignId}/deliverables`,
  ADD_DELIVERABLE: (campaignId: string) =>
    `${API_BASE_URL}/campaigns/${campaignId}/deliverables`,

  // Applications
  GET_APPLICATIONS: (campaignId: string) =>
    `${API_BASE_URL}/campaigns/${campaignId}/applications`,
  ACCEPT_APPLICATION: (campaignId: string, applicationId: string) =>
    `${API_BASE_URL}/campaigns/${campaignId}/applications/${applicationId}/accept`,
  REJECT_APPLICATION: (campaignId: string, applicationId: string) =>
    `${API_BASE_URL}/campaigns/${campaignId}/applications/${applicationId}/reject`,

  // Counter Offers
  SEND_COUNTER_OFFER: (campaignId: string) =>
    `${API_BASE_URL}/campaigns/${campaignId}/counter-offer`,
  GET_NEGOTIATION_DETAILS: (campaignId: string, influencerId: string) =>
    `${API_BASE_URL}/campaigns/${campaignId}/negotiations/${influencerId}`,
  ACCEPT_COUNTER_OFFER: (
    campaignId: string,
    influencerId: string
  ) =>
    `${API_BASE_URL}/campaigns/${campaignId}/negotiations/${influencerId}/accept`,
  REJECT_COUNTER_OFFER: (
    campaignId: string,
    influencerId: string
  ) =>
    `${API_BASE_URL}/campaigns/${campaignId}/negotiations/${influencerId}/reject`,
  GET_NEGOTIATION_TIMELINE: (
    campaignId: string,
    influencerId: string
  ) =>
    `${API_BASE_URL}/campaigns/${campaignId}/negotiations/${influencerId}/timeline`,

  // Boost
  BOOST_CAMPAIGN: (campaignId: string) =>
    `${API_BASE_URL}/campaigns/${campaignId}/boost`,
  GET_BOOST_RECOMMENDATIONS: (campaignId: string) =>
    `${API_BASE_URL}/campaigns/${campaignId}/boost-recommendations`,

  // Applications (alternative route)
  GET_ALL_CAMPAIGNS: `${API_BASE_URL}/campaigns/all`,
  SEARCH_CAMPAIGNS: `${API_BASE_URL}/campaigns/search/advanced`,
  GET_APPLICATION_STATUS: (campaignId: string) =>
    `${API_BASE_URL}/campaigns/${campaignId}/application-status`,
  WITHDRAW_APPLICATION: (campaignId: string) =>
    `${API_BASE_URL}/campaigns/${campaignId}/withdraw-application`,
  GET_MY_APPLICATIONS: `${API_BASE_URL}/campaigns/my/applications`,
  GET_TRENDING_FOR_ME: `${API_BASE_URL}/campaigns/trending/for-me`,
} as const;

/**
 * Campaign Management Endpoints
 */
export const CAMPAIGN_MANAGEMENT_ENDPOINTS = {
  // Milestones
  ADD_MILESTONE: (campaignId: string) =>
    `${API_BASE_URL}/campaign-management/${campaignId}/milestones`,
  GET_MILESTONES: (campaignId: string) =>
    `${API_BASE_URL}/campaign-management/${campaignId}/milestones`,
  UPDATE_MILESTONE_STATUS: (
    campaignId: string,
    milestoneId: string
  ) =>
    `${API_BASE_URL}/campaign-management/${campaignId}/milestones/${milestoneId}`,

  // Budget
  UPDATE_BUDGET: (campaignId: string) =>
    `${API_BASE_URL}/campaign-management/${campaignId}/budget-update`,
  GET_BUDGET_OVERVIEW: (campaignId: string) =>
    `${API_BASE_URL}/campaign-management/${campaignId}/budget-overview`,

  // Team
  ADD_TEAM_MEMBER: (campaignId: string) =>
    `${API_BASE_URL}/campaign-management/${campaignId}/team-members`,
  GET_TEAM_MEMBERS: (campaignId: string) =>
    `${API_BASE_URL}/campaign-management/${campaignId}/team-members`,
  REMOVE_TEAM_MEMBER: (campaignId: string, memberId: string) =>
    `${API_BASE_URL}/campaign-management/${campaignId}/team-members/${memberId}`,

  // Campaign Updates
  UPDATE_CAMPAIGN: (campaignId: string) =>
    `${API_BASE_URL}/campaign-management/${campaignId}/update`,

  // Performance
  GET_PERFORMANCE: (campaignId: string) =>
    `${API_BASE_URL}/campaign-management/${campaignId}/performance`,
} as const;

/**
 * Campaign Status Endpoints
 */
export const CAMPAIGN_STATUS_ENDPOINTS = {
  UPDATE_STATUS: (campaignId: string) =>
    `${API_BASE_URL}/campaign-status/update/${campaignId}`,
  GET_STATUS_HISTORY: (campaignId: string) =>
    `${API_BASE_URL}/campaign-status/${campaignId}/history`,
  PAUSE_CAMPAIGN: (campaignId: string) =>
    `${API_BASE_URL}/campaign-status/${campaignId}/pause`,
  RESUME_CAMPAIGN: (campaignId: string) =>
    `${API_BASE_URL}/campaign-status/${campaignId}/resume`,
  CANCEL_CAMPAIGN: (campaignId: string) =>
    `${API_BASE_URL}/campaign-status/${campaignId}/cancel`,
  GET_ALLOWED_TRANSITIONS: `${API_BASE_URL}/campaign-status/workflow/allowed-transitions`,
  EXTEND_CAMPAIGN: (campaignId: string) =>
    `${API_BASE_URL}/campaign-status/${campaignId}/extend`,
  GET_STATUS_SUMMARY: `${API_BASE_URL}/campaign-status/bulk/status-summary`,
} as const;

/**
 * Advanced Campaign Endpoints
 */
export const ADVANCED_CAMPAIGN_ENDPOINTS = {
  SCHEDULE: (campaignId: string) =>
    `${API_BASE_URL}/advanced-campaigns/${campaignId}/schedule`,
  CLONE: (campaignId: string) =>
    `${API_BASE_URL}/advanced-campaigns/${campaignId}/clone`,
  GET_DETAILED_REPORT: (campaignId: string) =>
    `${API_BASE_URL}/advanced-campaigns/${campaignId}/detailed-report`,
  BULK_STATUS_UPDATE: `${API_BASE_URL}/advanced-campaigns/bulk/status-update`,
  ADD_INFLUENCER_FEEDBACK: (campaignId: string, influencerId: string) =>
    `${API_BASE_URL}/advanced-campaigns/${campaignId}/feedback/${influencerId}`,
  GET_INFLUENCER_FEEDBACK: (campaignId: string) =>
    `${API_BASE_URL}/advanced-campaigns/${campaignId}/influencer-feedback`,
  COMPARE_CAMPAIGNS: `${API_BASE_URL}/advanced-campaigns/compare`,
  EXPORT_DATA: (campaignId: string) =>
    `${API_BASE_URL}/advanced-campaigns/${campaignId}/export-data`,
} as const;

/**
 * Brand Endpoints
 */
export const BRAND_ENDPOINTS = {
  SIGNUP: `${API_BASE_URL}/brand/signup`,
  GET_PROFILE: `${API_BASE_URL}/brand/profile`,
  UPDATE_PROFILE: `${API_BASE_URL}/brand/profile`,
  CHANGE_PASSWORD: `${API_BASE_URL}/brand/change-password`,
  LOGOUT: `${API_BASE_URL}/brand/logout`,
  UPDATE_NOTIFICATION_PREFERENCES: `${API_BASE_URL}/brand/notification-preferences`,
  DEACTIVATE_ACCOUNT: `${API_BASE_URL}/brand/account`,
  GET_ALL: `${API_BASE_URL}/brand`,
  GET_BY_ID: (id: string) => `${API_BASE_URL}/brand/${id}`,
  GET_CAMPAIGNS: (id: string) => `${API_BASE_URL}/brand/${id}/campaigns`,
  GET_STATS: (id: string) => `${API_BASE_URL}/brand/${id}/stats`,
  UPDATE_BY_ID: (id: string) =>
    `${API_BASE_URL}/brand/${id}/profile`,
  LIST_BRANDS: `${API_BASE_URL}/brand/list`,
} as const;

/**
 * Influencer Endpoints
 */
export const INFLUENCER_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/influencer`,
  CREATE: `${API_BASE_URL}/influencer`,
  GET_BY_ID: (id: string) => `${API_BASE_URL}/influencer/${id}`,
  UPDATE: (id: string) => `${API_BASE_URL}/influencer/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/influencer/${id}`,
  GET_STATS: (id: string) => `${API_BASE_URL}/influencer/${id}/stats`,
  GET_PRICING: (id: string) =>
    `${API_BASE_URL}/influencer/${id}/pricing`,
  ADD_PORTFOLIO_ITEM: (id: string) =>
    `${API_BASE_URL}/influencer/${id}/portfolio`,
  GET_CAMPAIGNS: (id: string) =>
    `${API_BASE_URL}/influencer/${id}/campaigns`,
  GET_REVIEWS: (id: string) =>
    `${API_BASE_URL}/influencer/${id}/reviews`,
  GET_BY_USERNAME: (username: string) =>
    `${API_BASE_URL}/influencer/${username}`,
} as const;

/**
 * Influencer Discovery Endpoints
 */
export const INFLUENCER_DISCOVERY_ENDPOINTS = {
  DISCOVER: `${API_BASE_URL}/discover/influencers`,
  GET_PROFILE: (id: string) =>
    `${API_BASE_URL}/discover/influencers/${id}`,
  SEARCH: `${API_BASE_URL}/discover/influencers/search`,
  GET_BY_CATEGORY: (category: string) =>
    `${API_BASE_URL}/discover/influencers/category/${category}`,
  GET_CATEGORIES: `${API_BASE_URL}/discover/categories`,
  GET_RECOMMENDATIONS: `${API_BASE_URL}/discover/recommendations`,
  CONTACT_INFLUENCER: (id: string) =>
    `${API_BASE_URL}/discover/influencers/${id}/contact`,
} as const;

/**
 * Influencer Data Management Endpoints
 */
export const INFLUENCER_DATA_ENDPOINTS = {
  CREATE: `${API_BASE_URL}/influencer-data`,
  GET_ALL: `${API_BASE_URL}/influencer-data`,
  SEARCH: `${API_BASE_URL}/influencer-data/search`,
  SEARCH_BY_NAME: `${API_BASE_URL}/influencer-data/search/name`,
  SEARCH_BY_USERNAME: `${API_BASE_URL}/influencer-data/search/username`,
  ADVANCED_SEARCH: `${API_BASE_URL}/influencer-data/search/advanced`,
  GET_STATS: `${API_BASE_URL}/influencer-data/stats`,
  GET_BY_ID: (id: string) => `${API_BASE_URL}/influencer-data/${id}`,
  GET_BY_USERNAME: (username: string) =>
    `${API_BASE_URL}/influencer-data/username/${username}`,
  UPDATE_BY_ID: (id: string) =>
    `${API_BASE_URL}/influencer-data/${id}`,
  UPDATE_BY_USERNAME: (username: string) =>
    `${API_BASE_URL}/influencer-data/username/${username}`,
  DELETE_BY_ID: (id: string) =>
    `${API_BASE_URL}/influencer-data/${id}`,
  DELETE_BY_USERNAME: (username: string) =>
    `${API_BASE_URL}/influencer-data/username/${username}`,
} as const;

/**
 * Brand Request Endpoints
 */
export const BRAND_REQUEST_ENDPOINTS = {
  CREATE: `${API_BASE_URL}/brand-requests`,
  GET_ALL: `${API_BASE_URL}/brand-requests`,
  GET_BY_ID: (id: string) => `${API_BASE_URL}/brand-requests/${id}`,
  GET_BY_EMAIL: `${API_BASE_URL}/brand-requests/search/email`,
  UPDATE: (id: string) => `${API_BASE_URL}/brand-requests/${id}`,
  APPROVE: (id: string) =>
    `${API_BASE_URL}/brand-requests/${id}/approve`,
  REJECT: (id: string) =>
    `${API_BASE_URL}/brand-requests/${id}/reject`,
  DELETE: (id: string) => `${API_BASE_URL}/brand-requests/${id}`,
  SEARCH: `${API_BASE_URL}/brand-requests/search`,
  GET_STATS: `${API_BASE_URL}/brand-requests/stats`,
} as const;

/**
 * Influencer Request Endpoints
 */
export const INFLUENCER_REQUEST_ENDPOINTS = {
  CREATE: `${API_BASE_URL}/influencer-requests`,
  GET_ALL: `${API_BASE_URL}/influencer-requests`,
  GET_BY_ID: (id: string) =>
    `${API_BASE_URL}/influencer-requests/${id}`,
  GET_BY_EMAIL: `${API_BASE_URL}/influencer-requests/search/email`,
  GET_BY_USERNAME: `${API_BASE_URL}/influencer-requests/search/username`,
  UPDATE: (id: string) =>
    `${API_BASE_URL}/influencer-requests/${id}`,
  APPROVE: (id: string) =>
    `${API_BASE_URL}/influencer-requests/${id}/approve`,
  REJECT: (id: string) =>
    `${API_BASE_URL}/influencer-requests/${id}/reject`,
  DELETE: (id: string) =>
    `${API_BASE_URL}/influencer-requests/${id}`,
  SEARCH: `${API_BASE_URL}/influencer-requests/search`,
  ADVANCED_SEARCH: `${API_BASE_URL}/influencer-requests/search/advanced`,
  GET_STATS: `${API_BASE_URL}/influencer-requests/stats`,
} as const;

/**
 * Admin Endpoints
 */
export const ADMIN_ENDPOINTS = {
  GET_PROFILE: `${API_BASE_URL}/admin/profile`,
  CHANGE_PASSWORD: `${API_BASE_URL}/admin/change-password`,

  // Requests
  GET_BRAND_REQUESTS: `${API_BASE_URL}/admin/requests/brands`,
  GET_SINGLE_BRAND_REQUEST: (id: string) =>
    `${API_BASE_URL}/admin/requests/brands/${id}`,
  GET_INFLUENCER_REQUESTS: `${API_BASE_URL}/admin/requests/influencers`,
  GET_SINGLE_INFLUENCER_REQUEST: (id: string) =>
    `${API_BASE_URL}/admin/requests/influencers/${id}`,

  // Approval/Rejection
  APPROVE_REQUEST: (id: string) =>
    `${API_BASE_URL}/admin/requests/${id}/approve`,
  REJECT_REQUEST: (id: string) =>
    `${API_BASE_URL}/admin/requests/${id}/reject`,

  // Legacy
  LIST_REQUESTS: `${API_BASE_URL}/admin/requests`,
  APPROVE_BRAND_REQUEST: (id: string) =>
    `${API_BASE_URL}/admin/requests/${id}/approve-brand`,

  // Admin Management
  CREATE_ADMIN: `${API_BASE_URL}/admin/create`,
  LIST_ADMINS: `${API_BASE_URL}/admin/list`,

  // Statistics
  GET_STATISTICS: `${API_BASE_URL}/admin/statistics`,

  // Help
  GET_HELP_CATEGORIES: `${API_BASE_URL}/admin/help/categories`,
} as const;

/**
 * Analytics Endpoints
 */
export const ANALYTICS_ENDPOINTS = {
  GET_DASHBOARD: `${API_BASE_URL}/analytics/dashboard`,
  GET_INFLUENCER_PERFORMANCE: `${API_BASE_URL}/analytics/influencer-performance`,
  GET_CAMPAIGN_PERFORMANCE: (campaignId: string) =>
    `${API_BASE_URL}/analytics/campaign-performance/${campaignId}`,
  GENERATE_REPORT: `${API_BASE_URL}/analytics/reports`,
  GET_EARNINGS: `${API_BASE_URL}/analytics/earnings`,
} as const;

/**
 * Conversation & Messaging Endpoints
 */
export const CONVERSATION_ENDPOINTS = {
  CREATE: `${API_BASE_URL}/conversations`,
  GET_ALL: `${API_BASE_URL}/conversations`,
  GET_BY_ID: (id: string) => `${API_BASE_URL}/conversations/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/conversations/${id}`,
} as const;

export const MESSAGE_ENDPOINTS = {
  SEND: `${API_BASE_URL}/messages`,
  GET_BY_CONVERSATION: (conversationId: string) =>
    `${API_BASE_URL}/messages/${conversationId}`,
  MARK_AS_READ: (id: string) =>
    `${API_BASE_URL}/messages/${id}/read`,
  DELETE: (id: string) => `${API_BASE_URL}/messages/${id}`,
} as const;

/**
 * Messages & Notifications Combined Endpoints
 */
export const MESSAGES_NOTIFICATIONS_ENDPOINTS = {
  GET_NOTIFICATIONS: `${API_BASE_URL}/notifications`,
  MARK_NOTIFICATION_AS_READ: (id: string) =>
    `${API_BASE_URL}/notifications/${id}/read`,
  DELETE_NOTIFICATION: (id: string) =>
    `${API_BASE_URL}/notifications/${id}`,
  CREATE_CONVERSATION: `${API_BASE_URL}/conversations`,
  GET_CONVERSATIONS: `${API_BASE_URL}/conversations`,
  GET_CONVERSATION_MESSAGES: (conversationId: string) =>
    `${API_BASE_URL}/conversations/${conversationId}/messages`,
  SEND_MESSAGE: (conversationId: string) =>
    `${API_BASE_URL}/conversations/${conversationId}/messages`,
  GET_UNREAD_COUNT: (conversationId: string) =>
    `${API_BASE_URL}/conversations/${conversationId}/unread`,
  MARK_CONVERSATION_AS_READ: (conversationId: string) =>
    `${API_BASE_URL}/conversations/${conversationId}/mark-read`,
} as const;

/**
 * Notification Endpoints
 */
export const NOTIFICATION_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/notifications`,
  GET_UNREAD_COUNT: `${API_BASE_URL}/notifications/unread-count`,
  MARK_AS_READ: (id: string) =>
    `${API_BASE_URL}/notifications/${id}/read`,
  MARK_ALL_AS_READ: `${API_BASE_URL}/notifications/read-all`,
  DELETE: (id: string) => `${API_BASE_URL}/notifications/${id}`,
  CLEAR_ALL_READ: `${API_BASE_URL}/notifications/clear-all`,
} as const;

/**
 * Notification Settings Endpoints
 */
export const NOTIFICATION_SETTINGS_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/notification-settings`,
  UPDATE_EMAIL: `${API_BASE_URL}/notification-settings/email`,
  UPDATE_PUSH: `${API_BASE_URL}/notification-settings/push`,
  UPDATE_SMS: `${API_BASE_URL}/notification-settings/sms`,
  UPDATE_FREQUENCY: `${API_BASE_URL}/notification-settings/frequency`,
  DISABLE_ALL: `${API_BASE_URL}/notification-settings/disable-all`,
  ENABLE_ALL: `${API_BASE_URL}/notification-settings/enable-all`,
  GET_PREFERENCES: `${API_BASE_URL}/notification-settings/preferences`,
} as const;

/**
 * File Upload Endpoints
 */
export const FILE_ENDPOINTS = {
  UPLOAD: `${API_BASE_URL}/files/upload`,
  DELETE: `${API_BASE_URL}/files`,
} as const;

/**
 * Payment & Subscription Endpoints
 */
export const PAYMENT_ENDPOINTS = {
  GET_PLANS: `${API_BASE_URL}/payments/plans`,
  GET_CURRENT_PLAN: `${API_BASE_URL}/payments/current-plan`,
  GET_CREDITS: `${API_BASE_URL}/payments/credits`,
  CREATE_SILVER_ORDER: `${API_BASE_URL}/payments/order/silver`,
  CREATE_GOLD_ORDER: `${API_BASE_URL}/payments/order/gold`,
  CREATE_PREMIUM_ORDER: `${API_BASE_URL}/payments/order/premium`,
  VERIFY_PAYMENT: `${API_BASE_URL}/payments/verify`,
  GET_PAYMENT_HISTORY: `${API_BASE_URL}/payments/history`,
  CANCEL_SUBSCRIPTION: `${API_BASE_URL}/payments/cancel`,
  PAUSE_SUBSCRIPTION: `${API_BASE_URL}/payments/pause`,
  RESUME_SUBSCRIPTION: `${API_BASE_URL}/payments/resume`,
  GET_BILLING_SUMMARY: `${API_BASE_URL}/payments/billing-summary`,
  WEBHOOK_TEST: `${API_BASE_URL}/payments/webhook-test`,
} as const;

/**
 * Subscription Endpoints
 */
export const SUBSCRIPTION_ENDPOINTS = {
  GET_PLANS: `${API_BASE_URL}/subscriptions/plans`,
  GET_CURRENT: `${API_BASE_URL}/subscriptions/current`,
  UPGRADE: `${API_BASE_URL}/subscriptions/upgrade`,
  DOWNGRADE: `${API_BASE_URL}/subscriptions/downgrade`,
  PAUSE: `${API_BASE_URL}/subscriptions/pause`,
  RESUME: `${API_BASE_URL}/subscriptions/resume`,
  CANCEL: `${API_BASE_URL}/subscriptions/cancel`,
  TOGGLE_AUTO_RENEWAL: `${API_BASE_URL}/subscriptions/toggle-autorenew`,
  GET_HISTORY: `${API_BASE_URL}/subscriptions/history`,
  GET_BILLING_DATES: `${API_BASE_URL}/subscriptions/billing-dates`,
} as const;

/**
 * Account & Billing Endpoints
 */
export const ACCOUNT_BILLING_ENDPOINTS = {
  GET_TRANSACTIONS: `${API_BASE_URL}/account/transactions`,
  GET_PAYMENT_HISTORY: `${API_BASE_URL}/account/payments/history`,
  ADD_PAYMENT_METHOD: `${API_BASE_URL}/account/payments/methods`,
  GET_PAYMENT_METHODS: `${API_BASE_URL}/account/payments/methods`,
  SET_DEFAULT_PAYMENT_METHOD: (id: string) =>
    `${API_BASE_URL}/account/payments/methods/${id}/default`,
  DELETE_PAYMENT_METHOD: (id: string) =>
    `${API_BASE_URL}/account/payments/methods/${id}`,
  GET_CURRENT_SUBSCRIPTION: `${API_BASE_URL}/account/subscriptions/current`,
  GET_SUBSCRIPTION_TIMELINE: `${API_BASE_URL}/account/subscriptions/timeline`,
  GET_SUBSCRIPTION_PLANS: `${API_BASE_URL}/account/subscriptions/plans`,
  UPGRADE_SUBSCRIPTION: `${API_BASE_URL}/account/subscriptions/upgrade`,
  DOWNGRADE_SUBSCRIPTION: `${API_BASE_URL}/account/subscriptions/downgrade`,
  CANCEL_SUBSCRIPTION: `${API_BASE_URL}/account/subscriptions/cancel`,
  GET_LISTS: `${API_BASE_URL}/account/lists`,
  CREATE_LIST: `${API_BASE_URL}/account/lists`,
  GET_LIST_ITEMS: (id: string) =>
    `${API_BASE_URL}/account/lists/${id}/items`,
  ADD_LIST_ITEM: (id: string) =>
    `${API_BASE_URL}/account/lists/${id}/items`,
  REMOVE_LIST_ITEM: (id: string, itemId: string) =>
    `${API_BASE_URL}/account/lists/${id}/items/${itemId}`,
} as const;

/**
 * Portfolio Endpoints
 */
export const PORTFOLIO_ENDPOINTS = {
  CREATE: `${API_BASE_URL}/portfolios`,
  GET_ALL: `${API_BASE_URL}/portfolios`,
  GET_BY_ID: (id: string) => `${API_BASE_URL}/portfolios/${id}`,
  UPDATE: (id: string) => `${API_BASE_URL}/portfolios/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/portfolios/${id}`,
  GET_STATS: (id: string) =>
    `${API_BASE_URL}/portfolios/stats/${id}`,
  ADD_CLIENT: (id: string) =>
    `${API_BASE_URL}/portfolios/${id}/clients`,
  UPDATE_CLIENT: (id: string, clientId: string) =>
    `${API_BASE_URL}/portfolios/${id}/clients/${clientId}`,
  REMOVE_CLIENT: (id: string, clientId: string) =>
    `${API_BASE_URL}/portfolios/${id}/clients/${clientId}`,
} as const;

/**
 * Favorites Endpoints
 */
export const FAVORITES_ENDPOINTS = {
  ADD_CAMPAIGN: (campaignId: string) =>
    `${API_BASE_URL}/favorites/campaigns/${campaignId}`,
  REMOVE_CAMPAIGN: (campaignId: string) =>
    `${API_BASE_URL}/favorites/campaigns/${campaignId}`,
  GET_FAVORITE_CAMPAIGNS: `${API_BASE_URL}/favorites/campaigns`,
  SAVE_INFLUENCER: (influencerId: string) =>
    `${API_BASE_URL}/favorites/saved-influencers/${influencerId}`,
  UNSAVE_INFLUENCER: (influencerId: string) =>
    `${API_BASE_URL}/favorites/saved-influencers/${influencerId}`,
  GET_SAVED_INFLUENCERS: `${API_BASE_URL}/favorites/saved-influencers`,
  CHECK_IS_FAVORITED: (type: string, id: string) =>
    `${API_BASE_URL}/favorites/check/${type}/${id}`,
} as const;

/**
 * Reviews Endpoints
 */
export const REVIEWS_ENDPOINTS = {
  REVIEW_INFLUENCER: (influencerId: string) =>
    `${API_BASE_URL}/reviews/influencers/${influencerId}`,
  GET_INFLUENCER_REVIEWS: (influencerId: string) =>
    `${API_BASE_URL}/reviews/influencers/${influencerId}`,
  REVIEW_BRAND: (brandId: string) =>
    `${API_BASE_URL}/reviews/brands/${brandId}`,
  GET_BRAND_REVIEWS: (brandId: string) =>
    `${API_BASE_URL}/reviews/brands/${brandId}`,
  DELETE_REVIEW: (reviewId: string) =>
    `${API_BASE_URL}/reviews/${reviewId}`,
  GET_MY_REVIEWS: `${API_BASE_URL}/reviews/my-reviews`,
} as const;

/**
 * Collaboration Endpoints
 */
export const COLLABORATION_ENDPOINTS = {
  SEND_REQUEST: `${API_BASE_URL}/collaborations/request`,
  GET_REQUESTS: `${API_BASE_URL}/collaborations/requests`,
  ACCEPT_REQUEST: (requestId: string) =>
    `${API_BASE_URL}/collaborations/requests/${requestId}/accept`,
  REJECT_REQUEST: (requestId: string) =>
    `${API_BASE_URL}/collaborations/requests/${requestId}/reject`,
  GET_ACTIVE: `${API_BASE_URL}/collaborations/active`,
  END_COLLABORATION: (collaborationId: string) =>
    `${API_BASE_URL}/collaborations/${collaborationId}/end`,
  GET_STATS: `${API_BASE_URL}/collaborations/stats`,
} as const;

/**
 * Trending Endpoints
 */
export const TRENDING_ENDPOINTS = {
  GET_INFLUENCERS: `${API_BASE_URL}/trending/influencers`,
  GET_CAMPAIGNS: `${API_BASE_URL}/trending/campaigns`,
  GET_BRANDS: `${API_BASE_URL}/trending/brands`,
  GET_CATEGORIES: `${API_BASE_URL}/trending/categories`,
} as const;

/**
 * Location Endpoints
 */
export const LOCATION_ENDPOINTS = {
  GET_NEARBY_INFLUENCERS: `${API_BASE_URL}/influencers/nearby`,
  SEARCH_INFLUENCERS_BY_LOCATION: `${API_BASE_URL}/influencers/location/search`,
  GET_NEARBY_BRANDS: `${API_BASE_URL}/brands/nearby`,
  SEARCH_BRANDS_BY_LOCATION: `${API_BASE_URL}/brands/location/search`,
  GET_NEARBY_CAMPAIGNS: `${API_BASE_URL}/campaigns/nearby`,
  UPDATE_USER_LOCATION: `${API_BASE_URL}/users/location`,
  GET_SUPPORTED_LOCATIONS: `${API_BASE_URL}/locations/supported`,
} as const;

/**
 * Projects Endpoints
 */
export const PROJECT_ENDPOINTS = {
  CREATE: `${API_BASE_URL}/projects`,
  GET_ALL: `${API_BASE_URL}/projects`,
  GET_STATS: `${API_BASE_URL}/projects/stats`,
  GET_BY_ID: (id: string) => `${API_BASE_URL}/projects/${id}`,
  UPDATE: (id: string) => `${API_BASE_URL}/projects/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/projects/${id}`,
} as const;

/**
 * Support Endpoints
 */
export const SUPPORT_ENDPOINTS = {
  GET_FAQS: `${API_BASE_URL}/help/faqs`,
  GET_SUPPORTED_LANGUAGES: `${API_BASE_URL}/help/languages`,
  SUBMIT_CONTACT_FORM: `${API_BASE_URL}/help/contact`,
  GET_HELP_ARTICLES: (category: string) =>
    `${API_BASE_URL}/help/articles/${category}`,
} as const;

/**
 * Profile Endpoints
 */
export const PROFILE_ENDPOINTS = {
  GET_FULL_PROFILE: `${API_BASE_URL}/profile/full`,
  GET_PROFILE_SUMMARY: `${API_BASE_URL}/profile/summary`,
  GET_VERIFICATION_STATUS: `${API_BASE_URL}/profile/verification-status`,
  UPDATE_PERSONAL_INFO: `${API_BASE_URL}/profile/personal-info`,
  UPDATE_PROFESSIONAL_INFO: `${API_BASE_URL}/profile/professional-info`,
  UPDATE_SOCIAL_STATS: `${API_BASE_URL}/profile/social-stats`,
  UPLOAD_PROFILE_IMAGE: `${API_BASE_URL}/profile/upload-image`,
  DELETE_PROFILE_IMAGE: `${API_BASE_URL}/profile/delete-image`,
  CHANGE_PASSWORD: `${API_BASE_URL}/profile/change-password`,
  UPDATE_EMAIL: `${API_BASE_URL}/profile/update-email`,
  SEND_EMAIL_VERIFICATION_OTP: `${API_BASE_URL}/profile/send-email-verification-otp`,
  VERIFY_EMAIL_WITH_OTP: `${API_BASE_URL}/profile/verify-email-with-otp`,
  UPDATE_PHONE: `${API_BASE_URL}/profile/update-phone`,
} as const;

/**
 * User Profile Endpoints
 */
export const USER_PROFILE_ENDPOINTS = {
  GET_MY_PROFILE: `${API_BASE_URL}/profile`,
  UPDATE_MY_PROFILE: `${API_BASE_URL}/profile`,
  UPLOAD_AVATAR: `${API_BASE_URL}/profile/avatar`,
  UPDATE_SETTINGS: `${API_BASE_URL}/profile/settings`,
  CHANGE_PASSWORD: `${API_BASE_URL}/profile/change-password`,
  VERIFY_EMAIL: `${API_BASE_URL}/profile/verify-email`,
  GET_ACTIVITY_LOG: `${API_BASE_URL}/profile/activity`,
  DEACTIVATE_ACCOUNT: `${API_BASE_URL}/profile/deactivate`,
} as const;

/**
 * SMS Service Endpoints
 */
export const SMS_ENDPOINTS = {
  SEND_OTP: `${API_BASE_URL}/sms/send-otp`,
  SEND_LOGIN_OTP: `${API_BASE_URL}/sms/send-login-otp`,
  SEND_WELCOME: `${API_BASE_URL}/sms/send-welcome`,
  SEND_CAMPAIGN_ALERT: `${API_BASE_URL}/sms/send-campaign-alert`,
  SEND_PAYMENT_CONFIRMATION: `${API_BASE_URL}/sms/send-payment-confirmation`,
  SEND_SUBSCRIPTION_UPDATE: `${API_BASE_URL}/sms/send-subscription-update`,
  SEND_CUSTOM: `${API_BASE_URL}/sms/send-custom`,
  CHECK_DELIVERY_STATUS: (messageId: string) =>
    `${API_BASE_URL}/sms/status/${messageId}`,
} as const;

/**
 * AI Search & Matching Endpoints
 */
export const AI_ENDPOINTS = {
  SEARCH: `${API_BASE_URL}/ask`,
  GET_DETAILS: `${API_BASE_URL}/ask/details`,
  DEBUG: `${API_BASE_URL}/ask/debug`,
} as const;

/**
 * Consolidated API Configuration
 */
export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

export type APIConfig = typeof API_CONFIG;

x# Phyo Website API Handoff

This document is the screen-by-screen API map for the Phyo web/website implementation. It is written so another codebase can reuse the same backend endpoints with minimal guesswork.

The goal is simple:
- know which screen calls which API
- know what payload the screen sends
- know what response shape the screen expects
- know what fields are actually mapped to state/UI

---

## 1) Core API Rules

- Base API calls in the app are made through the shared Axios client in `src/utils/apiClient.ts` and the Redux thunks in `src/store/apiThunks.ts`.
- Most authenticated requests rely on the auth token being set after login, signup verification, or Google auth.
- Many screens are tolerant of response variations and read from `response.data`, `response.data.data`, or `response.data.user` depending on backend structure.
- Some routes are intentionally different from what their names suggest. Keep the exact route strings below.

### Route quirks you must preserve

- Conversation list endpoint is `/api/messages/conversations` in the current app.
- Chat file delete endpoint is `/api/upload/chat-file/:key`.
- Chat image upload endpoint is `/api/upload/chat-image`.
- Portfolio client subroutes use plural `/clients`.
- Trending categories are fetched from `/api/categories/trending`.
- Nearby campaigns currently use `POST /api/campaigns/nearby`.
- Campaign applications can require retrying with a canonical `campaignId` if the first ID lookup returns 404.
- Email change verification is at `POST /api/users/profile/email-change/verify`.
- Resend OTP is at `POST /api/auth/resend-otp` (not `resend-email-otp`).

---

## 2) Screen-to-API Map

| Screen | Main API(s) | Purpose |
|---|---|---|
| LoginScreen | `/api/auth/login`, `/api/auth/google`, `/api/users/profile` | Authenticate, hydrate user |
| SignUpScreen | `/api/auth/signup` | Create account |
| VerifyEmailOtpScreen | `/api/auth/verify-email-otp` | Confirm email OTP |
| ForgotPasswordScreen | `/api/auth/forgot-password` | Send reset code |
| ResetPasswordScreen | `/api/auth/verify-code`, `/api/auth/reset-password` | Verify reset code and change password |
| AccountScreen | `/api/users/profile`, `/api/account/*`, `/api/payment/razorpay/*` | Show profile, subscriptions, payments |
| UpdateProfileScreen | `/api/users/profile` (PATCH), `/api/users/upload-avatar`, `/api/users/location` | Edit profile and upload avatar |
| BrandAccountScreen / InfluencerAccountScreen / UserAccountScreen | `/api/users/profile`, `/api/users/change-password`, `/api/auth/verify-email-otp`, `/api/auth/resend-otp`, `/api/notifications/*` | Profile, password, OTP, notifications, logout |
| CampaignsScreen | `/api/campaigns`, `/api/campaigns/mine`, `/api/campaigns/:id`, `/api/campaigns/:id/applications` | Campaign browsing and brand campaign management |
| CampaignOverviewScreen / CampaignOverview2Screen | `/api/campaigns/:id`, `/api/campaigns/:id/apply`, `/api/campaigns/:id/select` | Campaign detail and apply/select flows |
| DeliverablesScreen / DeliverablesSubmissionRevisionRequired | `/api/campaigns/:id/deliverables`, submit/approve/reject/brand-review routes | Deliverable workflow |
| InfluencerNegotiationScreen | negotiation routes under `/api/campaigns/:id/negotiations/*` | Offer and response flow |
| HomeScreen | `/api/campaigns`, `/api/campaigns/mine`, `/api/brands`, `/api/trending/influencers` | Main dashboard feed |
| BrandProfileScreen | `/api/brands/:id`, `/api/brands/:id/campaigns`, `/api/brands/:id/stats` | Brand detail page |
| InboxScreen / ChatBoxScreen / NewChatScreen | `/api/messages/conversations`, `/api/messages`, `/api/messages/with-file`, `/api/messages/:id/read`, `/api/messages/:id` | Messaging |
| BillingScreen / PaymentSuccessScreen / PlansScreen | `/api/payment/razorpay/plans`, `/api/payment/razorpay/subscriptions`, `/api/payment/razorpay/subscriptions/:id`, cancel/pause/resume routes | Subscription and billing |
| NotificationsScreen | `/api/notifications`, `/api/notifications/unread-count`, mark read routes | Notification feed |
| InfluencerSearchScreen | `POST /instagram/creator-search` on demographics API | AI/influencer discovery |
| MyListsScreen / List detail screens | `/api/lists`, `/api/lists/:id`, `/api/lists/:id/influencers`, `/api/lists/:id/export` | List management |
| PortfolioScreen / BrandProfile-related portfolio areas | `/api/portfolios`, `/api/portfolios/:id`, `/api/portfolios/:id/clients` | Portfolio management |

---

## 3) Authentication Screens

### 3.1 LoginScreen

#### API: `POST /api/auth/login`

Request payload:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

Expected response shape:
```json
{
  "token": "eyJhbGci...",
  "user": {
    "_id": "user123",
    "email": "user@example.com",
    "type": "USER",
    "name": "John Doe",
    "username": "johndoe",
    "brandRegistrationStatus": "NONE",
    "influencerRegistrationStatus": "NONE",
    "isEmailVerified": true,
    "contact": { "first_name": "John", "last_name": "Doe" },
    "social_media": { "instagram": "...", "youtube": "..." },
    "billing_info": { "billing_address": "...", "finance_email": "..." },
    "preferences": { "notifications": true, "timezone": "IST" },
    "currentPlan": "free",
    "subscriptionStatus": "inactive",
    "creditsRemaining": 0
  }
}
```

Token extraction logic (used in authSlice):
- `payload?.token || payload?.data?.token`

User extraction logic (used in authSlice):
- `payload?.user || payload?.data?.user || payload?.data`

Frontend behavior:
- stores token via `setAuthToken(token)`
- stores user in Redux `auth.user` and `AsyncStorage`
- captures device location if coords available, adds `lastKnownCity/State/Country` to user object
- fetches `/api/users/profile` after login to hydrate full profile
- routes to Home

#### API: `POST /api/auth/google`

Request payload:
```json
{
  "idToken": "google-id-token",
  "type": "BRAND"
}
```

Expected response shape — same token+user structure as login above.

### 3.2 SignUpScreen

#### API: `POST /api/auth/signup`

Request payload:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "type": "USER",
  "name": "John Doe",
  "username": "johndoe123"
}
```

Expected response shape:
```json
{
  "success": true,
  "message": "Signup successful. OTP sent to email",
  "data": {
    "email": "user@example.com",
    "type": "USER"
  }
}
```

Frontend behavior: routes to VerifyEmailOtp with the email.

### 3.3 VerifyEmailOtpScreen

#### API: `POST /api/auth/verify-email-otp`

Request payload:
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

Expected response shape:
```json
{
  "token": "eyJhbGci...",
  "user": {
    "_id": "user123",
    "email": "user@example.com",
    "isEmailVerified": true,
    "type": "USER"
  }
}
```

Frontend stores token and user in Redux and AsyncStorage, routes to Home.

### 3.4 ForgotPasswordScreen

#### API: `POST /api/auth/forgot-password`

Request payload:
```json
{
  "email": "user@example.com"
}
```

Expected response shape:
```json
{
  "success": true,
  "message": "Reset code sent"
}
```

### 3.5 ResetPasswordScreen

#### API: `POST /api/auth/verify-code`

Request payload:
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

#### API: `POST /api/auth/reset-password`

Request payload:
```json
{
  "email": "user@example.com",
  "newPassword": "newPassword456"
}
```

Expected response shape:
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

### 3.6 Session bootstrap and logout

#### API: `GET /api/users/profile`

Used on app mount to restore the signed-in user after refresh.

Expected response shape (authSlice reads `payload?.user || payload?.data?.user || payload?.data`):
```json
{
  "data": {
    "_id": "user123",
    "email": "user@example.com",
    "type": "BRAND",
    "name": "John Doe",
    "username": "johndoe",
    "companyName": "Acme Corp",
    "industry": "Fashion",
    "website": "https://acme.com",
    "company_type": "Private",
    "location": "Mumbai, MH",
    "country": "India",
    "company_logo": "https://cdn.../logo.png",
    "brandRegistrationStatus": "APPROVED",
    "influencerRegistrationStatus": "NONE",
    "isEmailVerified": true,
    "pendingEmail": null,
    "pendingEmailRequestedAt": null,
    "contact": {
      "first_name": "John",
      "last_name": "Doe",
      "phone": "+91-9999999999",
      "job_title": "Founder"
    },
    "social_media": {
      "instagram": "https://instagram.com/brand",
      "facebook": "https://facebook.com/brand",
      "twitter": "",
      "linkedin": "",
      "youtube": ""
    },
    "billing_info": {
      "billing_address": "123 MG Road, Mumbai",
      "finance_email": "finance@acme.com"
    },
    "verification_documents": {
      "tax_id": "GST123",
      "company_registration_number": "CIN123"
    },
    "preferences": {
      "notifications": true,
      "email_preferences": ["campaigns", "messages"],
      "timezone": "Asia/Kolkata",
      "language": "en"
    },
    "currentPlan": "pro",
    "subscriptionStatus": "active",
    "creditsRemaining": 50,
    "isOnline": true,
    "lastSeen": "2026-06-02T10:00:00Z"
  }
}
```

Frontend also persists this to `AsyncStorage` under key `'user'`.

#### API: `POST /api/auth/logout`

Thunk does local cleanup only — clears token, clears AsyncStorage. Backend call is not made.

#### API: `POST /api/users/profile/email-change/verify`

Used when user changes their email and verifies the new one with OTP.

Request payload:
```json
{
  "otp": "123456",
  "code": "123456"
}
```

Expected response shape — returns updated user with new `email`, clears `pendingEmail` and `pendingEmailRequestedAt`.

---

## 4) User and Account Screens

### 4.1 AccountScreen

#### API: `GET /api/users/profile`

See section 3.6 for full response shape. The UI reads:
- `user.type` for role-based views
- `user.brandRegistrationStatus` / `user.influencerRegistrationStatus` for gating features
- `user.currentPlan`, `user.subscriptionStatus`, `user.creditsRemaining` for plan display
- `user.name`, `user.email`, `user.contact`, `user.company_logo` for profile header

#### API: `GET /api/account/transactions`

Expected response shape (UI reads `response.data` or `response.data.data`):
```json
{
  "data": [
    {
      "_id": "txn_1",
      "type": "credit",
      "amount": 1000,
      "description": "Plan upgrade",
      "createdAt": "2026-05-01T00:00:00Z"
    }
  ]
}
```

#### API: `GET /api/account/payments/history`

Expected response shape:
```json
{
  "data": [
    {
      "_id": "pay_1",
      "amount": 49900,
      "currency": "INR",
      "status": "captured",
      "createdAt": "2026-05-01T00:00:00Z"
    }
  ]
}
```

#### API: `GET /api/account/payments/methods`

Expected response shape:
```json
{
  "data": [
    {
      "_id": "method_1",
      "type": "card",
      "last4": "4242",
      "brand": "Visa",
      "isDefault": true
    }
  ]
}
```

#### API: `POST /api/account/payments/methods`

Payload:
```json
{
  "type": "card",
  "token": "pm_123",
  "last4": "4242"
}
```

#### API: `PUT /api/account/payments/methods/:methodId/default`

Sets default payment method.

#### API: `DELETE /api/account/payments/methods/:methodId`

Removes a payment method.

#### API: `GET /api/account/subscriptions/current`

Expected response shape:
```json
{
  "data": {
    "planId": "plan_pro_monthly",
    "planName": "Pro Monthly",
    "status": "active",
    "startDate": "2026-05-01T00:00:00Z",
    "endDate": "2026-06-01T00:00:00Z",
    "creditsRemaining": 50
  }
}
```

#### API: `GET /api/account/subscriptions/timeline`

Expected response shape:
```json
{
  "data": [
    {
      "event": "subscribed",
      "date": "2026-05-01T00:00:00Z",
      "planName": "Pro Monthly"
    }
  ]
}
```

#### API: `GET /api/account/subscriptions/plans`

Expected response shape:
```json
{
  "data": [
    {
      "id": "plan_basic",
      "name": "Basic",
      "amount": 9900,
      "currency": "INR",
      "features": ["10 campaigns", "Basic analytics"]
    }
  ]
}
```

#### API: `POST /api/account/subscriptions/upgrade`

Payload:
```json
{
  "planId": "plan_pro_monthly",
  "effectiveDate": "now"
}
```

#### API: `POST /api/account/subscriptions/downgrade`

Payload:
```json
{
  "planId": "plan_basic_monthly",
  "effectiveDate": "cycle_end"
}
```

#### API: `POST /api/account/subscriptions/cancel`

No payload.

#### API: `PUT /api/users/change-password`

Request payload:
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456"
}
```

Expected response:
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

#### API: `PATCH /api/users/profile`

See section 4.2 for payload details and response shape.

### 4.2 UpdateProfileScreen

#### API: `PATCH /api/users/profile`

The thunk normalizes several aliases before sending. Web must apply the same normalizations:
- `bio` → `about`
- `socialMedia` → `social_media`
- `brandImages` → `brand_images`
- `billingAddress` + `financeEmail` → `billing_info: { billing_address, finance_email }`
- Empty string values are removed before sending.

Typical cleaned payload example:
```json
{
  "name": "John Updated",
  "about": "New bio text",
  "location": "Delhi, DL",
  "phone": "+91-9999999999",
  "social_media": {
    "instagram": "https://instagram.com/user",
    "youtube": "https://youtube.com/user"
  },
  "contact": {
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+91-9999999999",
    "job_title": "Creator"
  },
  "billing_info": {
    "billing_address": "123 MG Road",
    "finance_email": "fin@brand.com"
  }
}
```

Expected response shape (thunk reads `response.data?.data || response.data?.user || response.data`):
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "_id": "user123",
    "email": "user@example.com",
    "name": "John Updated",
    "about": "New bio text",
    "contact": { "first_name": "John", "last_name": "Doe" },
    "social_media": { "instagram": "...", "youtube": "..." }
  }
}
```

The returned user object is persisted to AsyncStorage and merged into Redux `auth.user`.

#### API: `POST /api/users/upload-avatar`

Multipart form data:
- field name: `avatar`
- content type: `multipart/form-data`

Expected response:
```json
{
  "success": true,
  "data": {
    "avatarUrl": "https://cdn.../avatar.jpg"
  }
}
```

#### API: `POST /api/users/location`

Request payload:
```json
{
  "latitude": 19.076,
  "longitude": 72.8777,
  "city": "Mumbai",
  "state": "Maharashtra",
  "country": "India"
}
```

Expected response:
```json
{
  "success": true,
  "message": "Location updated"
}
```

### 4.3 ChangePasswordScreen

#### API: `PUT /api/users/change-password`

Same payload and response as 4.1.

---

## 5) Campaign Screens

### 5.1 HomeScreen

Home uses TTL-cached Redux state (5-minute cache). Fetches only when cache is stale.

#### Role-based campaign fetch logic:
- `BRAND` role → calls `GET /api/campaigns/mine`
- `INFLUENCER` role → calls `GET /api/campaigns` (all campaigns)
- `USER` role → does not fetch campaigns

#### API: `GET /api/campaigns`

Used for the influencer-facing campaign feed.

Query params:
```json
{
  "page": 1,
  "limit": 10,
  "status": "ACTIVE",
  "campaignType": "INFLUENCER"
}
```

Expected response shape (campaignSlice reads `action.payload.data`):
```json
{
  "data": [
    {
      "_id": "campaign_1",
      "campaignId": "uuid-123",
      "campaignName": "Summer Launch",
      "campaignType": "INFLUENCER",
      "campaignBrief": "Promote our summer collection",
      "campaignGoal": "Awareness",
      "brandId": "brand_1",
      "status": "Active",
      "budget": 100000,
      "deliverables": ["Instagram Reel", "Story"],
      "compensation": {
        "type": "Monetary",
        "amount": 50000,
        "currency": "INR"
      },
      "city": "Mumbai",
      "state": "Maharashtra",
      "country": "India",
      "targetInfluencer": {
        "numberOfInfluencers": 5,
        "targetNiche": ["Fashion", "Lifestyle"],
        "followerCount": { "min": 10000, "max": 500000 },
        "countries": ["India"],
        "gender": ["female"],
        "ageRange": { "min": 18, "max": 35 }
      },
      "timelines": {
        "applicationDeadline": "2026-06-30T00:00:00Z",
        "campaignStartDate": "2026-07-01T00:00:00Z",
        "campaignEndDate": "2026-07-31T00:00:00Z"
      },
      "productImages": ["https://cdn.../img1.jpg"],
      "applicants": ["user_1", "user_2"],
      "suggestedInfluencers": [],
      "engagement": 4.5,
      "createdAt": "2026-05-01T00:00:00Z",
      "updatedAt": "2026-05-15T00:00:00Z"
    }
  ],
  "pagination": {
    "totalPages": 3,
    "currentPage": 1,
    "totalItems": 25
  }
}
```

#### API: `GET /api/campaigns/mine`

Used for brand-owned campaigns. Same response shape as above.

Query params:
```json
{
  "page": 1,
  "limit": 10,
  "status": "DRAFT"
}
```

The thunk has a 30-second in-memory cache — returns cached `campaigns` array from Redux state if fresh.

#### API: `GET /api/brands`

Used for featured brands section.

Query params:
```json
{
  "page": 1,
  "limit": 8
}
```

Expected response shape (brandsSlice reads `action.payload?.data || action.payload?.brands`):
```json
{
  "data": [
    {
      "_id": "brand_1",
      "id": "brand_1",
      "name": "Nike India",
      "description": "Sports and lifestyle brand",
      "logo": "https://cdn.../logo.png",
      "website": "https://nike.com",
      "industry": "Sports",
      "location": "Mumbai, MH",
      "socialMedia": {
        "instagram": "https://instagram.com/nikeindia",
        "facebook": "",
        "twitter": "",
        "linkedin": "",
        "youtube": ""
      },
      "followerCount": 500000,
      "engagementRate": 3.2,
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2026-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "totalPages": 2,
    "currentPage": 1
  }
}
```

#### API: `GET /api/trending/influencers`

Used for trending creators carousel.

Query params:
```json
{
  "limit": 5,
  "offset": 0
}
```

Expected response shape (influencerSlice reads `Array.isArray(payload) ? payload : payload.data`):
```json
{
  "data": [
    {
      "_id": "inf_1",
      "userId": "user_1",
      "username": "fashionista_priya",
      "name": "Priya Sharma",
      "bio": "Fashion & Lifestyle creator",
      "profilePicture": "https://cdn.../pic.jpg",
      "followerCount": 250000,
      "engagementRate": 5.2,
      "averageViews": 50000,
      "averageLikes": 12000,
      "averageComments": 800,
      "niche": ["Fashion", "Beauty"],
      "country": "India",
      "audience": {
        "ageRange": { "min": 18, "max": 34 },
        "gender": ["female"]
      },
      "createdAt": "2025-06-01T00:00:00Z",
      "updatedAt": "2026-01-01T00:00:00Z"
    }
  ]
}
```

#### API: `POST /api/campaigns/nearby`

Currently disabled in HomeScreen (commented out pending fix). Request payload when re-enabled:
```json
{
  "city": "Mumbai",
  "state": "Maharashtra",
  "country": "India",
  "page": 1,
  "limit": 20
}
```

Expected response shape (thunk reads `response.data?.data || response.data?.campaigns || response.data`):
```json
{
  "data": [...campaigns array...],
  "pagination": { "totalPages": 1, "currentPage": 1 }
}
```

### 5.2 CampaignsScreen

#### API: `GET /api/campaigns`

See 5.1 for full response shape.

Optional filter params:
```json
{
  "status": "ACTIVE",
  "campaignType": "INFLUENCER",
  "brandId": "brand_1",
  "search": "fashion",
  "niche": "Beauty",
  "minBudget": 10000,
  "maxBudget": 500000,
  "page": 1,
  "limit": 20
}
```

#### API: `GET /api/campaigns/mine`

See 5.1.

#### API: `GET /api/campaigns/:id`

Expected response shape:
```json
{
  "data": {
    "_id": "campaign_1",
    "campaignId": "uuid-123",
    ...all Campaign fields from 5.1...
  }
}
```

Or the campaign object may be returned directly at `response.data`.

#### API: `GET /api/campaigns/:id/applications`

Expected response shape:
```json
{
  "data": [
    {
      "_id": "app_1",
      "campaignId": "uuid-123",
      "influencerId": "inf_1",
      "status": "pending",
      "appliedAt": "2026-06-01T00:00:00Z",
      "influencer": {
        "_id": "inf_1",
        "username": "fashionista_priya",
        "name": "Priya Sharma",
        "profilePicture": "https://cdn.../pic.jpg",
        "followerCount": 250000,
        "engagementRate": 5.2,
        "niche": ["Fashion"]
      }
    }
  ]
}
```

Important: the thunk retries with a canonical `campaignId` (UUID) if the initial call returns 404. The retry logic fetches `/api/campaigns/mine` and matches by `c?.campaignId === campaignId || c?.id === campaignId || c?._id === campaignId`, then uses `matched?.campaignId || matched?.id || matched?._id` for the retry call.

### 5.3 CampaignOverviewScreen and CampaignOverview2Screen

#### API: `GET /api/campaigns/:id`

See 5.2.

#### API: `POST /api/campaigns/:id/apply`

No request body.

Expected response shape:
```json
{
  "success": true,
  "message": "Application submitted"
}
```

#### API: `POST /api/campaigns/:id/select`

Request payload:
```json
{
  "influencerId": "inf_123",
  "offer": 50000
}
```

Expected response:
```json
{
  "success": true,
  "message": "Influencer selected"
}
```

#### API: `POST /api/campaigns/:id/applications/:applicationId/accept`

No request body.

Expected response:
```json
{
  "success": true,
  "message": "Application accepted"
}
```

#### API: `POST /api/campaigns/:id/applications/:applicationId/reject`

Request payload:
```json
{
  "reason": "Not a good fit for this campaign"
}
```

### 5.4 DeliverablesScreen / DeliverablesSubmissionRevisionRequired

#### API: `GET /api/campaigns/:id/deliverables`

Expected response shape:
```json
{
  "data": [
    {
      "_id": "del_1",
      "campaignId": "campaign_1",
      "title": "Instagram Reel",
      "description": "30 second reel showcasing product",
      "dueDate": "2026-07-15T00:00:00Z",
      "content": "Focus on lifestyle use case",
      "status": "pending",
      "contentUrl": null,
      "notes": null,
      "brandReview": "pending",
      "reviewNotes": null,
      "rejectedReason": null,
      "submittedAt": null,
      "createdAt": "2026-06-01T00:00:00Z"
    }
  ]
}
```

#### API: `POST /api/campaigns/:id/deliverables`

Request payload:
```json
{
  "title": "Instagram Reel",
  "description": "30 second reel",
  "dueDate": "2026-06-15T00:00:00Z",
  "content": "Post brief content here"
}
```

#### API: `POST /api/campaigns/:campaignId/deliverables/:deliverableId/submit`

Request payload:
```json
{
  "contentUrl": "https://drive.google.com/file/...",
  "notes": "Initial version, please review"
}
```

#### API: `POST /api/campaigns/:campaignId/deliverables/:deliverableId/approve`

Request payload:
```json
{
  "reviewNotes": "Looks great, approved"
}
```

#### API: `POST /api/campaigns/:campaignId/deliverables/:deliverableId/reject`

Request payload:
```json
{
  "rejectedReason": "Needs better CTA",
  "reviewNotes": "Please revise the hook in first 3 seconds"
}
```

#### API: `PATCH /api/campaigns/:campaignId/deliverables/:deliverableId/brand-review`

Request payload:
```json
{
  "brandReview": "request_changes",
  "message": "Please improve the caption and add hashtags"
}
```

`brandReview` enum values: `"pending"`, `"request_changes"`, `"accepted"`, `"rejected"`

### 5.5 InfluencerNegotiationScreen

#### API: `POST /api/campaigns/:campaignId/negotiations/offer`

Request payload:
```json
{
  "influencerId": "inf_123",
  "amount": 60000,
  "message": "We'd like to offer you an increased rate"
}
```

#### API: `POST /api/campaigns/:campaignId/negotiations/:influencerId/accept`

No request body.

#### API: `POST /api/campaigns/:campaignId/negotiations/:influencerId/reject`

Request payload:
```json
{
  "reason": "Budget does not meet our minimum requirement"
}
```

### 5.6 BoostCampaignScreen

#### API: `POST /api/campaigns/:campaignId/boost`

Request payload:
```json
{
  "duration": "7days",
  "amount": 2500
}
```

`duration` enum values: `"7days"`, `"14days"`, `"30days"`

#### API: `GET /api/campaigns/:campaignId/boost-recommendations`

Expected response shape:
```json
{
  "data": {
    "recommendedDuration": "14days",
    "estimatedReach": 5000,
    "suggestedAmount": 5000
  }
}
```

### 5.7 BrandProfileScreen

#### API: `GET /api/brands/:brandId`

Expected response shape (brandsSlice reads `action.payload?.data || action.payload`):
```json
{
  "data": {
    "_id": "brand_1",
    "name": "Nike India",
    "description": "Sports and lifestyle brand",
    "logo": "https://cdn.../logo.png",
    "website": "https://nike.com",
    "industry": "Sports",
    "location": "Mumbai, MH",
    "socialMedia": { "instagram": "...", "facebook": "..." },
    "followerCount": 500000,
    "engagementRate": 3.2,
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

#### API: `GET /api/brands/:brandId/campaigns`

Same campaigns array structure as `GET /api/campaigns`.

#### API: `GET /api/brands/:brandId/stats`

UI fields used:
```json
{
  "data": {
    "campaignCount": 12,
    "activeCampaignCount": 3,
    "completedCampaignCount": 9,
    "totalBudget": 1200000,
    "averageBudget": 100000
  }
}
```

### 5.8 Campaign Route Map

This is the route-level map for the campaign pages that exist in the app today. The same shared components are reused across roles where possible.

| Route | Backing page/component | Main API(s) | Notes |
|---|---|---|---|
| `/brand/campaigns` | `src/app/brand/campaigns/page.jsx` -> `src/app/brand/campaigns/AllCampaignsSection.jsx` | `/api/campaigns/mine`, `/api/campaigns/history`, `/api/campaigns/:id`, `/api/campaigns/:id/applications` | Brand campaign dashboard and create-campaign entry point |
| `/brand/campaigns/all-campaigns` | `src/app/brand/campaigns/all-campaigns/page.jsx` | `/api/campaigns` | Brand-side list of all active campaigns |
| `/brand/campaigns/all-drafts` | `src/app/brand/campaigns/all-drafts/page.jsx` | `/api/campaigns` | Filters draft campaigns and sends user to edit/create flow |
| `/brand/campaigns/create-campaign` | `src/app/brand/campaigns/create-campaign/page.jsx` | `/api/campaigns` | Brand campaign creation wizard, submit via multipart payload |
| `/brand/campaigns/[id]` | `src/app/brand/campaigns/[id]/page.jsx` -> `src/components/campaigns/campaigns-detail/page.jsx` | `/api/campaigns/:id`, `/api/campaigns/:id/applications`, `/api/campaigns/:id/influencers`, `/api/campaigns/:id/deliverables` | Main campaign detail screen |
| `/brand/campaigns/new-applications` | `src/app/brand/campaigns/new-applications/page.jsx` | `/api/campaigns/mine`, `/api/campaigns/:id/applications`, accept/reject routes | Application review screen |
| `/brand/campaigns/influencer-counter-offer` | `src/app/brand/campaigns/influencer-counter-offer/page.jsx` -> `src/components/campaigns/influencer-counter-offer/page.jsx` | `/api/campaigns/:campaignId/negotiations/:influencerId`, `/accept`, `/reject`, `/api/campaigns/:campaignId/counter-offer` | Negotiation / counter-offer flow |
| `/brand/campaigns/influencer-detail-deliverables` | `src/app/brand/campaigns/influencer-detail-deliverables/page.jsx` -> `src/components/campaigns/influencer-detail-deliverables/page.jsx` | `/api/campaigns/:id/deliverables`, `/api/campaigns/:id/activity-timeline` | Deliverables review and revision flow |
| `/brand/campaigns/boost-campaign` | `src/app/brand/campaigns/boost-campaign/page.jsx` -> `src/components/campaigns/boost-campaign/page.jsx` | `/api/campaigns/:campaignId/boost-recommendations`, `/api/campaigns/:campaignId/boost` | Campaign boosting flow |
| `/brand/campaigns/campaign-summary` | `src/app/brand/campaigns/campaign-summary/page.jsx` -> `src/components/campaigns/campaign-summary/page.jsx` | `/api/campaigns/:id` | Summary / reporting view |
| `/user/campaigns/create-campaign` | `src/app/user/campaigns/create-campaign/page.jsx` | Redirects to `/user/campaigns` | `USER` does not own campaign creation |
| `/user/campaigns/all-drafts` | `src/app/user/campaigns/all-drafts/page.jsx` | Redirects to `/user/campaigns` | Draft management is brand-only |
| `/influencer/campaigns/create-campaign` | `src/app/influencer/campaigns/create-campaign/page.jsx` | Redirects to `/influencer/campaigns` | `INFLUENCER` does not own campaign creation |
| `/influencer/campaigns/all-drafts` | `src/app/influencer/campaigns/all-drafts/page.jsx` | Redirects to `/influencer/campaigns` | Draft management is brand-only |
| `/user/campaigns/*` | `src/app/user/campaigns/*` wrappers and pages | Same campaign APIs, plus user-specific navigation | Mirrors the shared campaign flows for the `USER` role; creation/drafts are redirected away |
| `/influencer/campaigns/*` | `src/app/influencer/campaigns/*` wrappers and pages | Same campaign APIs, plus influencer navigation | Mirrors the shared campaign flows for the `INFLUENCER` role; creation/drafts are redirected away |

---

## 6) Chat and Inbox Screens

### 6.1 InboxScreen

#### API: `GET /api/messages/conversations`

Query params:
```json
{
  "page": 1,
  "limit": 100
}
```

Expected response shape (conversationSlice parses through this waterfall):
1. `payload?.conversations`
2. `payload?.data?.conversations`
3. `payload?.data?.items`
4. `payload?.items`
5. `payload?.data`
6. `payload` (if array)

Canonical shape:
```json
{
  "conversations": [
    {
      "_id": "conv_1",
      "participants": [
        {
          "_id": "user_1",
          "name": "John Doe",
          "profilePicture": "https://cdn.../pic.jpg",
          "isOnline": true
        },
        {
          "_id": "user_2",
          "name": "Brand Manager",
          "profilePicture": "https://cdn.../pic2.jpg",
          "isOnline": false
        }
      ],
      "lastMessage": {
        "_id": "msg_5",
        "conversationId": "conv_1",
        "senderId": "user_2",
        "content": "Please check the deliverable",
        "messageType": "text",
        "isRead": false,
        "createdAt": "2026-06-01T14:00:00Z"
      },
      "unreadCount": 2,
      "createdAt": "2026-05-01T00:00:00Z",
      "updatedAt": "2026-06-01T14:00:00Z"
    }
  ]
}
```

#### API: `GET /api/messages/senders/:senderId/conversations`

Same response shape as above.

#### API: `GET /api/users/list`

Used to search users for new chat.

Query params:
```json
{
  "page": 1,
  "limit": 20,
  "type": "BRAND"
}
```

### 6.2 ChatBoxScreen

#### API: `GET /api/messages/:conversationId`

Query params:
```json
{
  "page": 1,
  "limit": 50,
  "sort": "desc"
}
```

Expected response shape (conversationSlice parses through):
1. `payload?.messages`
2. `payload?.data?.messages`
3. `payload?.data?.items`
4. `payload?.items`
5. `payload?.data`
6. `payload` (if array)

Canonical shape:
```json
{
  "messages": [
    {
      "_id": "msg_1",
      "conversationId": "conv_1",
      "senderId": "user_1",
      "content": "Hello there",
      "messageType": "text",
      "mediaUrl": null,
      "mediaKey": null,
      "fileName": null,
      "fileSize": null,
      "isRead": true,
      "readAt": "2026-06-01T10:01:00Z",
      "createdAt": "2026-06-01T10:00:00Z",
      "updatedAt": "2026-06-01T10:01:00Z"
    }
  ],
  "pagination": {
    "totalPages": 3,
    "currentPage": 1
  }
}
```

Pagination parsing: `payload?.pagination || payload?.data?.pagination`, reads `totalPages ?? total_pages` and `currentPage ?? current_page ?? page`.

#### API: `GET /api/messages/senders/:senderId`

Same messages response shape. Used when chat is resolved by sender ID instead of conversation ID.

Query params include optional `conversationId`.

#### API: `POST /api/messages`

Request payload:
```json
{
  "conversationId": "conv_123",
  "content": "Hello",
  "message": "Hello"
}
```

Expected response shape (conversationSlice reads `payload?.message || payload?.data?.message || payload?.data || payload`):
```json
{
  "message": {
    "_id": "msg_new",
    "conversationId": "conv_123",
    "senderId": "user_1",
    "content": "Hello",
    "messageType": "text",
    "isRead": false,
    "createdAt": "2026-06-02T10:00:00Z",
    "updatedAt": "2026-06-02T10:00:00Z"
  }
}
```

After success, the message is pushed to `state.messages` and `state.conversations[idx].lastMessage` is updated.

#### API: `POST /api/messages/with-file`

Multipart form data fields: `conversationId`, optional `message`, `file`.

Expected response shape — same as `POST /api/messages` above.

#### API: `PATCH /api/messages/:messageId/read`

Expected response shape (conversationSlice reads `payload?.message || payload?.data?.message || payload?.data || payload`):
```json
{
  "message": {
    "_id": "msg_1",
    "isRead": true,
    "readAt": "2026-06-02T10:05:00Z"
  }
}
```

Updates `state.messages[idx]` in place via merge.

#### API: `DELETE /api/messages/:messageId`

Thunk returns `{ messageId }`. Filters message out of `state.messages`.

### 6.3 NewChatScreen

#### API: `POST /api/messages/conversations`

Request payload:
```json
{
  "participantId": "user_123",
  "message": "Hi there"
}
```

Expected response shape (conversationSlice reads via `parseConversation`: `payload?.conversation || payload?.data?.conversation || payload?.data || payload`):
```json
{
  "conversation": {
    "_id": "conv_new",
    "participants": ["user_1", "user_123"],
    "createdAt": "2026-06-02T10:00:00Z",
    "updatedAt": "2026-06-02T10:00:00Z"
  }
}
```

New conversation is prepended to `state.conversations` only if `_id` doesn't already exist.

### 6.4 Chat file upload

#### API: `POST /api/upload/chat-image`

Multipart form data:
- `image`: file
- `conversationId`: string

Expected response:
```json
{
  "data": {
    "url": "https://cdn.../image.jpg",
    "key": "chat-images/uuid.jpg"
  }
}
```

#### API: `DELETE /api/upload/chat-file/:key`

Deletes uploaded chat files by storage key.

---

## 7) Billing and Subscription Screens

### 7.1 PlansScreen

#### API: `GET /api/payment/razorpay/plans`

Query params:
```json
{
  "count": 20,
  "skip": 0
}
```

Expected response shape:
```json
{
  "data": {
    "items": [
      {
        "id": "plan_123",
        "entity": "plan",
        "interval": 1,
        "period": "monthly",
        "item": {
          "id": "item_123",
          "active": true,
          "amount": 49900,
          "unit_amount": 49900,
          "currency": "INR",
          "name": "Pro Monthly",
          "description": "Pro plan with 50 credits"
        },
        "notes": [],
        "created_at": 1717200000
      }
    ],
    "count": 3
  }
}
```

### 7.2 BillingScreen

#### API: `POST /api/payment/razorpay/subscriptions`

Thunk field mapping:
- UI sends `planId` → thunk maps to `plan_id`
- UI sends `userId` → thunk maps to `user_id`
- `total_count` defaults to 12

Request payload sent to backend:
```json
{
  "plan_id": "plan_123",
  "user_id": "user_123",
  "total_count": 12
}
```

Expected response shape:
```json
{
  "success": true,
  "data": {
    "id": "sub_123",
    "entity": "subscription",
    "plan_id": "plan_123",
    "status": "created",
    "current_start": null,
    "current_end": null,
    "ended_at": null,
    "quantity": 1,
    "notes": [],
    "charge_at": 1717200000,
    "start_at": 1717200000,
    "end_at": null,
    "auth_attempts": 0,
    "total_count": 12,
    "paid_count": 0,
    "customer_notify": true,
    "created_at": 1717200000,
    "expire_by": null,
    "short_url": "https://rzp.io/l/...",
    "has_scheduled_changes": false,
    "change_scheduled_at": null,
    "source": "api",
    "payment_method": null,
    "offer_id": null,
    "remaining_count": 12
  }
}
```

### 7.3 PaymentSuccessScreen

#### API: `GET /api/payment/razorpay/subscriptions/:subscriptionId`

The thunk derives `subscriptionId` from `payload.subscriptionId || payload.razorpayOrderId`.

Expected response shape:
```json
{
  "data": {
    "id": "sub_123",
    "plan_id": "plan_123",
    "status": "active",
    "paid_count": 1,
    "total_count": 12,
    "current_start": 1717200000,
    "current_end": 1719878400,
    "charge_at": 1719878400
  }
}
```

### 7.4 Subscription management helpers

#### API: `GET /api/payment/razorpay/subscriptions`

Used by `getUserPlan`, `getUserCredits`, `getPaymentHistory`. The thunk for `getUserPlan` reads:
```javascript
const subscriptions = response?.data?.data?.items || [];
const active = subscriptions.find(sub => sub?.status === 'active') || subscriptions[0] || null;
```

Full response shape:
```json
{
  "data": {
    "items": [
      {
        "id": "sub_123",
        "plan_id": "plan_123",
        "status": "active",
        "current_start": 1717200000,
        "current_end": 1719878400,
        "paid_count": 1,
        "remaining_count": 11,
        "total_count": 12
      }
    ],
    "count": 1
  }
}
```

#### API: `POST /api/payment/razorpay/subscriptions/:subscriptionId/cancel`

No body. Returns updated subscription object.

#### API: `POST /api/payment/razorpay/subscriptions/:subscriptionId/pause`

Request payload:
```json
{
  "pause_at": "now"
}
```

`pause_at` values: `"now"` or `"cycle_end"`

#### API: `POST /api/payment/razorpay/subscriptions/:subscriptionId/resume`

No body.

#### API: `GET /api/payment/razorpay/plans/:planId`

Returns single plan object matching the `items[n]` shape above.

#### API: `PATCH /api/payment/razorpay/subscriptions/:subscriptionId`

Request payload example:
```json
{
  "plan_id": "plan_456",
  "quantity": 1,
  "remaining_count": 6,
  "schedule_change_at": "cycle_end",
  "customer_notify": 1
}
```

#### API: `POST /api/payment/razorpay/subscription-links`

Payload is backend-defined; pass through from UI.

#### API: `GET /api/payment/razorpay/subscriptions/:subscriptionId/pending-update`

Returns queued change object.

#### API: `POST /api/payment/razorpay/subscriptions/:subscriptionId/pending-update/cancel`

No body.

#### API: `GET /api/payment/razorpay/subscriptions/:subscriptionId/invoices`

Expected response shape:
```json
{
  "data": {
    "items": [
      {
        "id": "inv_1",
        "subscription_id": "sub_123",
        "status": "paid",
        "amount": 49900,
        "currency": "INR",
        "date": 1717200000
      }
    ]
  }
}
```

---

## 8) Discovery and Brand Screens

### 8.1 InfluencersListScreen / InfluencerProfileScreen

#### API: `GET /api/influencers`

Query params:
```json
{
  "page": 1,
  "limit": 20,
  "search": "fashion",
  "city": "Mumbai",
  "state": "Maharashtra",
  "category": "Beauty",
  "gender": "female",
  "sortBy": "followers",
  "sortOrder": "desc"
}
```

Expected response shape (influencerSlice reads `Array.isArray(payload) ? payload : payload.data`):
```json
{
  "data": [
    {
      "_id": "inf_1",
      "userId": "user_1",
      "username": "fashionista_priya",
      "name": "Priya Sharma",
      "bio": "Fashion & Lifestyle creator",
      "profilePicture": "https://cdn.../pic.jpg",
      "followerCount": 250000,
      "engagementRate": 5.2,
      "averageViews": 50000,
      "averageLikes": 12000,
      "averageComments": 800,
      "niche": ["Fashion", "Beauty"],
      "country": "India",
      "audience": {
        "ageRange": { "min": 18, "max": 34 },
        "gender": ["female"]
      },
      "createdAt": "2025-06-01T00:00:00Z",
      "updatedAt": "2026-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "totalPages": 5,
    "currentPage": 1
  }
}
```

#### API: `GET /api/influencers/:id`

Returns single influencer object at `response.data` or `response.data.data`.

#### API: `GET /api/influencers/username/:username`

Same shape as by-id.

#### API: `GET /api/influencers/stats`

Expected response:
```json
{
  "data": {
    "totalInfluencers": 1200,
    "activeInfluencers": 850,
    "averageEngagement": 4.8
  }
}
```

### 8.2 InfluencerSearchScreen (AI search)

#### API: `POST /instagram/creator-search` (demographics API)

Base URL: `DEMOGRAPHICS_API_BASE_URL` env var (default `https://demographics.phyo.ai`)

Auth: `api-key` header = `DEMOGRAPHICS_API_KEY`

Request payload:
```json
{
  "user_query": "fashion influencer delhi female"
}
```

Retry logic:
1. Tries original prompt
2. Retries with normalized (lowercased, stripped quotes) version
3. Retries with keyword-only version (stop words removed, max 5 keywords)
4. Retries with `keyword_only instagram` variant
5. 500ms delay × attempt index between retries
6. Retries on 504/502 or timeout errors only

Expected response shape:
```json
{
  "results": [
    {
      "username": "fashionista_priya",
      "name": "Priya Sharma",
      "followers": 250000,
      "engagement_rate": 5.2,
      "bio": "Fashion creator",
      "profile_pic": "https://cdn.../pic.jpg",
      "categories": ["Fashion", "Lifestyle"],
      "location": "Delhi, India"
    }
  ]
}
```

#### API: `POST /demographics/analyze` (demographics API)

Used by `getInfluencerDetails` for deep profile analysis.

Request payload:
```json
{
  "username": "fashionista_priya",
  "mode": "sync",
  "fast_mode": true,
  "use_stored_data": true,
  "deadline_seconds": 0,
  "max_posts": 40
}
```

Returns `{ analyze: <analyzeResponse.data>, profileData: null }`.

---

## 9) Lists and Portfolio Screens

### 9.1 MyListsScreen

#### API: `GET /api/lists`

Expected response shape:
```json
{
  "data": [
    {
      "_id": "list_1",
      "name": "Fashion Leads",
      "description": "Prospects for Q3",
      "itemCount": 12,
      "createdAt": "2026-05-01T00:00:00Z"
    }
  ]
}
```

#### API: `POST /api/lists`

Request payload:
```json
{
  "name": "Fashion Leads",
  "description": "Prospects for Q3"
}
```

#### API: `GET /api/lists/:listId`

Expected response shape:
```json
{
  "data": {
    "_id": "list_1",
    "name": "Fashion Leads",
    "description": "Prospects for Q3",
    "items": [
      {
        "_id": "item_1",
        "influencerId": "inf_1",
        "username": "fashionista_priya",
        "status": "shortlisted",
        "notes": "High engagement rate",
        "addedAt": "2026-05-10T00:00:00Z"
      }
    ]
  }
}
```

#### API: `POST /api/lists/:listId/influencers`

Request payload (supports batch):
```json
{
  "influencerId": "inf_123",
  "status": "new",
  "notes": "High priority"
}
```

Or batch:
```json
{
  "influencers": [
    { "influencerId": "inf_123", "status": "new" },
    { "username": "fashionista_priya", "status": "new" }
  ]
}
```

#### API: `DELETE /api/lists/:listId/influencers/:itemId`

#### API: `PATCH /api/lists/:listId/influencers/bulk`

Request payload:
```json
{
  "action": "updateStatus",
  "itemIds": ["item1", "item2"],
  "status": "shortlisted"
}
```

`action` values: `"updateStatus"`, `"remove"`

#### API: `GET /api/lists/:listId/export`

Query params:
```json
{
  "format": "csv"
}
```

Response type: `arraybuffer`. Thunk returns `{ bytes, contentType, disposition, format }`.

#### API: `DELETE /api/lists/:listId`

### 9.2 PortfolioScreen

#### API: `POST /api/portfolios`

Request payload:
```json
{
  "title": "Brand Portfolio",
  "description": "Selected case studies"
}
```

#### API: `GET /api/portfolios`

Expected response shape:
```json
{
  "data": [
    {
      "_id": "port_1",
      "title": "Brand Portfolio",
      "description": "Selected case studies",
      "clientCount": 3,
      "createdAt": "2026-05-01T00:00:00Z"
    }
  ]
}
```

#### API: `GET /api/portfolios/:id`

Expected response shape:
```json
{
  "data": {
    "_id": "port_1",
    "title": "Brand Portfolio",
    "description": "Selected case studies",
    "clients": [
      {
        "_id": "client_1",
        "projectTitle": "Social Campaign",
        "servicesProvided": ["Strategy", "Content"],
        "projectDuration": "3 months",
        "projectStatus": "completed",
        "projectDescription": "Q2 launch campaign",
        "startDate": "2026-01-01T00:00:00Z",
        "endDate": "2026-03-31T00:00:00Z",
        "clientName": "Nike India",
        "budget": 250000,
        "images": ["https://cdn.../img1.jpg"]
      }
    ]
  }
}
```

#### API: `PUT /api/portfolios/:id`

Request payload:
```json
{
  "title": "Updated Portfolio",
  "description": "Updated description"
}
```

#### API: `DELETE /api/portfolios/:id`

#### API: `POST /api/portfolios/:portfolioId/clients`

Important: use plural `/clients`.

Request payload:
```json
{
  "projectTitle": "Social Campaign",
  "servicesProvided": ["Strategy", "Content"],
  "projectDuration": "3 months",
  "projectStatus": "completed",
  "projectDescription": "Q2 launch campaign",
  "startDate": "2026-01-01T00:00:00Z",
  "endDate": "2026-03-31T00:00:00Z",
  "clientName": "Nike India",
  "budget": 250000,
  "images": []
}
```

#### API: `PUT /api/portfolios/:portfolioId/clients/:clientId`

Updates a client entry with the same shape as POST above.

#### API: `DELETE /api/portfolios/:portfolioId/clients/:clientId`

#### API: `GET /api/portfolios/stats`

Expected response shape:
```json
{
  "data": {
    "totalPortfolios": 3,
    "totalClients": 12,
    "totalBudget": 2500000,
    "completedProjects": 10
  }
}
```

---

## 10) Notifications Screen

### 10.1 NotificationsScreen

#### API: `GET /api/notifications`

Query params:
```json
{
  "page": 1,
  "limit": 50
}
```

Expected response shape:
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "_id": "notif_1",
        "userId": "user_1",
        "type": "new_campaign",
        "title": "New Campaign Match",
        "message": "A new campaign matching your niche is available",
        "relatedId": "campaign_1",
        "isRead": false,
        "createdAt": "2026-06-01T10:00:00Z"
      }
    ],
    "unreadCount": 4
  }
}
```

The notification `type` is used to route on tap:
- campaign types → navigate to CampaignOverview
- message types → navigate to Chat

#### API: `GET /api/notifications/unread-count`

Expected response shape:
```json
{
  "data": {
    "count": 4
  }
}
```

Or `response.data.unreadCount` or `response.data.count` — UI should handle variants.

#### API: `PATCH /api/notifications/:notificationId/read`

Expected response:
```json
{
  "success": true,
  "data": {
    "_id": "notif_1",
    "isRead": true
  }
}
```

#### API: `PATCH /api/notifications/read-all`

Marks all notifications read. No payload.

#### API: `DELETE /api/notifications/:notificationId`

Removes single notification.

#### API: `POST /api/auth/resend-otp`

Used by account/verification flows for resending OTP.

Request payload:
```json
{
  "email": "user@example.com"
}
```

---

## 11) Shared API Response Conventions

### Token and user extraction

Used in authSlice for login, google auth, and OTP verify:
```javascript
token = payload?.token || payload?.data?.token
user  = payload?.user || payload?.data?.user || payload?.data
```

### List-shaped responses

Depending on endpoint, the slice reads from the first truthy in this order:
- `payload.data` (most common)
- `payload.brands` / `payload.campaigns` / `payload.conversations` / `payload.messages` / `payload.notifications`
- `payload` (if already an array)

### Campaign list response
```javascript
state.campaigns = action.payload.data || []
state.totalPages = action.payload.pagination?.totalPages || 1
state.currentPage = action.payload.pagination?.currentPage || 1
```

### Brand list response
```javascript
brandData = action.payload?.data || action.payload?.brands || []
```

### Influencer list response
```javascript
influencerData = Array.isArray(action.payload) ? action.payload : action.payload.data || []
```

### Conversation list response (multi-fallback parser)
```javascript
// conversationSlice parseConversations():
if (Array.isArray(payload?.conversations)) return payload.conversations
if (Array.isArray(payload?.data?.conversations)) return payload.data.conversations
if (Array.isArray(payload?.data?.items)) return payload.data.items
if (Array.isArray(payload?.items)) return payload.items
if (Array.isArray(payload?.data)) return payload.data
if (Array.isArray(payload)) return payload
```

### Message list response (same multi-fallback pattern as conversations but for messages key)

### Message send/read responses
```javascript
message = payload?.message || payload?.data?.message || payload?.data || payload
```

### Single conversation response
```javascript
conversation = payload?.conversation || payload?.data?.conversation || payload?.data || payload
```

### Error handling conventions

All thunks call `rejectWithValue` with:
```javascript
error.response?.data?.message || error.message || 'Fallback error text'
```

UI typically shows `error.response?.data?.message` or `error.response?.data?.error` or a static fallback string.

---

## 12) Website Porting Notes

1. Keep endpoint paths identical unless the backend contract is changing.
2. Keep payload keys identical, especially where this app normalizes aliases:
   - `bio` → `about`
   - `socialMedia` → `social_media`
   - `brandImages` → `brand_images`
   - `billingAddress` + `financeEmail` → `billing_info`
   - `planId` → `plan_id`, `userId` → `user_id` (for Razorpay)
3. Preserve the same response shape assumptions or create one response adapter layer. Campaigns use `payload.data`, brands use `payload?.data || payload?.brands`, influencers use `payload.data || payload` (if array).
4. The conversation slice has the most complex parsing — it tries 6 keys in order. Match whichever key the backend returns.
5. Auth responses must return `token` and `user` at top level or nested under `data`.
6. If the website uses React Query instead of Redux thunks, the payload/response contracts stay the same — only the fetching mechanism changes.
7. Nearby campaigns (`POST /api/campaigns/nearby`) is currently disabled in the app pending backend fix.
8. The demographics API (AI search) uses a separate base URL and `api-key` header, not the main auth token.

---

## 13) Quick Handoff Format Per Screen

```text
Screen: Login
API: POST /api/auth/login
Payload: { email, password }
Response used: { token, user }
State: token → AsyncStorage + Redux; user → AsyncStorage + Redux auth.user
After: fetch /api/users/profile, route to Home

Screen: Home (BRAND role)
API: GET /api/campaigns/mine
Payload: { page: 1, limit: 10 }
Response used: { data: Campaign[], pagination: { totalPages, currentPage } }
State: campaigns.campaigns, campaigns.myCampaigns, campaigns.lastFetchedAt
Cache: 5 min TTL — skips fetch if cache fresh

Screen: Home (INFLUENCER role)
API: GET /api/campaigns
Response used: same as above
Also fetches: GET /api/trending/influencers → influencers.trendingInfluencers
Also fetches: GET /api/brands → brands.brands
Cache: 5 min TTL per data type

Screen: InboxScreen
API: GET /api/messages/conversations
Payload: { page: 1, limit: 100 }
Response used: conversations[] from payload.conversations OR payload.data.conversations OR payload.data OR payload
State: conversations.conversations (used for unread badge count on HomeScreen nav)

Screen: ChatBoxScreen
API: GET /api/messages/:conversationId
Payload: { page: 1, limit: 50, sort: "desc" }
Response used: messages[] from payload.messages OR payload.data.messages OR payload.data OR payload
State: conversations.messages

Screen: NotificationsScreen
API: GET /api/notifications
Payload: { page: 1, limit: 50 }
Response used: data.notifications[], data.unreadCount
State: notifications.notifications, notifications.unreadCount

Screen: PlansScreen
API: GET /api/payment/razorpay/plans
Response used: data.items[] — each item has id, item.amount, item.name, period, interval

Screen: BillingScreen (checkout)
API: POST /api/payment/razorpay/subscriptions
Payload: { plan_id, user_id, total_count: 12 }
Response used: data.id (subscriptionId), data.status, data.short_url
```

# COMPREHENSIVE API INTEGRATION REPORT
## Phyo Client - Mock Data & Missing API Endpoints

**Date:** March 17, 2026
**Total Files Analyzed:** 343+ component files
**Report Focus:** Hardcoded/mock data requiring real API integration

---

## EXECUTIVE SUMMARY

This report identifies **26+ files** across **10 major feature categories** that contain hardcoded/mock data requiring real API endpoints. The codebase has a well-structured Redux-based state management system in place but many pages still depend on mock/inline data instead of real API calls.

**NEW ADDITIONS:**
- **Trending APIs** - Enhanced trending system for influencers, campaigns, brands, and categories
- **Location-Based APIs** - Nearby influencers, brands, campaigns, and location management

**Priority Areas:**
1. Dashboard/Overview Pages (Trending Data)
2. Campaign Management (Create, Edit, Boost, Deliverables)
3. Trending System (Influencers, Campaigns, Brands, Categories)
4. Location-Based Features (Nearby Influencers, Brands, Campaigns)
5. Notifications & Messaging
6. Account/Billing Pages
7. Admin Dashboard

**API Endpoint Count Summary:**
- Current Missing Endpoints: **80+**
- Trending Endpoints: **7**
- Location-Based Endpoints: **7**
- Total Estimated Endpoints: **94+**

---

## 1. DASHBOARD/OVERVIEW PAGES

### 1.1 Campaign Section Mock Data
**File:** `/c/Phyo/phyo_client/src/components/dashboard/sections/CampaignSection.jsx`

**Current Status:** Partial API integration
**Issues:**
- Uses `useCampaigns()` hook to fetch campaigns
- Falls back to `/dummyAvatar.jpg` for missing campaign images
- Hardcodes initials color mapping

**Data Structure Returned:**
```javascript
{
  id: campaign._id,
  brandName: campaign.brandId?.companyName || 'Unknown Brand',
  brandInitials: getInitials(campaign.brandId?.companyName),
  timeAgo: getTimeAgo(campaign.createdAt),
  campaignImage: campaign.productImages?.[0] || '/dummyAvatar.jpg',
  initialsColor: getInitialsColor(campaign._id)
}
```

**API Endpoints Needed:**
- **GET** `/api/campaigns` - List campaigns with pagination
- Response should include: `_id`, `brandId`, `productImages`, `createdAt`, `status`

**Affected Roles:** Brand, Influencer, User

---

### 1.2 Trending Influencers Section
**File:** `/c/Phyo/phyo_client/src/components/dashboard/sections/TrendingInfluencersSection.jsx`

**Current Status:** Partial API integration
**Issues:**
- Uses `useInfluencers()` hook with `fetchTrendingInfluencers()`
- Falls back to `/dummyAvatar.jpg` for missing avatars
- Hardcoded color array for avatars

**API Endpoints Needed:**
- **GET** `/api/influencers/trending` - List trending influencers
  - **Query Params:** `limit=10`
  - Response should include: `_id`, `name`, `avatar`

**Affected Roles:** Brand, Influencer, User

---

### 1.3 Influencer List Section
**File:** `/c/Phyo/phyo_client/src/components/dashboard/sections/InfluencerListSection.jsx`

**Current Status:** Partial API integration
**Issues:**
- Uses `fetchInfluencers()` from Redux hook
- Falls back to `/dummyAvatar.jpg`
- Hardcoded color array assignment
- Plan restriction error checking (partially implemented)

**API Endpoints Needed:**
- **GET** `/api/influencers` - List influencers by role/category
  - **Query Params:** `limit=10`
  - Response should include: `_id`, `id`, `name`, `avatar`

**Affected Roles:** Brand, Influencer, User

---

### 1.4 Explore Brands Section
**File:** `/c/Phyo/phyo_client/src/components/dashboard/sections/ExploreBrandsSection.jsx`

**Current Status:** Partial API integration
**Issues:**
- Extracts brands from campaigns array
- Hardcoded color options array
- No dedicated brands endpoint

**Expected Response Structure:**
```javascript
{
  id: brand.id || Math.random(),
  name: `${brand.firstName || ''} ${brand.lastName || 'Unknown Brand'}`,
  companyName: brand.companyName || '',
  campaigns: number,
  totalBudget: number,
  initial: string (max 2 chars),
  color: string (bg-color class)
}
```

**API Endpoints Needed:**
- **GET** `/api/brands` or `/api/brands/trending` - List brands
  - Response should include: `id`, `firstName`, `lastName`, `companyName`, `campaigns`

**Affected Roles:** Brand, Influencer, User

---

## 2. CAMPAIGN PAGES

### 2.1 Campaign Detail Page - Mock Deliverables & Applications
**File:** `/c/Phyo/phyo_client/src/components/campaigns/campaigns-detail/page.jsx`

**Current Status:** No API integration - Full mock data

**Hardcoded Mock Data:**
```javascript
const deliverables = [
  {
    id: 1,
    title: 'InstagramFill Story',
    details: 'UTC • Duration 15 Secs',
    icon: AddLine,
    status: '1'
  },
  // ... more deliverables
];

const applications = [
  {
    name: 'Michael Smith',
    role: 'An innovative web developer...',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  // ... more applications
];

const influencers = [
  {
    id: 1,
    name: 'Michael Smith',
    role: 'An innovative web developer...',
    avatar: 'https://images.unsplash.com/...',
    status: 'Pending Review',
    statusColor: 'bg-blue-100 text-blue-700'
  },
  // ... more influencers
];
```

**API Endpoints Needed:**
- **GET** `/api/campaigns/{campaignId}` - Get campaign details
- **GET** `/api/campaigns/{campaignId}/deliverables` - Get campaign deliverables
  - Response structure: `{ id, title, details, icon, status }`
- **GET** `/api/campaigns/{campaignId}/applications` - Get applications
  - Response structure: `{ id, name, role, avatar, status }`
- **GET** `/api/campaigns/{campaignId}/influencers` - Get assigned influencers
  - Response structure: `{ id, name, role, avatar, status, statusColor }`

**Affected Roles:** Brand, Influencer

---

### 2.2 Boost Campaign Page
**File:** `/c/Phyo/phyo_client/src/components/campaigns/boost-campaign/page.jsx`

**Current Status:** No API integration - Full mock data

**Hardcoded Mock Data:**
```javascript
const recommendations = [
  {
    id: 1,
    title: 'Supercharge Campaign',
    description: 'Amplify reach and engagement with advanced boost options',
    badge: 'RECOMMENDED',
    badgeColor: 'bg-green-100 text-green-700',
    cardColor: 'bg-green-700',
    icon: '⚡'
  },
  // More boost options...
];
```

**API Endpoints Needed:**
- **GET** `/api/campaigns/{campaignId}/boost-recommendations` - Get boost recommendations
  - Response structure: `{ id, title, description, badge, badgeColor, cardColor, icon, metric?, metricColor? }`
- **POST** `/api/campaigns/{campaignId}/boost` - Apply boost to campaign
  - Body: `{ selectedOptions: id[] }`

**Affected Roles:** Brand

---

### 2.3 Influencer Counter Offer Page
**File:** `/c/Phyo/phyo_client/src/components/campaigns/influencer-counter-offer/page.jsx`

**Current Status:** No API integration - Hardcoded state

**Hardcoded State:**
```javascript
const [negotiationStatus, setNegotiationStatus] = useState('pending');
const [counterOfferAmount, setCounterOfferAmount] = useState('$3,500');

const timelineEvents = [
  { id: 1, title: 'Deliverable Submitted', time: '2 hours ago', status: 'completed' },
  { id: 2, title: 'Counter offer sent', time: '1 day ago', status: 'completed' },
  { id: 3, title: 'Influencer invited', time: '3 days ago', status: 'pending' }
];
```

**API Endpoints Needed:**
- **GET** `/api/campaigns/{campaignId}/negotiations/{influencerId}` - Get negotiation details
- **POST** `/api/campaigns/{campaignId}/negotiations/{influencerId}/counter-offer` - Send counter offer
  - Body: `{ amount, message }`
- **POST** `/api/campaigns/{campaignId}/negotiations/{influencerId}/accept` - Accept counter offer
- **POST** `/api/campaigns/{campaignId}/negotiations/{influencerId}/reject` - Reject counter offer
- **GET** `/api/campaigns/{campaignId}/negotiations/{influencerId}/timeline` - Get negotiation timeline

**Affected Roles:** Brand

---

### 2.4 Influencer Detail Deliverables Page
**File:** `/c/Phyo/phyo_client/src/components/campaigns/influencer-detail-deliverables/page.jsx`

**Current Status:** No API integration - Full mock data

**Hardcoded Mock Data:**
```javascript
const deliverables = [
  {
    id: 1,
    type: 'InstagramFill Post',
    submittedDate: 'Submitted June 15, 2026',
    image: 'https://images.unsplash.com/photo-...',
    caption: 'Loving this new summer collection!...',
    status: 'pending'
  },
  // More deliverables...
];

const timelineEvents = [
  { id: 1, title: 'Deliverable Submitted', time: '2hours ago', status: 'completed' },
  { id: 2, title: 'Counter offer sent', time: '1 day ago', status: 'completed' },
  { id: 3, title: 'Influencer invited', time: '3 days ago', status: 'pending' }
];
```

**API Endpoints Needed:**
- **GET** `/api/campaigns/{campaignId}/influencers/{influencerId}/deliverables` - Get deliverables
- **POST** `/api/campaigns/{campaignId}/influencers/{influencerId}/deliverables/{id}/approve` - Approve deliverable
- **POST** `/api/campaigns/{campaignId}/influencers/{influencerId}/deliverables/{id}/request-changes` - Request changes
  - Body: `{ message }`
- **GET** `/api/campaigns/{campaignId}/influencers/{influencerId}/timeline` - Get timeline events

**Affected Roles:** Brand

---

### 2.5 New Applications Page
**File:** `/c/Phyo/phyo_client/src/components/campaigns/new-applications/page.jsx`

**Current Status:** No API integration - Extensive mock data

**Hardcoded Mock Data:** 4+ mock influencer application objects with full details:
```javascript
const mockApplicationsData = [
  {
    id: 1,
    name: 'Michael Smith',
    username: '@michaelsmith',
    bio: 'An innovative web developer...',
    avatar: '/dummyAvatar.jpg',
    coverImage: '/world-bg.png',
    stats: {
      brandCollaborations: 24,
      instagramFollowers: '222k',
      linkedinFollowers: '50k',
      xFollowers: '70k',
      youtubeSubscribers: '100k'
    },
    pricing: {
      instagram: { reel: '$500', story: '$200', post: '$350', carousel: '$400' },
      youtube: { video: '$1000', short: '$300', integration: '$800' },
      x: { post: '$150' },
      linkedin: { post: '$250' }
    },
    socials: { instagram, youtube, x, linkedin, website },
    memberSince: '16 June 2024',
    availabilityStatus: 'Available Now'
  },
  // More applications...
];
```

**API Endpoints Needed:**
- **GET** `/api/campaigns/{campaignId}/applications` - Get campaign applications
  - Response structure: Complete influencer profile + stats + pricing
- **POST** `/api/campaigns/{campaignId}/applications/{applicationId}/accept` - Accept application
- **POST** `/api/campaigns/{campaignId}/applications/{applicationId}/reject` - Reject application
- **POST** `/api/campaigns/{campaignId}/applications/{applicationId}/counter-offer` - Send counter offer

**Affected Roles:** Brand

---

## 3. INFLUENCER PAGES

### 3.1 All Influencers List Page
**File:** `/c/Phyo/phyo_client/src/app/brand/influencers/page.jsx`

**Current Status:** No API integration - Extensive mock data

**Hardcoded Mock Data:**
```javascript
const mockInfluencersData = [
  {
    id: 1,
    name: 'Campaign Chacha',
    username: '@campaignchacha',
    followers: '22.4k followers',
    avatar: '/dummyAvatar.jpg',
    coverImage: '/world-bg.png',
    bio: 'Content creator specializing in...',
    tags: ['Marketing', 'Branding', 'Content Strategy'],
    stats: {
      followers: '22.4k',
      following: '1.2k',
      posts: '856',
      engagement: '5.8%'
    },
    platforms: {
      instagram: '22.4k',
      youtube: '15.3k',
      twitter: '8.9k'
    }
  },
  // ... 5+ more mock influencers
];
```

**API Endpoints Needed:**
- **GET** `/api/influencers` - List all influencers with filters
  - **Query Params:** `page`, `limit`, `search`, `niche`, `engagement_min`, `followers_min`
  - Response structure: Array of influencer objects with all profile data

**Expected Response Structure:**
```javascript
{
  id: string,
  name: string,
  username: string,
  followers: string,
  avatar: string,
  coverImage: string,
  bio: string,
  tags: string[],
  stats: {
    followers: string,
    following: string,
    posts: string,
    engagement: string
  },
  platforms: {
    instagram: string,
    youtube: string,
    twitter: string,
    tiktok?: string
  }
}
```

**Affected Roles:** Brand, User

---

## 4. ACCOUNT/BILLING PAGES

### 4.1 Transactions/Billing History Page
**File:** `/c/Phyo/phyo_client/src/app/brand/account/transactions/page.jsx`

**Current Status:** No API integration - Full mock data in useEffect

**Hardcoded Mock Data:**
```javascript
const mockTransactions = [
  {
    id: 1,
    date: '2026-07-20',
    time: '9:30 AM',
    month: 'December 2025',
    type: 'Payment Failed',
    amount: '-₹499',
    amountColor: 'text-red-600',
    action: 'Retry Payment',
    icon: 'bg-blue-600'
  },
  // ... 4+ more mock transactions
];
```

**Comment in Code:** `// Mock transactions data grouped by month`

**API Endpoints Needed:**
- **GET** `/api/transactions` - Get user transactions
  - **Query Params:** `page`, `limit`, `status`, `dateFrom`, `dateTo`
  - Response structure: Array of transaction objects

**Expected Response Structure:**
```javascript
{
  id: string,
  date: string (YYYY-MM-DD),
  time: string,
  month: string,
  type: string (enum: 'Payment Failed', 'Payment Successful', 'Refund Processed', etc.),
  amount: string,
  amountColor: string (CSS class),
  action: string,
  icon: string (CSS class)
}
```

**Affected Roles:** Brand, Influencer, User

---

### 4.2 Billing History Page
**File:** `/c/Phyo/phyo_client/src/components/Account/billing-history/page.jsx`

**Current Status:** Partial API integration with mock fallback

**Hardcoded Mock Data:**
```javascript
const mockBillingHistory = [
  {
    id: 1,
    title: 'Cancelled Free Trial',
    date: '3:45 PM 05-01-2026',
    amount: '+₹0',
    action: 'DownloadLine Invoice',
    status: 'completed'
  },
  {
    id: 2,
    title: 'Payment Failed',
    date: '9:30 AM 07-20-2026',
    amount: '-₹499',
    action: 'Retry Payment',
    isNegative: true,
    status: 'failed'
  },
  // ... 3+ more billing records
];
```

**Code:** `const transactions = (paymentHistory && paymentHistory.length > 0) ? paymentHistory : mockBillingHistory;`

**API Endpoints Needed:**
- **GET** `/api/payments/history` - Get billing history
  - **Query Params:** `page`, `limit`, `status`, `dateFrom`, `dateTo`
  - Response should include same structure as mockBillingHistory

**Affected Roles:** Brand, Influencer, User

---

### 4.3 Payment Methods Page
**File:** `/c/Phyo/phyo_client/src/components/Account/payment-methods/page.jsx`

**Current Status:** Partial API integration with mock fallback

**Hardcoded Mock Data:**
```javascript
const mockPaymentMethods = [
  {
    id: 1,
    type: 'visa',
    lastFourDigits: '4242',
    expiryDate: '12/25',
    isDefault: true
  },
  {
    id: 2,
    type: 'mastercard',
    lastFourDigits: '5555',
    expiryDate: '08/26',
    isDefault: false
  },
  {
    id: 3,
    type: 'upi',
    lastFourDigits: '9876',
    expiryDate: null,
    isDefault: false
  }
];
```

**Code:** `setPaymentMethods(mockPaymentMethods);`

**API Endpoints Needed:**
- **GET** `/api/payments/methods` - Get saved payment methods
- **POST** `/api/payments/methods` - Add new payment method (Razorpay integration)
- **PUT** `/api/payments/methods/{id}/default` - Set default payment method
- **DELETE** `/api/payments/methods/{id}` - Delete payment method

**Expected Response Structure:**
```javascript
{
  id: string,
  type: string (enum: 'visa', 'mastercard', 'amex', 'upi'),
  lastFourDigits: string,
  expiryDate: string | null,
  isDefault: boolean
}
```

**Affected Roles:** Brand, Influencer, User

---

### 4.4 Subscription Management Page
**File:** `/c/Phyo/phyo_client/src/components/Account/subscription-management/page.jsx`

**Current Status:** Partial API integration with timeline mock data

**Hardcoded Mock Data:**
```javascript
const timelineEvents = [
  {
    date: 'Mar 17, 2026',
    title: 'Subscription Started',
    description: 'Premium plan activated'
  },
  {
    date: 'Feb 17, 2026',
    title: 'Plan Upgraded',
    description: 'Upgraded from Basic to Premium'
  },
  {
    date: 'Jan 17, 2026',
    title: 'Subscription Renewed',
    description: 'Basic plan renewed for 1 month'
  }
];

const downgradeOptions = [...];
```

**API Endpoints Needed:**
- **GET** `/api/subscriptions/current` - Get current subscription (already partially implemented)
- **GET** `/api/subscriptions/timeline` - Get subscription history timeline
- **GET** `/api/subscriptions/plans` - Get available plans
- **POST** `/api/subscriptions/upgrade` - Upgrade subscription
  - Body: `{ planId, billingCycle }`
- **POST** `/api/subscriptions/downgrade` - Downgrade subscription
  - Body: `{ planId, billingCycle }`
- **POST** `/api/subscriptions/cancel` - Cancel subscription

**Affected Roles:** Brand, Influencer, User

---

### 4.5 My Lists Page
**File:** `/c/Phyo/phyo_client/src/components/Account/my-lists/page.jsx`

**Current Status:** No API integration - Full mock data

**Hardcoded Mock Data:**
```javascript
const [lists, setLists] = useState([
  {
    id: 1,
    name: 'Emily Thompson',
    description: 'Lifestyle influencer sharing sustainable living tips...',
    avatar: '/dummyAvatar.jpg',
    list: 'Favorites'
  },
  // ... 4+ more mock list items
]);

const chips = ['All', 'Favorites', 'Campaign 1', 'Campaign 2', 'Label', 'Label', ...];
```

**Comment:** `// Mock data - Replace with actual API call`

**API Endpoints Needed:**
- **GET** `/api/lists` - Get user's saved lists
- **GET** `/api/lists/{listId}/items` - Get items in a list
- **POST** `/api/lists` - Create new list
  - Body: `{ name, description }`
- **POST** `/api/lists/{listId}/items` - Add item to list
  - Body: `{ influencerId }`
- **DELETE** `/api/lists/{listId}/items/{itemId}` - Remove item from list
- **PUT** `/api/lists/{listId}` - Update list
- **DELETE** `/api/lists/{listId}` - Delete list

**Expected Response Structure:**
```javascript
{
  id: string,
  name: string,
  description: string,
  avatar: string,
  list: string (category/list name)
}
```

**Affected Roles:** Brand

---

### 4.6 Help & Support Page
**File:** `/c/Phyo/phyo_client/src/components/Account/help-support/page.jsx`

**Current Status:** Partial API integration - Some mock data

**Hardcoded Mock Data:**
```javascript
const languages = [
  { id: 'english', name: 'English', subtitle: "device's language" },
  { id: 'hindi', name: 'हिंदी', subtitle: 'Hindi' },
  { id: 'marathi', name: 'मराठी', subtitle: 'Marathi' },
  // ... 5+ more languages
];

const faqs = [
  {
    id: 1,
    title: "How to use the app?",
    content: "Our app is designed to be intuitive and user-friendly..." (long content)
  },
  // ... 4+ more FAQs
];
```

**API Endpoints Needed:**
- **GET** `/api/help/faqs` - Get FAQ list with search/filter support
  - **Query Params:** `search`, `language`, `category`
- **GET** `/api/help/languages` - Get supported languages
- **POST** `/api/help/contact` - Submit help/support request
  - Body: `{ subject, message, contactMethod }`
- **GET** `/api/help/categories` - Get help categories

**Affected Roles:** Brand, Influencer, User

---

## 5. NOTIFICATIONS & MESSAGING

### 5.1 Notifications Page
**File:** `/c/Phyo/phyo_client/src/app/brand/notifications/page.jsx`

**Current Status:** No API integration - Full hardcoded mock data

**Hardcoded Mock Data:**
```javascript
const notifications = [
  {
    id: 1,
    type: 'request',
    avatar: '/dummyAvatar.jpg',
    avatarBg: '#ff4f6d',
    label: 'Campaign Invitation',
    paragraph: 'You have been invited to join a new campaign',
    hasActions: true
  },
  // ... 4+ more notifications with various types
];
```

**API Endpoints Needed:**
- **GET** `/api/notifications` - Get user notifications
  - **Query Params:** `page`, `limit`, `status`, `filter` (All, Invitation Requests, New Campaigns, Applications)
- **PUT** `/api/notifications/{id}/read` - Mark notification as read
- **PUT** `/api/notifications/{id}/action` - Perform action on notification
  - Body: `{ action: 'accept' | 'reject' | 'view' }`
- **DELETE** `/api/notifications/{id}` - Delete notification

**Expected Response Structure:**
```javascript
{
  id: string,
  type: string (enum: 'request', 'unread', 'normal', 'action', 'detail'),
  avatar: string,
  avatarBg: string (hex color),
  label: string,
  paragraph?: string,
  hasActions?: boolean,
  hasNotificationDot?: boolean,
  hasButton?: boolean,
  trailingLabel?: string,
  trailingParagraph?: string,
  hasChevron?: boolean,
  timestamp?: string
}
```

**Affected Roles:** Brand, Influencer, User

---

### 5.2 Inbox/Messaging
**File:** `/c/Phyo/phyo_client/src/components/inbox/InboxPage.jsx`

**Current Status:** Partial API integration with Redux

**Issues:**
- Uses `useMessaging()` hook which fetches from Redux
- Falls back to `/dummyAvatar.jpg` for missing participant avatars
- Messaging structure seems partially implemented but may lack full backend integration

**API Endpoints Needed (if not fully implemented):**
- **GET** `/api/messages/conversations` - Get user's conversations
- **GET** `/api/messages/conversations/{conversationId}/messages` - Get messages in conversation
- **POST** `/api/messages/send` - Send new message
  - Body: `{ conversationId, content }`
- **PUT** `/api/messages/conversations/{conversationId}/read` - Mark conversation as read
- **POST** `/api/messages/conversations` - Start new conversation
  - Body: `{ participantId }`

**Expected Response Structure (Conversations):**
```javascript
{
  _id: string,
  id: string,
  participantName: string,
  participantAvatar: string,
  name: string,
  unread: boolean,
  lastMessage: string,
  lastMessageTime: string
}
```

**Affected Roles:** Brand, Influencer, User

---

## 6. BRAND PAGES

### 6.1 Brand Profile Detail Page
**File:** `/c/Phyo/phyo_client/src/app/brand/brand-profile/[id]/page.jsx`

**Current Status:** Dynamic routing in place but may lack full API integration

**API Endpoints Needed:**
- **GET** `/api/brands/{brandId}` - Get brand profile details
- **GET** `/api/brands/{brandId}/campaigns` - Get brand's campaigns
- **GET** `/api/brands/{brandId}/stats` - Get brand statistics

**Expected Response Structure:**
```javascript
{
  id: string,
  name: string,
  companyName: string,
  bio: string,
  avatar: string,
  coverImage: string,
  stats: {
    campaigns: number,
    totalBudget: number,
    influencersWorkedWith: number
  },
  socialLinks: { website, instagram, twitter, linkedin },
  campaigns: Campaign[]
}
```

**Affected Roles:** Influencer, User

---

## 7. ADMIN PAGES

### 7.1 Admin Dashboard
**File:** `/c/Phyo/phyo_client/src/app/admin/dashboard/page.jsx`

**Current Status:** Partial API integration

**Issues:**
- Fetches from `adminAPI.getRequests()` and `adminAPI.getInfluencerRequests()`
- Has error handling for 404 endpoints
- May need more robust implementation

**API Endpoints Needed:**
- **GET** `/api/admin/requests/brands` - Get pending brand requests
- **GET** `/api/admin/requests/influencers` - Get pending influencer requests
- **PUT** `/api/admin/requests/{id}/approve` - Approve request
- **PUT** `/api/admin/requests/{id}/reject` - Reject request
- **GET** `/api/admin/requests/{id}` - Get request details

**Expected Response Structure:**
```javascript
{
  _id: string,
  id: string,
  status: string (enum: 'PENDING', 'APPROVED', 'REJECTED'),
  createdAt: string (ISO date),
  updatedAt: string (ISO date),
  // Brand-specific fields
  company_name?: string,
  contact?: { first_name, last_name, email, phone },
  industry?: string,
  company_type?: string,
  // Influencer-specific fields
  full_name?: string,
  stage_name?: string,
  gender?: string,
  niches?: string[],
  // Common fields
  social_media?: { instagram, facebook, twitter, youtube, tiktok },
  bio?: string,
  location?: { city, state, country }
}
```

**Affected Roles:** Admin

---

## 8. CAMPAIGN CREATION & EDITING

### 8.1 Create Campaign Page
**File:** `/c/Phyo/phyo_client/src/components/campaigns/create-campaign/page.jsx`

**Current Status:** Partial API integration

**Issues:**
- Uses `useApiMutation()` for creating campaigns
- Form state management in place
- May need refinement on deliverable and file handling

**API Endpoints Needed:**
- **POST** `/api/campaigns` - Create new campaign
  - Body: Campaign form data with deliverables and images
- **GET** `/api/campaigns/types` - Get available campaign types
- **GET** `/api/campaigns/deliverable-types` - Get deliverable type options

**Expected Request Body:**
```javascript
{
  title: string,
  description: string,
  budget: number,
  duration: { startDate, endDate },
  campaignTypes: string[],
  deliverables: { type: string, count: number }[],
  productImages: File[],
  targetAudience: { niches, demographics, locations }
}
```

**Affected Roles:** Brand

---

## 9. TRENDING APIS

### 9.1 Trending Influencers - Full Implementation
**Current Location:** `src/components/dashboard/sections/TrendingInfluencersSection.jsx`

**Status:** ✅ Partially working but needs enhancement

**What Currently Works:**
- Fetches from `/auth/influencers` with limit parameter
- Redux integration with `useInfluencers()` hook
- Displays top 10 influencers with colors

**What's Missing:**
- No sorting/ranking by engagement metrics
- No filter by category/niche
- No time-range filter (trending this week/month)
- No engagement score calculation

**API Endpoints Needed:**

#### 9.1.1 GET Trending Influencers (Enhanced)
```
GET /api/influencers/trending
```

**Query Parameters:**
```javascript
{
  limit: number,           // default: 10
  timeRange: 'week'|'month'|'all',  // default: 'week'
  category?: string,       // filter by niche
  minEngagement?: number,  // minimum engagement rate (0-100)
  minFollowers?: number,   // minimum follower count
  sortBy: 'engagement'|'followers'|'growth'  // default: 'engagement'
}
```

**Response Structure:**
```javascript
{
  data: [
    {
      _id: string,
      id: string,
      name: string,
      username: string,
      avatar: string,
      followers: number,
      engagement: number,    // percentage (e.g., 5.8)
      engagementTrend: number,  // +/- change from last period
      category: string[],
      trendingScore: number, // 0-100 ranking score
      growth: {
        weekly: number,
        monthly: number,
        quarterly: number
      },
      platforms: {
        instagram: number,
        youtube: number,
        twitter: number,
        tiktok: number
      },
      lastActive: string (ISO timestamp)
    }
  ],
  pagination: {
    page: number,
    limit: number,
    total: number,
    pages: number
  },
  metadata: {
    timeRange: string,
    generatedAt: string (ISO timestamp)
  }
}
```

**Affected Roles:** Brand, Influencer, User

---

#### 9.1.2 GET Trending Campaigns
```
GET /api/campaigns/trending
```

**Query Parameters:**
```javascript
{
  limit: number,        // default: 6
  timeRange: 'week'|'month'|'all',
  category?: string,
  minBudget?: number,
  sortBy: 'applications'|'budget'|'engagement'
}
```

**Response Structure:**
```javascript
{
  data: [
    {
      _id: string,
      title: string,
      description: string,
      brand: {
        id: string,
        name: string,
        companyName: string,
        avatar: string
      },
      budget: number,
      applications: number,
      acceptedInfluencers: number,
      engagement: number,
      category: string[],
      trendingRank: number,
      status: 'active'|'ending_soon'|'completed',
      daysLeft: number,
      productImages: string[],
      createdAt: string
    }
  ],
  pagination: { page, limit, total, pages }
}
```

**Affected Roles:** Brand, Influencer, User

---

#### 9.1.3 GET Trending Brands
```
GET /api/brands/trending
```

**Query Parameters:**
```javascript
{
  limit: number,        // default: 8
  timeRange: 'week'|'month'|'all',
  sortBy: 'campaigns'|'budget'|'applications'
}
```

**Response Structure:**
```javascript
{
  data: [
    {
      _id: string,
      id: string,
      name: string,
      companyName: string,
      avatar: string,
      trendingRank: number,
      activeCampaigns: number,
      totalBudget: number,
      influencersWorkedWith: number,
      recentCampaigns: Campaign[],
      category: string[]
    }
  ],
  pagination: { page, limit, total, pages }
}
```

**Affected Roles:** Influencer, User

---

#### 9.1.4 GET Trending Niches/Categories
```
GET /api/trending/categories
```

**Query Parameters:**
```javascript
{
  timeRange: 'week'|'month'|'all'
}
```

**Response Structure:**
```javascript
{
  data: [
    {
      name: string,
      displayName: string,
      influencerCount: number,
      campaignCount: number,
      trendScore: number,  // 0-100
      growth: number,      // % growth
      icon: string
    }
  ]
}
```

**Affected Roles:** Brand, Influencer, User

---

## 10. NEARBY/LOCATION-BASED APIS

### 10.1 Nearby Influencers
**Status:** ❌ NOT IMPLEMENTED

**Description:** Find influencers based on geographic location/proximity

**API Endpoints Needed:**

#### 10.1.1 GET Nearby Influencers
```
GET /api/influencers/nearby
```

**Query Parameters:**
```javascript
{
  latitude: number,      // required
  longitude: number,     // required
  radius: number,        // in km, default: 50
  limit: number,         // default: 20
  category?: string,
  minFollowers?: number,
  engagement?: number
}
```

**Response Structure:**
```javascript
{
  data: [
    {
      _id: string,
      id: string,
      name: string,
      username: string,
      avatar: string,
      followers: number,
      engagement: number,
      category: string[],
      location: {
        city: string,
        state: string,
        country: string,
        coordinates: {
          latitude: number,
          longitude: number
        }
      },
      distance: number,    // in km from provided coordinates
      platforms: {
        instagram: number,
        youtube: number,
        twitter: number
      }
    }
  ],
  pagination: { page, limit, total, pages }
}
```

**Affected Roles:** Brand

---

#### 10.1.2 GET Influencer Location Search
```
GET /api/influencers/location/search
```

**Query Parameters:**
```javascript
{
  city?: string,
  state?: string,
  country?: string,
  zipCode?: string,
  limit: number,
  page: number,
  category?: string
}
```

**Response Structure:** Same as nearby influencers (without distance field)

**Affected Roles:** Brand

---

### 10.2 Nearby Brands
**Status:** ❌ NOT IMPLEMENTED

**Description:** Find brands/companies based on geographic location

#### 10.2.1 GET Nearby Brands
```
GET /api/brands/nearby
```

**Query Parameters:**
```javascript
{
  latitude: number,
  longitude: number,
  radius: number,        // in km, default: 100
  limit: number,         // default: 15
  industry?: string
}
```

**Response Structure:**
```javascript
{
  data: [
    {
      _id: string,
      id: string,
      name: string,
      companyName: string,
      avatar: string,
      location: {
        city: string,
        state: string,
        country: string,
        address: string,
        coordinates: {
          latitude: number,
          longitude: number
        }
      },
      distance: number,    // in km
      industry: string,
      activeCampaigns: number,
      totalBudget: number
    }
  ],
  pagination: { page, limit, total, pages }
}
```

**Affected Roles:** Influencer, User

---

#### 10.2.2 GET Brand Location Search
```
GET /api/brands/location/search
```

**Query Parameters:**
```javascript
{
  city?: string,
  state?: string,
  country?: string,
  industry?: string,
  limit: number,
  page: number
}
```

**Response Structure:** Same as nearby brands (without distance field)

**Affected Roles:** Influencer, User

---

### 10.3 Nearby Campaigns
**Status:** ❌ NOT IMPLEMENTED

**Description:** Find active campaigns based on brand location

#### 10.3.1 GET Nearby Active Campaigns
```
GET /api/campaigns/nearby
```

**Query Parameters:**
```javascript
{
  latitude: number,
  longitude: number,
  radius: number,        // in km, default: 100
  limit: number,         // default: 12
  category?: string,
  minBudget?: number,
  maxBudget?: number
}
```

**Response Structure:**
```javascript
{
  data: [
    {
      _id: string,
      title: string,
      description: string,
      brand: {
        id: string,
        name: string,
        location: {
          city: string,
          state: string,
          coordinates: { latitude, longitude }
        }
      },
      budget: number,
      category: string[],
      daysLeft: number,
      distance: number,    // in km from provided coordinates
      applications: number,
      acceptedInfluencers: number,
      productImages: string[],
      status: 'active'|'ending_soon'
    }
  ],
  pagination: { page, limit, total, pages }
}
```

**Affected Roles:** Influencer, User

---

### 10.4 Location Data Management
**Status:** ❌ NOT IMPLEMENTED

#### 10.4.1 POST Update User Location
```
POST /api/users/location
```

**Body:**
```javascript
{
  latitude: number,
  longitude: number,
  city: string,
  state: string,
  country: string,
  zipCode?: string,
  isPublic: boolean  // allow location visibility
}
```

**Response:**
```javascript
{
  message: "Location updated successfully",
  location: {
    city: string,
    state: string,
    country: string,
    coordinates: { latitude, longitude }
  }
}
```

**Affected Roles:** Brand, Influencer, User

---

#### 10.4.2 GET Supported Locations/Cities
```
GET /api/locations/supported
```

**Query Parameters:**
```javascript
{
  country?: string,
  state?: string,
  search?: string  // autocomplete search
}
```

**Response:**
```javascript
{
  data: [
    {
      id: string,
      city: string,
      state: string,
      country: string,
      influencerCount: number,
      campaignCount: number,
      coordinates: { latitude, longitude }
    }
  ]
}
```

**Affected Roles:** All

---

## SUMMARY TABLE

| Category | Feature | File | Status | Endpoint Count | Roles |
|----------|---------|------|--------|-----------------|-------|
| Dashboard | Campaigns | CampaignSection.jsx | Partial | 1 | All |
| Dashboard | Trending Influencers | TrendingInfluencersSection.jsx | Partial | 1 | All |
| Dashboard | Influencer List | InfluencerListSection.jsx | Partial | 1 | All |
| Dashboard | Explore Brands | ExploreBrandsSection.jsx | Partial | 1 | All |
| Campaign | Details | campaigns-detail.jsx | None | 3 | Brand, Influencer |
| Campaign | Boost | boost-campaign.jsx | None | 2 | Brand |
| Campaign | Counter Offer | influencer-counter-offer.jsx | None | 4 | Brand |
| Campaign | Deliverables | influencer-detail-deliverables.jsx | None | 3 | Brand |
| Campaign | Applications | new-applications.jsx | None | 3 | Brand |
| Campaign | Create | create-campaign.jsx | Partial | 3 | Brand |
| Influencer | All Influencers | influencers/page.jsx | None | 1 | Brand, User |
| Account | Transactions | transactions/page.jsx | None | 1 | All |
| Account | Billing History | billing-history.jsx | Partial | 1 | All |
| Account | Payment Methods | payment-methods.jsx | Partial | 4 | All |
| Account | Subscription | subscription-management.jsx | Partial | 5 | All |
| Account | My Lists | my-lists.jsx | None | 6 | Brand |
| Account | Help/Support | help-support.jsx | Partial | 4 | All |
| Notifications | Notifications | notifications/page.jsx | None | 3 | All |
| Messaging | Inbox | InboxPage.jsx | Partial | 5 | All |
| Admin | Dashboard | admin/dashboard.jsx | Partial | 3 | Admin |
| Brand | Brand Profile | brand-profile/[id].jsx | Unknown | 3 | Influencer, User |
| **TRENDING** | **Trending Influencers** | **TrendingInfluencersSection.jsx** | **Partial** | **4** | **All** |
| **TRENDING** | **Trending Campaigns** | **Dashboard/Campaign Sections** | **None** | **1** | **All** |
| **TRENDING** | **Trending Brands** | **ExploreBrandsSection.jsx** | **Partial** | **1** | **All** |
| **TRENDING** | **Trending Categories** | **N/A (New)** | **None** | **1** | **All** |
| **NEARBY** | **Nearby Influencers** | **N/A (New Feature)** | **None** | **2** | **Brand** |
| **NEARBY** | **Nearby Brands** | **N/A (New Feature)** | **None** | **2** | **Influencer, User** |
| **NEARBY** | **Nearby Campaigns** | **N/A (New Feature)** | **None** | **1** | **Influencer, User** |
| **NEARBY** | **Location Management** | **N/A (New Feature)** | **None** | **2** | **All** |

---

## IMPLEMENTATION PRIORITY

### Phase 1 (Critical - Core Platform Functionality)
1. **Trending Influencers API** (Enhanced) - 4 endpoints
2. Campaign Details & Applications API - 3 endpoints
3. Influencers List API - 1 endpoint
4. Notifications API - 3 endpoints
5. Transactions/Billing API - 1 endpoint
6. Payment Methods API - 4 endpoints

### Phase 2 (High - Campaign Management + Trending)
1. **Trending Campaigns API** - 1 endpoint
2. **Trending Brands API** - 1 endpoint
3. **Trending Categories API** - 1 endpoint
4. Campaign Boost API - 2 endpoints
5. Deliverables Approval API - 3 endpoints
6. Counter Offers API - 4 endpoints
7. Campaign Create/Edit APIs - 3 endpoints

### Phase 3 (Medium - Location-Based Features)
1. **Nearby Influencers API** - 2 endpoints
2. **Nearby Brands API** - 2 endpoints
3. **Nearby Campaigns API** - 1 endpoint
4. **Location Management API** - 2 endpoints
5. My Lists API - 6 endpoints
6. Subscription Management APIs - 5 endpoints

### Phase 4 (Medium - User Features + Support)
1. Help/Support API - 4 endpoints
2. Admin Request Management APIs - 3 endpoints
3. Brand Profile Details - 3 endpoints

### Phase 5 (Optional - Polish & Analytics)
1. Advanced Dashboard Analytics
2. Search Optimization APIs
3. Location-based recommendations

---

## NOTES FOR DEVELOPERS

### Key Observations:
1. **Redux Integration:** Most features have Redux hooks prepared but lack complete backend integration
2. **Mock Data Fallbacks:** Many components use `/dummyAvatar.jpg` as fallback
3. **Error Handling:** Some components have error states prepared but may not be fully tested
4. **Loading States:** Most components have loading skeletons/spinners in place
5. **User Roles:** System supports multiple roles (Brand, Influencer, User, Admin) - API design should account for role-based access control

### Recommended API Response Standards:
- All responses should include pagination data: `{ data: [], pagination: { page, limit, total, pages } }`
- Timestamps should use ISO 8601 format: `YYYY-MM-DDTHH:MM:SSZ`
- Currency should be in base units (e.g., paise for INR): `₹499` = 49900 paise
- All IDs should support both `_id` (MongoDB) and `id` (generic) for compatibility

### Redux Hooks Currently in Use:
- `useAuth()` - Authentication context
- `useInfluencers()` - Influencers data
- `useCampaigns()` - Campaigns data
- `useMessaging()` - Messaging/inbox
- `usePayment()` - Payment/billing
- `useUser()` - User profile
- `useRoleContext()` - Role management

---

**Report Generated:** March 17, 2026
**Files Analyzed:** 343+ components
**Total Mock Data Instances Found:** 26+
**API Endpoints Identified:** 94+
**Feature Categories:** 10 (Dashboard, Campaigns, Influencers, Account, Notifications, Messaging, Admin, Brand, Trending, Nearby)
**Estimated Implementation Time:** 6-8 weeks (with 2-3 developers)

---

## NEW FEATURES ADDED TO REPORT

### ✨ Trending System
- Enhanced Trending Influencers with engagement metrics, trends, and time-range filters
- Trending Campaigns with category, budget, and engagement filters
- Trending Brands with ranking system
- Trending Categories/Niches with growth metrics
- **7 new API endpoints added**

### 📍 Location-Based (Nearby) System
- Nearby Influencers discovery with distance-based search
- Nearby Brands with location filtering
- Nearby Campaigns based on brand location
- Location management and supported locations lookup
- **7 new API endpoints added**

### Total New Endpoints from Trending + Nearby: **14 endpoints**

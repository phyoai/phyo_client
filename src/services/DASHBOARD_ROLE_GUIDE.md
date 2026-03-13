# Role-Based Dashboard API Guide

## Overview

The dashboard service (`dashboardService`) provides **role-aware API calls** that return different data based on the user's role (BRAND, INFLUENCER, or USER).

## Installation

The service is already exported from `@/services`:

```typescript
import { dashboardService } from '@/services';
```

## Available Methods

### 1. `getCampaignsByRole(role, params?)`

Returns campaigns based on user role.

**Usage:**
```typescript
const response = await dashboardService.getCampaignsByRole('BRAND', {
  page: 1,
  limit: 20
});
```

**Role-Specific Behavior:**

| Role | API Called | Returns |
|------|-----------|---------|
| **BRAND** | `/campaigns/mine` | Their own campaigns |
| **INFLUENCER** | `/campaigns` | Available campaigns to apply to |
| **USER** | `/campaigns` | Public/trending campaigns |

---

### 2. `getInfluencersByRole(role, params?)`

Returns influencers based on user role.

**Usage:**
```typescript
const response = await dashboardService.getInfluencersByRole('BRAND', {
  page: 1,
  limit: 10
});
```

**Role-Specific Behavior:**

| Role | Returns |
|------|---------|
| **BRAND** | Influencers for collaboration (`GET /influencers`) |
| **INFLUENCER** | Other influencers in network (`GET /influencers`) |
| **USER** | Public influencers list (`GET /influencers`) |

**Note:** All roles currently use the same `/influencers` endpoint. This can be customized per role on the backend.

---

### 3. `getDashboardStats(role)`

Returns dashboard statistics based on user role.

**Usage:**
```typescript
const stats = await dashboardService.getDashboardStats('BRAND');
```

**Role-Specific Endpoints:**

| Role | Endpoint |
|------|----------|
| **BRAND** | `GET /brand/dashboard/stats` |
| **INFLUENCER** | `GET /influencer/dashboard/stats` |
| **USER** | `GET /dashboard/stats` |

---

### 4. `getRecommendations(role, params?)`

Returns recommended content for each role.

**Role-Specific Recommendations:**

| Role | Recommends |
|------|-----------|
| **BRAND** | Influencers based on previous campaigns |
| **INFLUENCER** | Campaigns based on profile |
| **USER** | Brands and influencers |

**Usage:**
```typescript
const recommendations = await dashboardService.getRecommendations('INFLUENCER');
```

---

### 5. `getRecentActivity(role, params?)`

Returns recent activity specific to user role.

**Role-Specific Activity:**

| Role | Returns |
|------|---------|
| **BRAND** | Campaign activity & influencer interactions |
| **INFLUENCER** | Applications & campaign invitations |
| **USER** | Platform activity |

---

### 6. `getNotifications(role, params?)`

Returns notifications filtered by role.

**Usage:**
```typescript
const notifications = await dashboardService.getNotifications('BRAND');
```

---

### 7. `getFeaturedContent(role)`

Returns featured content for each role.

**Role-Specific Featured Content:**

| Role | Featured |
|------|----------|
| **BRAND** | Featured influencers |
| **INFLUENCER** | Featured campaigns |
| **USER** | Featured content |

---

## Integration Examples

### In Components

```typescript
import { dashboardService } from '@/services';
import { useAuth } from '@/app/context/AuthContext';

export default function CampaignSection() {
  const { getUserType } = useAuth();
  const role = getUserType() || 'USER';
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await dashboardService.getCampaignsByRole(role);
        setCampaigns(response.data || []);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchCampaigns();
  }, [role]);

  return (
    // Render campaigns
  );
}
```

### Custom Hooks

```typescript
import { useAuth } from '@/app/context/AuthContext';
import { useApiQuery } from '@/hooks/useApi';
import { dashboardService } from '@/services';

export function useDashboardCampaigns() {
  const { getUserType } = useAuth();
  const role = getUserType() || 'USER';

  return useApiQuery(
    () => dashboardService.getCampaignsByRole(role),
    [role]
  );
}
```

---

## Currently Updated Components

The following dashboard sections use role-based APIs:

- ✅ **CampaignSection** - Uses `getCampaignsByRole()`
- ✅ **InfluencerListSection** - Uses `getInfluencersByRole()`
- ⏳ **TrendingInfluencersSection** - (Next to update)
- ⏳ **ExploreBrandsSection** - (Next to update)

---

## Error Handling

All methods have built-in error handling:

```typescript
try {
  const data = await dashboardService.getCampaignsByRole(role);
} catch (error) {
  console.error('Error:', error);
  // Fall back to empty data
}
```

Some methods return empty arrays instead of throwing errors to prevent dashboard crashes:

- `getRecommendations()` → returns `{ data: [] }`
- `getRecentActivity()` → returns `{ data: [] }`
- `getNotifications()` → returns `{ data: [] }`
- `getFeaturedContent()` → returns `{ data: [] }`

---

## Backend Requirements

For full functionality, your backend should implement these endpoints:

**For BRANDS:**
- `GET /campaigns/mine` - Brand's own campaigns
- `GET /brand/dashboard/stats` - Brand stats
- `GET /brand/recommendations/influencers` - Recommended influencers
- `GET /brand/activity` - Brand activity feed

**For INFLUENCERS:**
- `GET /campaigns` - Available campaigns
- `GET /influencer/dashboard/stats` - Influencer stats
- `GET /influencer/recommendations/campaigns` - Recommended campaigns
- `GET /influencer/activity` - Influencer activity feed

**General:**
- `GET /notifications?type={brand|influencer}` - Role-filtered notifications
- `GET /featured/influencers` - Featured influencers
- `GET /featured/campaigns` - Featured campaigns
- `GET /featured` - Featured content

---

## Best Practices

1. **Always pass the role dynamically** - Don't hardcode roles
2. **Use `getUserType()` from AuthContext** - Ensures consistency
3. **Handle errors gracefully** - Don't let API failures crash the dashboard
4. **Add role to useEffect dependencies** - Refetch when role changes
5. **Use custom hooks** - Create hooks like `useDashboardCampaigns()` for reusability

---

## Future Enhancements

- [ ] Add caching to reduce API calls
- [ ] Add real-time updates via WebSocket
- [ ] Add pagination helpers
- [ ] Add filter/sort parameters
- [ ] Add search functionality per role

---

## Support

For questions or issues, refer to the main API Integration Guide at `API_INTEGRATION_GUIDE.md`

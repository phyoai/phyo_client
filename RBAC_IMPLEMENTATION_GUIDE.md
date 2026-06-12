# RBAC Implementation Guide for Web Frontend

**Status:** Implementation Plan  
**Date:** 2026-06-12  
**Target:** Complete role-based access control across web frontend

---

## 1. CURRENT STATE vs REQUIRED STATE

### ✅ Already Implemented
- **roleConfig.ts** - Basic role configuration with nav items and sidebar paths
- **Auth Storage** - User role stored in localStorage
- **Basic Navigation** - Role-specific nav items based on roleConfig
- **Route Extraction** - Can extract role from URL pathname

### ❌ NOT YET IMPLEMENTED
- **Screen Access Control** - No per-route permission checks
- **Feature Permissions** - No granular feature flags (canCreateCampaigns, etc.)
- **Profile Field Visibility** - No field-level access control
- **Edit Permission Checks** - No field-level editability validation
- **Enforcement Middleware** - No middleware to enforce access on route change
- **Feature Flag UI** - No conditional rendering based on permissions

---

## 2. STEP-BY-STEP IMPLEMENTATION

### PHASE 1: Create RBAC Utility System (1-2 days)

#### Step 1A: Create `src/utils/rbac.ts`
This is the **core** of the RBAC system. It should have:

```typescript
export type UserRole = 'BRAND' | 'INFLUENCER' | 'USER';

// Screen access matrix
const SCREEN_ACCESS_CONTROL = {
  '/user/campaigns': ['USER', 'BRAND', 'INFLUENCER'],
  '/brand/campaigns': ['BRAND'],
  '/user/account': ['USER', 'BRAND', 'INFLUENCER'],
  '/influencer/portfolio': ['INFLUENCER'],
  // ... all protected routes
};

// Feature permissions
export const ROLE_PERMISSIONS = {
  BRAND: {
    canCreateCampaigns: true,
    canViewInfluencers: true,
    canManageApplications: true,
    canAccessAnalytics: true,
    canUpgradePlan: true,
  },
  INFLUENCER: {
    canCreateCampaigns: false,
    canViewInfluencers: false,
    canUploadPortfolio: true,
    canSetRateCard: true,
    canManageApplications: true,
  },
  USER: {
    canCreateCampaigns: false,
    canViewInfluencers: false,
    canUploadPortfolio: false,
    canSetRateCard: false,
    canManageApplications: false,
  },
};

// Core functions
export const hasScreenAccess = (route: string, role: UserRole): boolean => {
  const allowedRoles = SCREEN_ACCESS_CONTROL[route] || [];
  return allowedRoles.includes(role);
};

export const getRolePermissions = (role: UserRole) => {
  return ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.USER;
};

// Profile field visibility
export const getVisibleProfileFields = (role: UserRole) => {
  // Return array of visible fields for the role
};

export const getEditableProfileFields = (role: UserRole) => {
  // Return array of editable fields for the role
};
```

**Location:** `src/utils/rbac.ts`  
**Time:** 2-3 hours  
**Dependencies:** None

---

#### Step 1B: Update `src/config/roleConfig.ts`
Extend existing roleConfig to include feature permissions:

```typescript
export interface RoleConfig {
  // ... existing fields
  permissions: {
    canCreateCampaigns: boolean;
    canViewInfluencers: boolean;
    // ... all features
  };
  visibleProfileFields: string[];
  editableProfileFields: string[];
}

export const ROLE_CONFIG: Record<UserRole, RoleConfig> = {
  // Add permissions, visibleProfileFields, editableProfileFields to each role
};
```

**Time:** 1-2 hours  
**Dependencies:** RBAC documentation

---

### PHASE 2: Create Access Control Middleware (1 day)

#### Step 2A: Create Route Protection Hook
**File:** `src/hooks/useRoleAccess.ts`

```typescript
export const useRoleAccess = () => {
  const { user } = useAuth(); // from authSlice
  const pathname = usePathname();
  
  const hasAccess = hasScreenAccess(pathname, user.role);
  const permissions = getRolePermissions(user.role);
  
  useEffect(() => {
    if (!hasAccess) {
      redirect(getDefaultRouteForRole(user.role));
    }
  }, [pathname]);
  
  return { hasAccess, permissions };
};
```

**Time:** 2 hours  
**Key Points:**
- Check auth before checking role access
- Redirect unauthorized users to default route
- Make it reusable for any component

---

#### Step 2B: Create Layout Wrapper
**File:** `src/components/ProtectedLayout.tsx`

```typescript
export const ProtectedLayout = ({ children }: { children: ReactNode }) => {
  const { hasAccess } = useRoleAccess();
  
  if (!hasAccess) {
    return null; // Will redirect in hook
  }
  
  return <>{children}</>;
};
```

**Time:** 1 hour  
**Usage:** Wrap page content in this layout

---

### PHASE 3: Update Auth Context (1-2 days)

#### Step 3A: Enhance Auth Slice
**File:** `src/store/slices/authSlice.js`

Update to store:
```javascript
{
  user: {
    id: string,
    email: string,
    role: 'BRAND' | 'INFLUENCER' | 'USER',
    permissions: {...}, // from ROLE_PERMISSIONS
    name: string,
    profileFields: {...}, // based on role
  },
  isAuthenticated: boolean,
  isLoading: boolean
}
```

**Time:** 2-3 hours  
**Key Points:**
- Normalize role on login (SERVICE_PROVIDER → USER)
- Store permissions in state for easy access
- Update whenever role changes

---

#### Step 3B: Create useAuth Hook with Permissions
**File:** `src/hooks/useAuth.ts`

```typescript
export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(selectAuth);
  const permissions = getRolePermissions(user?.role);
  
  return {
    user,
    isAuthenticated,
    permissions,
    hasPermission: (permission: string) => permissions[permission] === true
  };
};
```

**Time:** 1-2 hours

---

### PHASE 4: Implement Feature Flags (2-3 days)

#### Step 4A: Identify All Feature-Gated Components
**Task:** Go through codebase and find:
- Create Campaign button
- Portfolio upload section
- Rate card editor
- Applications manager
- Analytics dashboard
- etc.

**Time:** 4-6 hours (exploratory)  
**Deliverable:** List of all feature-gated components

---

#### Step 4B: Wrap Components with Permission Checks

Example pattern:
```typescript
export const CreateCampaignButton = () => {
  const { permissions } = useAuth();
  
  if (!permissions.canCreateCampaigns) {
    return null;
  }
  
  return <button onClick={...}>Create Campaign</button>;
};
```

**Time:** 1-2 days (implementation)  
**Key Points:**
- Don't show disabled buttons, just hide them
- Log access denials for security monitoring
- Test each permission separately

---

### PHASE 5: Implement Profile Field Visibility (1-2 days)

#### Step 5A: Create Field Visibility Hook
**File:** `src/hooks/useProfileFields.ts`

```typescript
export const useProfileFields = (userRole: UserRole) => {
  const visibleFields = getVisibleProfileFields(userRole);
  const editableFields = getEditableProfileFields(userRole);
  const privateFields = getPrivateProfileFields(userRole);
  
  const canEdit = (fieldName: string) => editableFields.includes(fieldName);
  const isVisible = (fieldName: string) => visibleFields.includes(fieldName);
  const isPrivate = (fieldName: string) => privateFields.includes(fieldName);
  
  return { visibleFields, editableFields, canEdit, isVisible, isPrivate };
};
```

**Time:** 2-3 hours

---

#### Step 5B: Update Profile Components

For viewing profiles:
```typescript
export const ProfileView = ({ user }) => {
  const { visibleFields, isPrivate } = useProfileFields(user.role);
  
  return visibleFields.map(field => (
    <div key={field}>
      <label>{field}</label>
      <span>{user[field]}</span>
      {isPrivate(field) && <small>Private</small>}
    </div>
  ));
};
```

For editing profiles:
```typescript
export const ProfileForm = ({ user }) => {
  const { editableFields, canEdit } = useProfileFields(user.role);
  
  return editableFields.map(field => (
    <input
      key={field}
      disabled={!canEdit(field)}
      value={user[field]}
    />
  ));
};
```

**Time:** 1-2 days (for all profile pages)

---

### PHASE 6: Navigation Bar Updates (1 day)

#### Step 6A: Filter Nav Items by Role
**File:** `src/components/NavigationBar.tsx` (update existing)

```typescript
export const NavigationBar = () => {
  const { user } = useAuth();
  const config = getRoleConfig(user.role);
  
  const navItems = config.navItems;
  
  // Filter items based on user role
  // BRAND: [Home, Inbox, Campaigns, Account]
  // INFLUENCER: [Home, Inbox, Portfolio, Account]
  // USER: [Home, Inbox, Account] (no Campaigns)
  
  return (
    <nav>
      {navItems.map(item => (
        <Link key={item.href} href={item.href}>
          {item.name}
        </Link>
      ))}
    </nav>
  );
};
```

**Time:** 2-3 hours  
**Key Change:** The existing roleConfig already has navItems per role - just ensure they're correctly filtered

---

### PHASE 7: Enforcement & Testing (3-5 days)

#### Step 7A: Add Route Enforcement
**File:** `src/middleware/roleEnforcement.ts` (if using middleware) or hooks in layout

```typescript
// In root layout or page.tsx
export default function RootLayout({ children }) {
  const { user } = useAuth();
  const pathname = usePathname();
  
  useEffect(() => {
    if (user && !hasScreenAccess(pathname, user.role)) {
      redirect(getDefaultRouteForRole(user.role));
    }
  }, [user, pathname]);
  
  return children;
}
```

**Time:** 2-3 hours

---

#### Step 7B: Comprehensive Testing
Create test suite:

```typescript
describe('RBAC System', () => {
  describe('Screen Access', () => {
    test('BRAND can access /brand/campaigns', () => {
      expect(hasScreenAccess('/brand/campaigns', 'BRAND')).toBe(true);
    });
    
    test('USER cannot access /brand/campaigns', () => {
      expect(hasScreenAccess('/brand/campaigns', 'USER')).toBe(false);
    });
    // ... 30+ tests
  });
  
  describe('Permissions', () => {
    test('BRAND can create campaigns', () => {
      const perms = getRolePermissions('BRAND');
      expect(perms.canCreateCampaigns).toBe(true);
    });
    // ... 20+ tests
  });
  
  describe('Profile Fields', () => {
    test('INFLUENCER can edit rate card', () => {
      expect(canEditProfileField('INFLUENCER', 'rateCard')).toBe(true);
    });
    // ... 20+ tests
  });
});
```

**Time:** 2-3 days  
**Deliverable:** 70+ test cases

---

## 3. IMPLEMENTATION TIMELINE

```
Week 1:
├─ Phase 1 (RBAC Utilities) - Mon-Tue (4-6 hours)
├─ Phase 2 (Route Protection) - Tue-Wed (4-6 hours)
└─ Phase 3 (Auth Context) - Wed-Thu (4-6 hours)

Week 2:
├─ Phase 4 (Feature Flags) - Mon-Tue (8-12 hours)
└─ Phase 5 (Profile Fields) - Wed-Thu (4-6 hours)

Week 3:
├─ Phase 6 (Navigation) - Mon (2-3 hours)
├─ Phase 7 (Testing) - Tue-Wed (6-8 hours)
└─ Bug Fixes & Polish - Thu-Fri (4-6 hours)

Total: 42-63 hours (1-2 weeks, 1 developer)
```

---

## 4. CRITICAL FILES TO UPDATE

### Priority 1 (Core RBAC):
- [ ] Create `src/utils/rbac.ts` - **NEW**
- [ ] Update `src/config/roleConfig.ts`
- [ ] Update `src/store/slices/authSlice.js`
- [ ] Create `src/hooks/useRoleAccess.ts` - **NEW**
- [ ] Create `src/hooks/useProfileFields.ts` - **NEW**

### Priority 2 (Integration):
- [ ] Update all profile pages (user, brand, influencer)
- [ ] Update all dashboard pages
- [ ] Update components with feature gates
- [ ] Update navigation bar

### Priority 3 (Testing & Polish):
- [ ] Create tests for RBAC system
- [ ] Test all role combinations
- [ ] Security audit of permissions

---

## 5. KEY DECISIONS TO MAKE

### 1. Role Naming
- Use: `BRAND`, `INFLUENCER`, `USER` (uppercase, from docs)
- Normalize: `service-provider` → `USER`

### 2. Where to Enforce Access
- **Option A:** In app root layout (enforce on every route change)
- **Option B:** Per-page via component hooks (more granular)
- **Recommended:** Root layout + per-component permissions

### 3. Feature Flag Implementation
- **Option A:** Hide buttons (current approach)
- **Option B:** Show disabled buttons with "No permission" tooltip
- **Option C:** Show modal asking to upgrade plan
- **Recommended:** Hide buttons, with optional tooltip on hover

### 4. Backward Compatibility
- Service Provider role? Map to USER
- Legacy roles in DB? Normalize on login
- Timestamp? When role is set

---

## 6. NEXT STEPS

1. **Review & Approve** this implementation plan with team
2. **Create RBAC utils file** (`src/utils/rbac.ts`)
3. **Define all screen access rules** in SCREEN_ACCESS_CONTROL
4. **Define all feature permissions** in ROLE_PERMISSIONS
5. **Define all profile fields** per role
6. **Implement enforcement** in root layout
7. **Wrap components** with permission checks
8. **Test thoroughly** with all role combinations

---

## 7. TESTING CHECKLIST

**For BRAND Role:**
- [ ] Can access `/brand/campaigns`
- [ ] Cannot access `/influencer/portfolio`
- [ ] Can see "Create Campaign" button
- [ ] Can see influencer list
- [ ] Can manage applications
- [ ] Default route is `/brand/dashboard`

**For INFLUENCER Role:**
- [ ] Can access `/influencer/portfolio`
- [ ] Cannot access `/brand/campaigns` (create)
- [ ] Can upload portfolio
- [ ] Can set rate card
- [ ] Cannot see influencer list
- [ ] Default route is `/influencer/dashboard`

**For USER Role:**
- [ ] Can access `/user/dashboard`
- [ ] Cannot access campaign creation
- [ ] Cannot access portfolio upload
- [ ] Can view campaigns (read-only)
- [ ] Can view influencers (read-only)
- [ ] Campaigns nav item filtered out

---

## 8. API INTEGRATION NOTES

Backend should also validate:
```typescript
// Every protected endpoint should verify:
1. User is authenticated (token valid)
2. User role is in allowed roles
3. Specific feature permission is enabled
4. Resource belongs to user (if applicable)

Example:
POST /api/campaigns
Required: canCreateCampaigns = true
```

---

**This plan provides a complete, step-by-step roadmap for implementing full RBAC across your web frontend. Start with Phase 1 and work sequentially.**

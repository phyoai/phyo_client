# RBAC Quick Start — Task Breakdown

**Document:** Implementation Roadmap  
**For:** Web Frontend RBAC System  
**Total Effort:** 42-63 hours (~2 weeks, 1 developer)

---

## 📊 Task Breakdown by Phase

### PHASE 1: Core RBAC System (4-6 hours)
**Goal:** Create utility functions and basic infrastructure

```
Task 1.1 — Create src/utils/rbac.ts
├─ Define UserRole type ('BRAND', 'INFLUENCER', 'USER')
├─ Build SCREEN_ACCESS_CONTROL matrix for all routes
├─ Build ROLE_PERMISSIONS object with all features
├─ Export functions: hasScreenAccess(), getRolePermissions()
└─ Time: 2-3 hours

Task 1.2 — Update src/config/roleConfig.ts
├─ Add permissions object to RoleConfig interface
├─ Add visibleProfileFields array to each role
├─ Add editableProfileFields array to each role
└─ Time: 1-2 hours

Task 1.3 — Create useAuth Hook (src/hooks/useAuth.ts)
├─ Export user, isAuthenticated, permissions
├─ Add hasPermission(name) method
└─ Time: 1 hour
```

**Deliverables:**
- ✅ Core RBAC utility file
- ✅ Enhanced roleConfig with permissions
- ✅ useAuth hook for components

---

### PHASE 2: Route Protection (4-6 hours)
**Goal:** Enforce access control on navigation

```
Task 2.1 — Create src/hooks/useRoleAccess.ts
├─ Check hasScreenAccess() for current pathname
├─ Redirect to default route if denied
├─ Return hasAccess + permissions
└─ Time: 2 hours

Task 2.2 — Create src/components/ProtectedLayout.tsx
├─ Wrap page children
├─ Use useRoleAccess hook
└─ Time: 1 hour

Task 2.3 — Add enforcement in app layout
├─ Add useRoleAccess to root layout
├─ Verify user has access on every route change
└─ Time: 2 hours
```

**Deliverables:**
- ✅ Route enforcement system
- ✅ Protected layout wrapper
- ✅ Automatic redirects for unauthorized access

---

### PHASE 3: Auth Context Enhancement (4-6 hours)
**Goal:** Store and manage role/permissions in state

```
Task 3.1 — Update src/store/slices/authSlice.js
├─ Add permissions to user object
├─ Add profileFields to user object
├─ Normalize incoming role (SERVICE_PROVIDER → USER)
├─ Calculate permissions on login
└─ Time: 2-3 hours

Task 3.2 — Create useAuth hook with permissions
├─ Return user object
├─ Return permissions object
├─ Export hasPermission(featureName) helper
└─ Time: 1-2 hours
```

**Deliverables:**
- ✅ Auth slice with permissions
- ✅ useAuth hook for easy access
- ✅ Automatic permission calculation

---

### PHASE 4: Feature Gates (8-12 hours)
**Goal:** Control UI visibility based on permissions

```
Task 4.1 — Identify all feature-gated components
├─ Search for: "Create Campaign" buttons
├─ Search for: Portfolio upload sections
├─ Search for: Rate card editors
├─ Search for: Analytics dashboards
├─ Search for: Settings/Admin panels
└─ Time: 2-3 hours (exploratory)

Task 4.2 — Wrap components with permission checks
├─ UpdateCreateCampaignButton (hide if !canCreateCampaigns)
├─ Update PortfolioUploadSection (hide if !canUploadPortfolio)
├─ Update RateCardEditor (hide if !canSetRateCard)
├─ Update AnalyticsDashboard (hide if !canAccessAnalytics)
├─ Update ApplicationsManager (conditional features)
├─ Update SettingsPanel (hide if !canAccessSettings)
└─ Time: 6-9 hours (implementation)

Pattern:
const MyComponent = () => {
  const { permissions } = useAuth();
  if (!permissions.canCreateCampaigns) return null;
  return <button>Create</button>;
};
```

**Deliverables:**
- ✅ List of all feature-gated components
- ✅ Permission checks in all components
- ✅ Proper hiding of unauthorized features

---

### PHASE 5: Profile Field Visibility (4-6 hours)
**Goal:** Control which profile fields users can see/edit

```
Task 5.1 — Create src/hooks/useProfileFields.ts
├─ Implement getVisibleProfileFields(role)
├─ Implement getEditableProfileFields(role)
├─ Implement getPrivateProfileFields(role)
└─ Time: 2-3 hours

Task 5.2 — Update profile pages
├─ Update /brand/account pages
├─ Update /influencer/account pages
├─ Update /user/account pages
├─ Hide non-visible fields
├─ Disable non-editable fields
└─ Time: 2-3 hours

Pattern:
const ProfileForm = ({ user, role }) => {
  const { editableFields, canEdit } = useProfileFields(role);
  return editableFields.map(field => (
    <input
      disabled={!canEdit(field)}
      value={user[field]}
    />
  ));
};
```

**Deliverables:**
- ✅ useProfileFields hook
- ✅ Field visibility rules per role
- ✅ Updated profile pages with access control

---

### PHASE 6: Navigation Updates (2-3 hours)
**Goal:** Filter nav items per role

```
Task 6.1 — Update navigation bar
├─ Use getRoleConfig(user.role) to get nav items
├─ Filter items based on role
├─ BRAND: [Home, Inbox, Campaigns, Account]
├─ INFLUENCER: [Home, Inbox, Portfolio, Account]
├─ USER: [Home, Inbox, Account] (no Campaigns)
└─ Time: 2-3 hours
```

**Deliverables:**
- ✅ Role-aware navigation bar
- ✅ Correct nav items per role

---

### PHASE 7: Testing (6-8 hours)
**Goal:** Comprehensive testing of RBAC system

```
Task 7.1 — Unit tests (3-4 hours)
├─ Test hasScreenAccess() for all role/route combos
├─ Test getRolePermissions() for all roles
├─ Test canEdit() for profile fields
├─ Create ~30-50 test cases
└─ File: src/__tests__/rbac.test.ts

Task 7.2 — Integration tests (2-3 hours)
├─ Test route enforcement
├─ Test permission checking in components
├─ Test profile field visibility
├─ Create ~20-30 test cases
└─ File: src/__tests__/rbac.integration.test.ts

Task 7.3 — Manual testing (1 hour)
├─ Test as BRAND user
├─ Test as INFLUENCER user
├─ Test as USER
├─ Verify all features work per role
```

**Deliverables:**
- ✅ 70+ test cases
- ✅ Full RBAC coverage
- ✅ All roles tested end-to-end

---

## 🎯 Implementation Order

```
Week 1:
Day 1:  Phase 1 (RBAC utilities)        [4-6 hrs]
Day 2:  Phase 2 (Route protection)      [4-6 hrs]
Day 3:  Phase 3 (Auth context)          [4-6 hrs]

Week 2:
Day 1:  Phase 4 (Feature gates)         [8-12 hrs]
Day 2:  Phase 5 (Profile fields)        [4-6 hrs]
Day 3:  Phase 6 (Navigation)            [2-3 hrs]

Week 3:
Day 1:  Phase 7 (Testing)               [6-8 hrs]
Day 2:  Bug fixes & polish              [2-3 hrs]
```

---

## 📋 Critical Decisions

**Decision 1: Where to Enforce Access?**
- Root layout (enforce every route change) ✅ RECOMMENDED
- Per-page components (more granular)
- Both (belt + suspenders)

**Decision 2: How to Handle Denied Features?**
- Hide buttons completely ✅ RECOMMENDED
- Show disabled buttons
- Show modal dialog

**Decision 3: Backward Compatibility?**
- Map service-provider → USER
- Normalize on login
- Update DB migration

---

## 🚀 Getting Started

1. **Review this guide** — understand the 7 phases
2. **Approve decisions** — confirm enforcement approach
3. **Create Phase 1 files** — start with RBAC utilities
4. **Build incrementally** — complete each phase before next
5. **Test continuously** — verify after each phase

---

## 📊 Success Metrics

**Phase 1 Complete When:**
- [ ] `src/utils/rbac.ts` created with all matrices
- [ ] `roleConfig.ts` has permissions + fields
- [ ] `useAuth` hook works

**Phase 2 Complete When:**
- [ ] `useRoleAccess.ts` created and tested
- [ ] Route enforcement works
- [ ] Unauthorized redirects work

**Phase 3 Complete When:**
- [ ] Auth slice stores permissions
- [ ] useAuth returns permissions
- [ ] hasPermission() method works

**Phase 4 Complete When:**
- [ ] All feature gates identified
- [ ] All features wrapped with permission checks
- [ ] Unauthorized features hidden

**Phase 5 Complete When:**
- [ ] useProfileFields hook created
- [ ] Profile pages respect visibility rules
- [ ] Profile pages respect edit permissions

**Phase 6 Complete When:**
- [ ] Nav bar filters items per role
- [ ] Correct items show for each role

**Phase 7 Complete When:**
- [ ] 70+ test cases created
- [ ] All tests passing
- [ ] Manual testing complete

---

## 📁 Files to Create/Update

### NEW FILES (to create):
```
src/utils/rbac.ts                    # Core RBAC logic
src/hooks/useAuth.ts                 # Auth + permissions hook
src/hooks/useRoleAccess.ts           # Route protection hook
src/hooks/useProfileFields.ts        # Profile field visibility
src/components/ProtectedLayout.tsx   # Protected page wrapper
src/__tests__/rbac.test.ts           # Unit tests
src/__tests__/rbac.integration.test.ts # Integration tests
```

### EXISTING FILES (to update):
```
src/config/roleConfig.ts             # Add permissions + fields
src/store/slices/authSlice.js        # Store permissions
src/components/NavigationBar.tsx     # Filter nav items
src/app/**/page.jsx (all)            # Add permission checks
src/app/**/account/page.jsx (all)    # Profile field control
```

---

## 💾 This Roadmap Covers

✅ Screen access control per role  
✅ Feature permissions per role  
✅ Profile field visibility per role  
✅ Edit permission enforcement  
✅ Route protection with redirects  
✅ Feature gate UI updates  
✅ Comprehensive testing  
✅ Navigation bar filtering  

---

## 🔄 Next Step

**Run the following command to confirm you're ready:**
```bash
git status    # Ensure working directory clean
npm run dev   # Start dev server
npm test      # Run existing tests
```

**Then start Phase 1:**
1. Create `src/utils/rbac.ts`
2. Define SCREEN_ACCESS_CONTROL matrix
3. Define ROLE_PERMISSIONS object
4. Export core functions

Ready to begin implementation? 🚀

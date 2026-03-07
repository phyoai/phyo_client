# Design System Migration Guide

Complete guide for migrating your Phyo AI project to use standardized Button and Card components from the Ember Design System.

## Overview

| Component | Status | Files Affected | Priority |
|-----------|--------|-----------------|----------|
| **Button** | ✅ Created | 144 files (1,129 instances) | CRITICAL |
| **IconButton** | ✅ Created | 50+ files | HIGH |
| **Card** | ✅ Created | 80+ files | HIGH |
| **AppBar** | ✅ Integrated | Account pages | DONE |

---

## 1. Button Migration

### Problem
- 96.7% of buttons use hardcoded inline styles
- Inconsistent colors (green-700, green-800, teal-600, blue-600)
- No reusable component system

### Solution
Replace hardcoded buttons with the `Button` and `IconButton` components.

### Before & After Examples

#### Primary Button
```jsx
// ❌ BEFORE
<button className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg font-semibold">
  Submit Campaign
</button>

// ✅ AFTER
<Button variant="primary" size="lg">
  Submit Campaign
</Button>
```

#### Secondary Button
```jsx
// ❌ BEFORE
<button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
  Cancel
</button>

// ✅ AFTER
<Button variant="secondary" size="md">
  Cancel
</Button>
```

#### Icon Button
```jsx
// ❌ BEFORE
<button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
  <ArrowLeftLine className="w-6 h-6" />
</button>

// ✅ AFTER
<IconButton
  icon={ArrowLeftLine}
  size="md"
  onClick={() => router.back()}
/>
```

#### Outlined Button
```jsx
// ❌ BEFORE
<button className="border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
  Secondary Action
</button>

// ✅ AFTER
<Button variant="outlined" size="md">
  Secondary Action
</Button>
```

#### Button with Icon
```jsx
// ❌ BEFORE
<button className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg flex items-center gap-2">
  <PlusLine width={18} />
  Create Campaign
</button>

// ✅ AFTER
<Button variant="primary" size="md" icon={PlusLine}>
  Create Campaign
</Button>
```

### Button Props Reference

```jsx
<Button
  variant="primary"        // 'primary' | 'secondary' | 'tertiary' | 'outlined'
  size="md"               // 'sm' | 'md' | 'lg'
  disabled={false}        // boolean
  loading={false}         // boolean - shows spinner
  fullWidth={false}       // boolean
  icon={IconComponent}    // Icon from phyo-icon-library
  iconPosition="left"     // 'left' | 'right'
  onClick={handleClick}   // function
/>
```

### High-Priority Files for Button Migration

#### Critical (Most Buttons)
1. `src/app/brand/campaigns/AllCampaignsSection.jsx` - 50+ buttons
2. `src/app/user/campaigns/AllCampaignsSection.jsx` - 50+ buttons
3. `src/app/influencer/campaigns/AllCampaignsSection.jsx` - 50+ buttons
4. `src/app/admin/dashboard/page.jsx` - 30+ buttons

#### High Priority
- All account sub-pages (upgrade-plan, help-support, billing-history, notifications-preferences)
- Campaign detail pages ([id]/page.jsx)
- Dashboard pages
- Create campaign forms
- Modal footers

---

## 2. Card Migration

### Problem
- Card layouts built with custom div structures
- No consistent spacing or styling
- Image handling varies across files
- Mixed badge and metadata implementations

### Solution
Use the `Card` component with sub-components for consistent structure.

### Before & After Examples

#### Basic Card
```jsx
// ❌ BEFORE
<div className="bg-white rounded-lg shadow-md p-6">
  <h3 className="text-lg font-bold mb-2">Title</h3>
  <p className="text-gray-600 mb-4">Description</p>
  <button className="bg-green-700 text-white px-4 py-2 rounded">
    Action
  </button>
</div>

// ✅ AFTER
<Card>
  <Card.Title>Title</Card.Title>
  <Card.Description>Description</Card.Description>
  <Card.Footer>
    <Button variant="primary">Action</Button>
  </Card.Footer>
</Card>
```

#### Card with Image
```jsx
// ❌ BEFORE
<div className="bg-white rounded-lg shadow">
  <img src="/image.jpg" className="w-full h-48 object-cover rounded-t" />
  <div className="p-6">
    <h3 className="text-lg font-bold">Title</h3>
    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
      Active
    </span>
    <p className="text-gray-600">Description</p>
    <button className="bg-green-700 text-white px-4 py-2 rounded">
      View
    </button>
  </div>
</div>

// ✅ AFTER
<Card>
  <Card.Header image="/image.jpg" />
  <Card.Title>Title</Card.Title>
  <Card.Badge variant="success" size="sm">Active</Card.Badge>
  <Card.Description>Description</Card.Description>
  <Card.Footer>
    <Button variant="primary" size="md">View</Button>
  </Card.Footer>
</Card>
```

#### Influencer/Campaign Card
```jsx
// ❌ BEFORE
<div className="bg-white rounded-lg p-6 shadow-md">
  <div className="flex items-center gap-4 mb-4">
    <div className="w-12 h-12 bg-green-700 rounded-full text-white flex items-center justify-center">
      JA
    </div>
    <div>
      <h3 className="font-bold">Jessica Anderson</h3>
      <p className="text-gray-500 text-sm">@jessica_anderson</p>
    </div>
  </div>
  <div className="space-y-2 mb-4">
    <div className="flex justify-between">
      <span className="text-gray-500">Followers</span>
      <span className="font-bold">125K</span>
    </div>
    <div className="flex justify-between">
      <span className="text-gray-500">Engagement</span>
      <span className="font-bold">4.2%</span>
    </div>
  </div>
  <p className="text-gray-600 text-sm mb-4">Lifestyle influencer</p>
  <div className="flex gap-2">
    <button className="flex-1 border border-gray-300 px-4 py-2 rounded">
      Profile
    </button>
    <button className="flex-1 bg-green-700 text-white px-4 py-2 rounded">
      Follow
    </button>
  </div>
</div>

// ✅ AFTER
<Card variant="elevated">
  <div className="flex items-center gap-4 mb-4">
    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: '#43573B' }}>
      JA
    </div>
    <div>
      <Card.Title size="sm">Jessica Anderson</Card.Title>
      <p className="text-xs" style={{ color: '#999999' }}>
        @jessica_anderson
      </p>
    </div>
  </div>
  <Card.Meta label="Followers" value="125K" />
  <Card.Meta label="Engagement" value="4.2%" />
  <Card.Description>Lifestyle influencer</Card.Description>
  <Card.Footer>
    <Button variant="secondary" size="sm">Profile</Button>
    <Button variant="primary" size="sm">Follow</Button>
  </Card.Footer>
</Card>
```

### Card Props Reference

```jsx
<Card
  variant="default"      // 'default' | 'elevated' | 'outlined'
  padding="p-6"         // Tailwind padding classes
  className=""          // Additional CSS
>
  <Card.Header
    image="/path.jpg"   // Image URL
    imageAlt="alt text"
    height="h-48"       // Image height
  />

  <Card.Title
    level="h3"         // h1-h6
    size="md"          // 'sm' | 'md' | 'lg'
  >
    Title
  </Card.Title>

  <Card.Badge
    variant="success"  // 'default'|'success'|'danger'|'warning'|'info'
    size="sm"         // 'sm' | 'md'
  >
    Active
  </Card.Badge>

  <Card.Description>
    Supporting text
  </Card.Description>

  <Card.Meta
    label="Followers"
    value="125K"
    icon={IconComponent}
  />

  <Card.Footer>
    {/* Buttons and actions */}
  </Card.Footer>
</Card>
```

### High-Priority Files for Card Migration

#### Critical
1. `src/app/brand/campaigns/AllCampaignsSection.jsx` - Campaign cards
2. `src/app/user/campaigns/AllCampaignsSection.jsx` - Campaign cards
3. `src/app/influencer/campaigns/AllCampaignsSection.jsx` - Campaign cards
4. Dashboard pages - Metric/stats cards

#### High Priority
- Influencer profile cards
- Campaign detail cards
- Product/offer cards
- Feed/list components with cards

---

## 3. Migration Checklist

### Phase 1: Core Components (Week 1)
- [x] Create Button component
- [x] Create IconButton component
- [x] Create Card component
- [ ] Create examples for each component
- [ ] Update component documentation

### Phase 2: Critical Files (Week 2)
- [ ] `AllCampaignsSection.jsx` (all 3 roles) - Replace 150+ buttons, 30+ cards
- [ ] Admin dashboard - Replace 50+ buttons, 20+ cards
- [ ] Campaign detail pages - Replace 40+ buttons, 15+ cards
- [ ] Forms - Replace 30+ buttons, 10+ cards

### Phase 3: High Priority (Week 3)
- [ ] Account pages - Replace 80+ buttons, 10+ cards
- [ ] Dashboard pages - Replace 100+ buttons, 30+ cards
- [ ] Modals/Dialogs - Replace 60+ buttons
- [ ] Footer sections - Replace 20+ buttons

### Phase 4: Remaining (Week 4)
- [ ] All other pages
- [ ] Test all components
- [ ] Verify dark mode support
- [ ] Update design system documentation

---

## 4. Common Migration Patterns

### Pattern 1: Primary Action
```jsx
// Replace all green action buttons with:
<Button variant="primary" size="lg">Action</Button>
```

### Pattern 2: Secondary Action
```jsx
// Replace all gray buttons with:
<Button variant="secondary" size="md">Cancel</Button>
```

### Pattern 3: Danger Action
```jsx
// Replace delete/cancel buttons with:
<Button variant="tertiary" size="md" icon={DeleteBinLine}>
  Delete
</Button>
```

### Pattern 4: Icon-Only (Back/Menu)
```jsx
// Replace all icon-only buttons with:
<IconButton icon={ArrowLeftLine} size="md" />
```

### Pattern 5: Card Grid Layout
```jsx
// Replace custom grid cards with:
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => (
    <Card key={item.id}>
      {/* Card content */}
    </Card>
  ))}
</div>
```

---

## 5. Testing Checklist

After migrating components, verify:

- [ ] Light mode appearance
- [ ] Dark mode appearance (CSS variables)
- [ ] Hover states
- [ ] Disabled states
- [ ] Loading states (buttons with `loading` prop)
- [ ] Icon rendering
- [ ] Responsive layout
- [ ] Touch targets (buttons should be 44px minimum)
- [ ] Accessibility (keyboard navigation, ARIA labels)
- [ ] Performance (no unnecessary re-renders)

---

## 6. Implementation Strategy

### Recommended Approach
1. **Start with high-usage files** (AllCampaignsSection.jsx across all roles)
2. **Test thoroughly** before moving to next file
3. **Use find & replace** for common patterns
4. **Verify in both light and dark modes**
5. **Update any component-specific styling**

### Quick Start Template

```jsx
import Button from '@/components/Button';
import IconButton from '@/components/IconButton';
import Card from '@/components/Card';
import {
  ArrowLeftLine,
  PlusLine,
  DeleteBinLine
} from '@phyoofficial/phyo-icon-library';

export default function MyComponent() {
  return (
    <div className="grid gap-6">
      {/* Card Example */}
      <Card>
        <Card.Header image="/image.jpg" />
        <Card.Title>Title</Card.Title>
        <Card.Description>Description</Card.Description>
        <Card.Meta label="Label" value="Value" />
        <Card.Footer>
          <Button variant="secondary">Cancel</Button>
          <Button variant="primary">Submit</Button>
        </Card.Footer>
      </Card>

      {/* Icon Button Example */}
      <IconButton icon={ArrowLeftLine} onClick={() => router.back()} />

      {/* Button Examples */}
      <Button variant="primary" size="lg" fullWidth>
        Primary Action
      </Button>
    </div>
  );
}
```

---

## 7. Color Reference

All buttons and cards automatically use the color system from `colors.js`:

- **Primary**: `colors.brand.base` (#43573B → dark mode: #5A7250)
- **Secondary**: `colors.neutral.muted` (#E8E8E8 → dark mode: #2C2C2C)
- **Tertiary**: `colors.accent.base` (#D9E3CC → dark mode: #2C3E27)
- **Text**: `colors.text.neutral.base` (#242527 → dark mode: #E5E7EB)

---

## 8. Support & Questions

For detailed usage, see:
- `src/components/ButtonExamples.jsx`
- `src/components/CardExamples.jsx`
- Component prop references above

For issues with dark mode or colors, check `src/config/colors.js`

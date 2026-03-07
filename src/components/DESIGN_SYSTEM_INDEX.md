# Phyo AI - Ember Design System Implementation

Complete design system component library for consistent UI across all pages.

## 🎯 Components Created

### 1. **Button Component** ✅
**File**: `src/components/Button.jsx`

Versatile button component with multiple variants and sizes.

**Variants**: primary, secondary, tertiary, outlined
**Sizes**: sm, md, lg
**Features**: Icons, loading state, disabled state, full-width

```jsx
import Button from '@/components/Button';

<Button variant="primary" size="lg">Submit</Button>
<Button variant="secondary" size="md" disabled>Cancel</Button>
<Button variant="primary" icon={PlusLine}>Create</Button>
<Button loading>Processing...</Button>
```

---

### 2. **IconButton Component** ✅
**File**: `src/components/IconButton.jsx`

Icon-only button for back navigation, menu, actions.

**Variants**: default, filled, outlined
**Sizes**: sm, md, lg

```jsx
import IconButton from '@/components/IconButton';

<IconButton icon={ArrowLeftLine} onClick={() => router.back()} />
<IconButton icon={PlusLine} variant="filled" size="lg" />
<IconButton icon={DeleteBinLine} variant="outlined" />
```

---

### 3. **Card Component** ✅
**File**: `src/components/Card.jsx`

Flexible card with sub-components for consistent layout structure.

**Variants**: default, elevated, outlined
**Sub-components**: Header, Title, Description, Badge, Meta, Footer

```jsx
import Card from '@/components/Card';
import Button from '@/components/Button';

<Card variant="elevated">
  <Card.Header image="/campaign.jpg" />
  <Card.Title>Campaign Title</Card.Title>
  <Card.Badge variant="success">Active</Card.Badge>
  <Card.Meta label="Budget" value="₹50,000" />
  <Card.Description>Campaign description</Card.Description>
  <Card.Footer>
    <Button variant="secondary">Cancel</Button>
    <Button variant="primary">Apply</Button>
  </Card.Footer>
</Card>
```

---

### 4. **AppBar Component** ✅
**File**: `src/components/AppBar.jsx`

Navigation header with back button, title, search, notifications, and menu.

**Features**:
- Back navigation
- Title & supporting text
- Search functionality with toggle
- Notification bell with badge count
- Menu button
- Dark/Light mode support via CSS variables

```jsx
import AppBar from '@/components/AppBar';

<AppBar
  title="Campaign Details"
  onBack={() => router.back()}
  variant="search"
  searchValue={search}
  onSearchChange={setSearch}
  onSearch={handleSearch}
  showNotification={true}
  notificationCount={3}
  showMenu={true}
  onMenuClick={() => setShowMenu(!showMenu)}
/>
```

**Integrated in**: Account pages, Account sub-pages, Ready for integration in other sections

---

### 5. **FABButton Component** ✅
**File**: `src/components/FABButton.jsx`

Floating Action Button for primary actions (create, add).

```jsx
import FABButton from '@/components/FABButton';

<FABButton
  icon={PlusLine}
  onClick={handleCreate}
  isEnabled={canCreate}
/>
```

---

## 📁 Files for Integration

### Example/Documentation Files
- `src/components/ButtonExamples.jsx` - Button usage examples
- `src/components/CardExamples.jsx` - Card usage examples
- `src/components/AppBarExamples.jsx` - AppBar usage examples
- `src/components/DESIGN_SYSTEM_MIGRATION_GUIDE.md` - Complete migration strategy

---

## 📊 Current Integration Status

| Component | Status | Where Used | Migration |
|-----------|--------|-----------|-----------|
| **Button** | ✅ Created | Needs integration | 1,129 instances to migrate |
| **IconButton** | ✅ Created | Needs integration | ~200 instances to migrate |
| **Card** | ✅ Created | Needs integration | ~80+ card layouts |
| **AppBar** | ✅ Integrated | Account pages | COMPLETE |
| **FABButton** | ✅ Integrated | Sidebar | COMPLETE |

---

## 🎨 Design System Features

### Color System
All components automatically support **light and dark modes** via CSS variables:

**Light Mode Colors:**
- Primary: #43573B (brand green)
- Secondary: #E8E8E8 (neutral)
- Accent: #D9E3CC (light green)
- Text: #242527 (dark)

**Dark Mode Colors:**
- Primary: #5A7250 (lighter green)
- Secondary: #2C2C2C (dark neutral)
- Accent: #2C3E27 (dark green)
- Text: #E5E7EB (light)

### Typography Sizes
**Buttons**: sm (xs), md (sm), lg (base)
**Cards**: sm, md, lg titles
**AppBar**: Large title with optional supporting text

### Spacing System
**Padding**: 4px, 6px, 8px, 12px, 16px, 24px, 32px
**Gap**: 4px, 6px, 8px, 12px, 16px, 24px
**Border Radius**: 4px (sm), 8px (md), 12px (lg), 100% (full)

---

## 🚀 Migration Roadmap

### Phase 1: Foundation (COMPLETE) ✅
- [x] Create Button component
- [x] Create IconButton component
- [x] Create Card component
- [x] Create documentation
- [x] Integrate AppBar in account pages

### Phase 2: Critical Files (READY)
- [ ] AllCampaignsSection.jsx (all 3 roles) - 150+ buttons
- [ ] Admin dashboard
- [ ] Campaign detail pages
- [ ] Campaign cards (30+ instances)

### Phase 3: High Priority (READY)
- [ ] Account/Settings pages
- [ ] Dashboard pages
- [ ] Forms and modals
- [ ] Campaign list cards

### Phase 4: Remaining (READY)
- [ ] All other pages
- [ ] Testing & verification
- [ ] Documentation update

---

## 📚 Quick Reference

### Button Variants
```jsx
// Primary - For main actions
<Button variant="primary">Submit</Button>

// Secondary - For cancel/back
<Button variant="secondary">Cancel</Button>

// Tertiary - For danger/destructive
<Button variant="tertiary">Delete</Button>

// Outlined - For secondary emphasis
<Button variant="outlined">Browse</Button>
```

### Button Sizes
```jsx
<Button size="sm">Small</Button>      {/* 32px height */}
<Button size="md">Medium</Button>    {/* 40px height */}
<Button size="lg">Large</Button>     {/* 48px height */}
```

### Card Variants
```jsx
// Default - Basic card with shadow
<Card variant="default">...</Card>

// Elevated - More prominent shadow
<Card variant="elevated">...</Card>

// Outlined - Border instead of shadow
<Card variant="outlined">...</Card>
```

### IconButton Sizes
```jsx
<IconButton size="sm" />   {/* 32px */}
<IconButton size="md" />   {/* 40px */}
<IconButton size="lg" />   {/* 48px */}
```

---

## 🔗 Import Statements

```jsx
// Buttons
import Button from '@/components/Button';
import IconButton from '@/components/IconButton';
import FABButton from '@/components/FABButton';

// Cards
import Card from '@/components/Card';

// Navigation
import AppBar from '@/components/AppBar';

// Icons
import {
  ArrowLeftLine,
  PlusLine,
  DeleteBinLine,
  SearchLine,
  MoreLine,
  // ... other icons from phyo-icon-library
} from '@phyoofficial/phyo-icon-library';

// Colors
import { colors } from '@/config/colors';
```

---

## ✨ Accessibility Features

All components include:
- ✅ Semantic HTML elements
- ✅ Proper ARIA labels on icons
- ✅ Keyboard navigation support
- ✅ Disabled state handling
- ✅ Loading state feedback
- ✅ Touch-friendly sizes (44px minimum)
- ✅ Focus states for keyboard users

---

## 🔧 Customization

### Custom Colors
```jsx
// Use inline style for custom colors
<Button style={{ backgroundColor: '#custom-color' }}>
  Custom Button
</Button>

// Or use colors object
<Button style={{ backgroundColor: colors.brand.base }}>
  Branded Button
</Button>
```

### Custom Classes
```jsx
// Add additional Tailwind classes
<Button className="shadow-lg rounded-full">
  Custom Styled Button
</Button>

<Card className="bg-gradient-to-r from-blue-50 to-green-50">
  Custom Card
</Card>
```

---

## 🎓 Learning Resources

1. **See examples**:
   - View `src/components/ButtonExamples.jsx`
   - View `src/components/CardExamples.jsx`
   - View `src/components/AppBarExamples.jsx`

2. **Understand migration**:
   - Read `src/components/DESIGN_SYSTEM_MIGRATION_GUIDE.md`

3. **Check color system**:
   - View `src/config/colors.js`

4. **Dark mode CSS variables**:
   - View `src/app/globals.css`

---

## 📋 Next Steps

1. **Start migration** with ButtonExamples to verify setup
2. **Update critical files** (AllCampaignsSection.jsx)
3. **Test in light and dark modes**
4. **Verify responsive behavior**
5. **Update component documentation**

---

## 💡 Tips

- **Always import colors from `@/config/colors`** - ensures dark mode support
- **Use variant props** instead of custom classes
- **Leverage Icon components** from phyo-icon-library for consistency
- **Test dark mode** using `useTheme().toggleDarkMode()`
- **Check accessibility** with keyboard-only navigation

---

## 📞 Support

For questions or issues:
1. Check component examples
2. Review migration guide
3. Check colors.js for available color tokens
4. Review existing integrated components (AppBar, FABButton)

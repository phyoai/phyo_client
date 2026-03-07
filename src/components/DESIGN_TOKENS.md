# Ember Design System - Complete Tokens Reference

Comprehensive design token library for consistent styling across the Phyo AI application.

## 📚 Token Categories

### 1. **Colors** (`src/config/colors.js`)
✅ Light & Dark mode CSS variables
✅ Brand, Neutral, Semantic, Accent colors
✅ Text, Surface, UI color scales

```js
import { colors } from '@/config/colors';

// Usage
<button style={{ backgroundColor: colors.brand.base }}>
  Submit
</button>
```

### 2. **Typography** (`src/components/Typography.jsx`)
✅ Heading component (h1-h6)
✅ Paragraph component
✅ Caption & Label components
✅ Quote component
✅ 11 preset sizes (display, heading, body, caption)

```jsx
import { Heading, Paragraph, Caption } from '@/components/Typography';

<Heading level={1} size="xl" weight="bold">
  Page Title
</Heading>

<Paragraph size="base" color="text-base">
  Body text description
</Paragraph>

<Caption size="xs" color="text-muted">
  Supporting text
</Caption>
```

### 3. **Spacing** (`src/components/Spacing.jsx`)
✅ 15-point spacing scale (4px base unit)
✅ Padding, Margin, Gap presets
✅ Line height scales
✅ Border radius tokens

```js
import { spacing, getSpacing } from '@/components/Spacing';

// Direct access
spacing.scale.base       // "16px"
spacing.padding.card     // "24px"
spacing.gap.grid         // "16px"
spacing.borderRadius.lg  // "12px"

// Helper function
getSpacing('base', 'scale')      // "16px"
getSpacing('button-lg', 'padding') // "16px 24px"
```

### 4. **Elevation** (`src/components/Elevation.jsx`)
✅ 7 shadow levels (none, sm, base, md, lg, xl, 2xl)
✅ Component-specific elevations
✅ Hover and active states

```js
import { elevation, getElevation } from '@/components/Elevation';

// Direct presets
elevation.presets.base       // Default card shadow
elevation.component.card     // Card elevation rules

// Get elevation for component
getComponentElevation('card', 'hover')
getElevation('lg')  // Returns shadow and Tailwind class
```

---

## 🎨 Complete Token Reference

### Typography Sizes

| Name | Size | Weight | Use Case |
|------|------|--------|----------|
| display-lg | 4xl | bold | Page hero titles |
| display-md | 3xl | bold | Section headers |
| display-sm | 2xl | bold | Component titles |
| heading-lg | xl | bold | Card titles |
| heading-md | lg | semibold | Subsection titles |
| heading-sm | base | semibold | Subheadings |
| body-lg | lg | normal | Large body text |
| body-md | base | normal | Default body text |
| body-sm | sm | normal | Secondary body text |
| caption-lg | sm | normal | Labels, captions |
| caption-sm | xs | normal | Fine print, help text |

### Spacing Scale

| Token | Size | px | Use Case |
|-------|------|-----|----------|
| xs | — | 4px | Tight spacing, borders |
| sm | — | 8px | Compact spacing |
| md | — | 12px | Normal spacing |
| base | — | 16px | Default spacing |
| lg | — | 20px | Loose spacing |
| xl | — | 24px | Card padding, sections |
| 2xl | — | 28px | Large spacing |
| 3xl | — | 32px | Section spacing |
| 4xl | — | 36px | — |
| 5xl | — | 40px | Page padding |
| 6xl | — | 44px | — |
| 7xl | — | 48px | — |
| 8xl | — | 56px | Large layouts |
| 9xl | — | 64px | — |
| 10xl | — | 80px | Maximum spacing |

### Padding Presets

| Preset | Value | Use Case |
|--------|-------|----------|
| tight | 8px | Compact components |
| normal | 16px | Default padding |
| loose | 24px | Spacious layout |
| extra-loose | 32px | Extra spacing |
| button-sm | 8px 12px | Small buttons |
| button-md | 12px 16px | Medium buttons |
| button-lg | 16px 24px | Large buttons |
| card | 24px | Card content |
| section | 32px | Section blocks |
| page | 40px | Page containers |

### Gap Presets (Flexbox/Grid)

| Preset | Value | Use Case |
|--------|-------|----------|
| tight | 4px | Minimal spacing |
| sm | 8px | Compact layout |
| md | 12px | Normal spacing |
| base | 16px | Default gap |
| lg | 20px | Loose spacing |
| xl | 24px | Extra spacing |
| 2xl | 32px | Large gap |
| button-group | 8px | Button grouping |
| form-fields | 16px | Form spacing |
| grid-tight | 8px | Compact grid |
| grid-normal | 16px | Normal grid |
| grid-loose | 24px | Loose grid |

### Border Radius

| Token | Size | Use Case |
|-------|------|----------|
| none | 0px | Sharp corners |
| xs | 2px | Fine detail |
| sm | 4px | Small radius |
| md | 8px | Default (buttons, inputs) |
| lg | 12px | Cards, large components |
| xl | 16px | Badges, larger elements |
| full | 9999px | Circles, pills |
| button | 8px | Button border radius |
| button-pill | 9999px | Pill buttons |
| card | 12px | Card border radius |
| input | 8px | Input field radius |
| avatar | 9999px | Avatar circles |
| badge | 16px | Badge radius |

### Elevation (Shadows)

| Level | Shadow | Use Case |
|-------|--------|----------|
| none | none | Flat design |
| sm | 0 1px 2px | Hover states |
| base | 0 1px 3px, 0 1px 2px | Cards, default |
| md | 0 4px 6px | Medium components |
| lg | 0 10px 15px | Dropdowns, raised elements |
| xl | 0 20px 25px | Modals |
| 2xl | 0 25px 50px | Maximum elevation |
| focus | 0 0 0 3px | Focus rings |

### Line Height

| Value | Percentage | Use Case |
|-------|-----------|----------|
| tight | 120% | Headings |
| snug | 137.5% | Subheadings |
| normal | 150% | Body text (default) |
| relaxed | 162.5% | Readable body |
| loose | 175% | Large text blocks |
| extra-loose | 200% | Accessibility |

---

## 💻 Implementation Examples

### Using All Tokens Together

```jsx
import { Heading, Paragraph, Caption } from '@/components/Typography';
import { spacing } from '@/components/Spacing';
import { elevation } from '@/components/Elevation';
import { colors } from '@/config/colors';

export function Card() {
  return (
    <div
      style={{
        padding: spacing.padding.card,
        borderRadius: spacing.borderRadius.card,
        backgroundColor: colors.neutral.base,
        boxShadow: elevation.presets.base.css,
        gap: spacing.gap.base
      }}
      className="flex flex-col"
    >
      <Heading level={3} size="md">
        Card Title
      </Heading>

      <Paragraph size="sm" color="text-muted">
        Card description with supporting text.
      </Paragraph>

      <div style={{ marginTop: spacing.margin.section }}>
        <Caption size="xs">Optional metadata</Caption>
      </div>
    </div>
  );
}
```

### Form Example

```jsx
import { Label, Paragraph } from '@/components/Typography';
import { spacing } from '@/components/Spacing';
import { colors } from '@/config/colors';

export function FormField() {
  return (
    <div style={{ marginBottom: spacing.margin.normal }}>
      <Label
        size="sm"
        weight="semibold"
        required={true}
        style={{ marginBottom: spacing.margin.element }}
      >
        Email Address
      </Label>

      <input
        type="email"
        style={{
          padding: spacing.padding['button-md'],
          borderRadius: spacing.borderRadius.input,
          borderColor: colors.neutral.muted,
          color: colors.text.neutral.base
        }}
        placeholder="you@example.com"
      />

      <Paragraph size="xs" color="text-muted" style={{ marginTop: spacing.margin.element }}>
        We'll never share your email address
      </Paragraph>
    </div>
  );
}
```

---

## 🔗 Integrating with Tailwind

Add to `tailwind.config.mjs`:

```js
export default {
  theme: {
    extend: {
      spacing: {
        // Add spacing tokens
        0: '0px',
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        // ... continue with all tokens
      },
      borderRadius: {
        'button': '8px',
        'card': '12px',
        'input': '8px',
        // ... component-specific radius
      },
      boxShadow: {
        'sm': elevation.presets.sm.css,
        'base': elevation.presets.base.css,
        'md': elevation.presets.md.css,
        // ... continue with elevation levels
      },
      fontSize: {
        'xs': '12px',
        'sm': '14px',
        'base': '16px',
        'lg': '18px',
        'xl': '20px',
        // ... continue with type sizes
      }
    }
  }
};
```

---

## ✅ Token Usage Checklist

When building components:

- [ ] **Colors**: Use `colors` object from `@/config/colors`
- [ ] **Typography**: Use Typography components (Heading, Paragraph, etc.)
- [ ] **Spacing**: Use `spacing` tokens for padding, margin, gap
- [ ] **Border Radius**: Use `borderRadius` presets from spacing
- [ ] **Shadows**: Use `elevation` presets for box-shadow
- [ ] **Line Height**: Use `lineHeight` presets from spacing

Example checklist for a card:

```jsx
const Card = () => (
  <div
    style={{
      backgroundColor: colors.neutral.base,        // ✓ Colors
      padding: spacing.padding.card,                // ✓ Spacing
      borderRadius: spacing.borderRadius.card,      // ✓ Border radius
      boxShadow: elevation.presets.base.css,       // ✓ Elevation
    }}
  >
    <Heading level={3} size="md">                  {/* ✓ Typography */}
      Title
    </Heading>
  </div>
);
```

---

## 📞 Support & Questions

- **Colors**: See `src/config/colors.js` and `src/app/globals.css`
- **Typography**: See `src/components/Typography.jsx` and examples
- **Spacing**: See `src/components/Spacing.jsx` for all presets
- **Elevation**: See `src/components/Elevation.jsx` for shadow levels
- **Dark Mode**: All colors automatically adapt via CSS variables

---

## 🎯 Token Consistency Goals

- ✅ All colors use CSS variables (light/dark modes)
- ✅ All spacing uses 4px base unit
- ✅ All typography uses semantic sizing
- ✅ All elevations use consistent shadow system
- ✅ All border radius uses preset values
- ✅ 100% coverage across all components

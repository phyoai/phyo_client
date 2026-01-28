# 🎨 Phyo Icon Library

A comprehensive React icon library with 2000+ beautiful, high-quality SVG icons. Perfect for modern web applications built with React, Next.js, Vite, and more.

[![npm version](https://img.shields.io/npm/v/@phyoofficial/phyo-icon-library.svg)](https://www.npmjs.com/package/@phyoofficial/phyo-icon-library)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

---

## ✨ Features

- 🎯 **2000+ Icons** - Comprehensive collection covering all your needs
- 📦 **Tree-shakeable** - Only bundle the icons you use
- 🎨 **Customizable** - Full control over size, color, and styling
- 💪 **TypeScript Support** - Complete type definitions included
- ⚡ **Lightweight** - ~1-2KB per icon (when tree-shaken)
- 🔧 **Framework Agnostic** - Works with React, Next.js, Vite, CRA
- 🌐 **SSR Compatible** - Server-side rendering ready
- 📱 **Responsive** - Perfect for mobile and desktop

---

## 📦 Installation

```bash
npm install @phyoofficial/phyo-icon-library
```

or with yarn:

```bash
yarn add @phyoofficial/phyo-icon-library
```

or with pnpm:

```bash
pnpm add @phyoofficial/phyo-icon-library
```

---

## 🚀 Quick Start

### Basic Usage

```jsx
import React from 'react';
import { HomeFill, HeartFill, UserFill } from '@phyoofficial/phyo-icon-library';

function App() {
  return (
    <div>
      <HomeFill width={24} height={24} />
      <HeartFill width={24} height={24} fill="red" />
      <UserFill width={24} height={24} color="blue" />
    </div>
  );
}

export default App;
```

### Import Multiple Icons

```jsx
import { 
  HomeFill, 
  MailFill, 
  CalendarFill, 
  UserFill,
  SearchLine,
  SettingsFill
} from '@phyoofficial/phyo-icon-library';

function Navigation() {
  return (
    <nav>
      <HomeFill width={20} height={20} />
      <MailFill width={20} height={20} />
      <CalendarFill width={20} height={20} />
      <UserFill width={20} height={20} />
      <SearchLine width={20} height={20} />
      <SettingsFill width={20} height={20} />
    </nav>
  );
}
```

---

## 🎨 Customization

### Size

```jsx
// Using width and height props
<HomeFill width={24} height={24} />
<HomeFill width={32} height={32} />
<HomeFill width={48} height={48} />

// Using style
<HomeFill style={{ width: '2rem', height: '2rem' }} />

// Using CSS class
<HomeFill className="icon-large" />
```

### Colors

```jsx
// Using fill prop
<HeartFill fill="red" />
<HeartFill fill="#ff0000" />
<HeartFill fill="rgb(255, 0, 0)" />

// Using color prop (inherits currentColor)
<HeartFill color="blue" />

// Using CSS
<HeartFill className="text-blue-500" /> {/* Tailwind */}
<HeartFill style={{ color: 'green' }} />
```

### Styling

```jsx
// Inline styles
<HomeFill 
  style={{ 
    width: '24px',
    height: '24px',
    color: 'blue',
    cursor: 'pointer',
    transition: 'all 0.3s'
  }} 
/>

// CSS classes
<HomeFill className="my-custom-icon" />

// Tailwind CSS
<HomeFill className="w-6 h-6 text-blue-500 hover:text-blue-700" />
```

### All SVG Props

Icons accept all standard SVG element props:

```jsx
<HomeFill 
  width={24}
  height={24}
  fill="currentColor"
  stroke="none"
  strokeWidth={2}
  className="my-icon"
  style={{ margin: '10px' }}
  onClick={() => console.log('clicked')}
  onMouseEnter={() => console.log('hovered')}
/>
```

---

## 🔧 Framework Integration

### Next.js (App Router)

```jsx
'use client';

import { HomeFill, UserFill } from '@phyoofficial/phyo-icon-library';

export default function Page() {
  return (
    <div>
      <HomeFill width={24} height={24} />
      <UserFill width={24} height={24} />
    </div>
  );
}
```

### Next.js (Pages Router)

```jsx
import { HomeFill, UserFill } from '@phyoofficial/phyo-icon-library';

export default function Home() {
  return (
    <div>
      <HomeFill width={24} height={24} />
      <UserFill width={24} height={24} />
    </div>
  );
}
```

### Create React App

```jsx
import { HomeFill, UserFill } from '@phyoofficial/phyo-icon-library';

function App() {
  return (
    <div className="App">
      <HomeFill width={24} height={24} />
      <UserFill width={24} height={24} />
    </div>
  );
}
```

### Vite

```jsx
import { HomeFill, UserFill } from '@phyoofficial/phyo-icon-library';

function App() {
  return (
    <>
      <HomeFill width={24} height={24} />
      <UserFill width={24} height={24} />
    </>
  );
}
```

---

## 📚 Icon Categories

The library includes icons organized in these categories:

### 🏠 **User Interface**
- **Arrows** - `ArrowDownFill`, `ArrowUpLine`, `ArrowLeftCircleFill`
- **System** - `SettingsFill`, `DownloadLine`, `DeleteBinFill`
- **Editor** - `BoldLine`, `ItalicLine`, `UnderlineLine`

### 💼 **Business & Office**
- **Business** - `BriefcaseFill`, `PieChartFill`, `BarChartLine`
- **Document** - `FileFill`, `FolderLine`, `FileTextFill`
- **Finance** - `MoneyDollarCircleFill`, `CoinFill`, `WalletLine`

### 💬 **Communication**
- **Communication** - `ChatFill`, `MailLine`, `PhoneFill`
- **User/Faces** - `UserFill`, `UserLine`, `TeamFill`
- **Media** - `PlayCircleFill`, `PauseLine`, `MusicFill`

### 🎨 **Design & Development**
- **Design** - `PaletteFill`, `BrushLine`, `PaintBrushFill`
- **Development** - `CodeLine`, `TerminalFill`, `GitBranchLine`
- **Device** - `ComputerFill`, `SmartphoneLine`, `TabletFill`

### 🌍 **Location & Weather**
- **Map** - `MapPinFill`, `NavigationLine`, `RoadMapFill`
- **Weather** - `SunFill`, `MoonLine`, `CloudyFill`
- **Buildings** - `HomeFill`, `BuildingLine`, `HospitalFill`

### 🍔 **Lifestyle**
- **Food** - `RestaurantFill`, `CupLine`, `CakeFill`
- **Health/Medical** - `HeartPulseFill`, `MedicineBottleLine`, `StethoscopeFill`
- **Others** - `StarFill`, `FlagLine`, `AwardFill`

---

## 📖 Naming Convention

Icons follow a consistent naming pattern:

**File name → Component name**
- `arrow-down-fill.svg` → `ArrowDownFill`
- `home-line.svg` → `HomeLine`
- `user-fill.svg` → `UserFill`

**Rules:**
- Kebab-case is converted to PascalCase
- `-fill` suffix indicates filled icons
- `-line` suffix indicates outline/stroke icons
- Numbers are prefixed with "Icon": `24-hour.svg` → `Icon24Hour`

---

## 💡 Usage Examples

### Icon Button

```jsx
import { HomeFill } from '@phyoofficial/phyo-icon-library';

function IconButton() {
  return (
    <button 
      onClick={() => console.log('Home clicked')}
      className="icon-button"
    >
      <HomeFill width={20} height={20} />
      <span>Home</span>
    </button>
  );
}
```

### Navigation Menu

```jsx
import { 
  HomeFill, 
  UserFill, 
  SettingsFill, 
  MailFill 
} from '@phyoofficial/phyo-icon-library';

function Navigation() {
  return (
    <nav>
      <a href="/home">
        <HomeFill width={24} height={24} /> Home
      </a>
      <a href="/profile">
        <UserFill width={24} height={24} /> Profile
      </a>
      <a href="/messages">
        <MailFill width={24} height={24} /> Messages
      </a>
      <a href="/settings">
        <SettingsFill width={24} height={24} /> Settings
      </a>
    </nav>
  );
}
```

### Dynamic Icons

```jsx
import { Icons } from '@phyoofficial/phyo-icon-library';

function DynamicIcon({ iconName, size = 24 }) {
  const IconComponent = Icons[iconName];
  
  if (!IconComponent) return null;
  
  return <IconComponent width={size} height={size} />;
}

// Usage
<DynamicIcon iconName="HomeFill" size={32} />
<DynamicIcon iconName="UserFill" size={24} />
```

### Loading State

```jsx
import { LoaderFill } from '@phyoofficial/phyo-icon-library';

function LoadingButton({ isLoading, children }) {
  return (
    <button disabled={isLoading}>
      {isLoading ? (
        <LoaderFill 
          width={20} 
          height={20} 
          className="animate-spin" 
        />
      ) : children}
    </button>
  );
}
```

### With Tailwind CSS

```jsx
import { HeartFill, HeartLine } from '@phyoofficial/phyo-icon-library';

function LikeButton({ liked, onToggle }) {
  return (
    <button 
      onClick={onToggle}
      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
    >
      {liked ? (
        <HeartFill className="w-6 h-6 text-red-500" />
      ) : (
        <HeartLine className="w-6 h-6 text-gray-500 hover:text-red-500" />
      )}
    </button>
  );
}
```

---

## 🎯 TypeScript Support

Full TypeScript support is included:

```typescript
import { HomeFill } from '@phyoofficial/phyo-icon-library';
import type { SVGProps } from 'react';

// Icon components accept SVGProps
interface IconButtonProps {
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  label: string;
  onClick: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({ icon: Icon, label, onClick }) => {
  return (
    <button onClick={onClick}>
      <Icon width={24} height={24} />
      <span>{label}</span>
    </button>
  );
};

// Usage
<IconButton 
  icon={HomeFill} 
  label="Home" 
  onClick={() => console.log('clicked')} 
/>
```

---

## 🎨 Styling Best Practices

### CSS Modules

```css
/* styles.module.css */
.icon {
  width: 24px;
  height: 24px;
  color: var(--primary-color);
  transition: color 0.3s ease;
}

.icon:hover {
  color: var(--primary-hover);
}
```

```jsx
import { HomeFill } from '@phyoofficial/phyo-icon-library';
import styles from './styles.module.css';

<HomeFill className={styles.icon} />
```

### Styled Components

```jsx
import styled from 'styled-components';
import { HomeFill } from '@phyoofficial/phyo-icon-library';

const StyledIcon = styled(HomeFill)`
  width: 24px;
  height: 24px;
  color: ${props => props.theme.primary};
  transition: color 0.3s ease;
  
  &:hover {
    color: ${props => props.theme.primaryHover};
  }
`;

<StyledIcon />
```

### Emotion

```jsx
import { css } from '@emotion/react';
import { HomeFill } from '@phyoofficial/phyo-icon-library';

const iconStyle = css`
  width: 24px;
  height: 24px;
  color: blue;
  transition: color 0.3s ease;
  
  &:hover {
    color: darkblue;
  }
`;

<HomeFill css={iconStyle} />
```

---

## ⚡ Performance Tips

### 1. Import Only What You Need

```jsx
// ✅ Good - Tree-shakeable
import { HomeFill, UserFill } from '@phyoofficial/phyo-icon-library';

// ❌ Avoid - Imports everything
import * as Icons from '@phyoofficial/phyo-icon-library';
```

### 2. Use Dynamic Imports for Large Sets

```jsx
// For icon pickers or large collections
const loadIcon = async (iconName) => {
  const { [iconName]: Icon } = await import('@phyoofficial/phyo-icon-library');
  return Icon;
};
```

### 3. Memoize Icon Components

```jsx
import { memo } from 'react';
import { HomeFill } from '@phyoofficial/phyo-icon-library';

const MemoizedIcon = memo(({ size }) => (
  <HomeFill width={size} height={size} />
));
```

---

## 🐛 Troubleshooting

### Icons Not Displaying

**Issue:** Icons don't show up in Next.js

**Solution:** Make sure you're using `'use client'` directive if using in client components (Next.js 13+ App Router):

```jsx
'use client';

import { HomeFill } from '@phyoofficial/phyo-icon-library';
```

### TypeScript Errors

**Issue:** Type errors when using icons

**Solution:** Make sure you have `@types/react` installed:

```bash
npm install --save-dev @types/react
```

### Size Issues

**Issue:** Icons are too small or too large

**Solution:** Always specify width and height:

```jsx
<HomeFill width={24} height={24} />
```

### Color Not Changing

**Issue:** Icon color won't change

**Solution:** Use `fill` or `color` prop, or ensure CSS is targeting the SVG:

```jsx
<HomeFill fill="red" />
<HomeFill style={{ color: 'red' }} />
```

---

## 🔄 Migration Guide

### From Local Icons

**Before:**
```jsx
import HomeFill from './icons/HomeFill';
import MailFill from './icons/MailFill';
import UserFill from './icons/UserFill';
```

**After:**
```jsx
import { HomeFill, MailFill, UserFill } from '@phyoofficial/phyo-icon-library';
```

---

## 📄 License

MIT © Abhishek

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

## 💖 Support

If you like this project, please give it a ⭐️!

---

## 📞 Contact

- **Author:** Abhishek
- **Email:** abhishek@thepyromedia.com
- **NPM:** [@phyoofficial/phyo-icon-library](https://www.npmjs.com/package/@phyoofficial/phyo-icon-library)

---

Made with ❤️ by Abhishek

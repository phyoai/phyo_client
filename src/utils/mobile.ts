/**
 * Mobile Optimization Utilities
 * Provides helpers for touch-friendly interactions and mobile-responsive patterns
 */

/**
 * Detect if device is touch-capable
 */
export const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false;

  return (
    (navigator.maxTouchPoints !== undefined && navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints !== undefined && navigator.msMaxTouchPoints > 0) ||
    'ontouchstart' in window
  );
};

/**
 * Detect viewport size category
 */
export const getViewportSize = (): 'mobile' | 'tablet' | 'desktop' => {
  if (typeof window === 'undefined') return 'desktop';

  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

/**
 * Touch-friendly button minimum size: 44x44px (iOS guideline)
 * Use in tailwind: h-11 w-11 min-h-[44px] min-w-[44px]
 */
export const TOUCH_TARGET_SIZE = 44; // pixels

/**
 * Debounce handler for mobile scroll/resize events
 * Prevents excessive handler calls on mobile devices
 */
export const createMobileOptimizedListener = (
  callback: () => void,
  delayMs: number = 150
) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: any[]) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(callback, delayMs);
  };
};

/**
 * Format large numbers for mobile display
 * Converts 1234567 -> "1.2M" for compact display
 */
export const formatNumberForMobile = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

/**
 * Calculate optimal column count based on container width
 * Useful for responsive grid layouts
 */
export const getOptimalGridColumns = (
  containerWidth: number,
  minColWidth: number = 150
): number => {
  return Math.max(1, Math.floor(containerWidth / minColWidth));
};

/**
 * Mobile-optimized pagination size
 * Smaller page sizes for mobile to reduce scroll distance
 */
export const getMobilePageSize = (viewportSize: 'mobile' | 'tablet' | 'desktop'): number => {
  switch (viewportSize) {
    case 'mobile':
      return 10; // Smaller pages on mobile
    case 'tablet':
      return 15;
    case 'desktop':
      return 20;
  }
};

/**
 * Get optimal table column visibility for mobile
 * Returns which columns to show based on viewport
 */
export const getVisibleTableColumns = (
  allColumns: string[],
  viewportSize: 'mobile' | 'tablet' | 'desktop'
): string[] => {
  if (viewportSize === 'mobile') {
    // Show only most important columns on mobile
    const importantColumns = ['name', 'id', 'status'];
    return allColumns.filter(col => importantColumns.includes(col));
  }

  if (viewportSize === 'tablet') {
    // Show most but not all columns on tablet
    const hideColumns = ['metadata', 'notes'];
    return allColumns.filter(col => !hideColumns.includes(col));
  }

  // Show all columns on desktop
  return allColumns;
};

/**
 * Safe read of safe viewport dimensions
 * Accounts for viewport changes and orientation changes
 */
export const getViewportDimensions = () => {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 };
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
    isPortrait: window.innerHeight > window.innerWidth,
    isLandscape: window.innerWidth > window.innerHeight,
  };
};

/**
 * Calculate readable line length for mobile (should be 50-75 chars per line)
 * Returns recommended max-width based on viewport
 */
export const getOptimalLineLength = (viewportSize: 'mobile' | 'tablet' | 'desktop'): string => {
  switch (viewportSize) {
    case 'mobile':
      return 'max-w-sm'; // ~20rem
    case 'tablet':
      return 'max-w-2xl'; // ~42rem
    case 'desktop':
      return 'max-w-4xl'; // ~56rem
  }
};

/**
 * Get spacing scale for mobile layouts
 * Helps maintain consistent spacing across devices
 */
export const getMobileSpacing = (viewportSize: 'mobile' | 'tablet' | 'desktop') => {
  return {
    xs: viewportSize === 'mobile' ? 'p-2' : 'p-3',
    sm: viewportSize === 'mobile' ? 'p-3' : 'p-4',
    md: viewportSize === 'mobile' ? 'p-4' : 'p-6',
    lg: viewportSize === 'mobile' ? 'p-6' : 'p-8',
  };
};

/**
 * Detect if user prefers reduced motion
 * For respectful animation handling
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Handle double-tap to zoom behavior on touch devices
 * Prevent unwanted zoom on interactive elements
 */
export const disableDoubleTapZoom = (elementRef: React.RefObject<HTMLElement>) => {
  if (!elementRef.current || !isTouchDevice()) return;

  let lastTap = 0;

  elementRef.current.addEventListener('touchstart', (e: TouchEvent) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;

    if (tapLength < 300 && tapLength > 0) {
      e.preventDefault();
    }

    lastTap = currentTime;
  });
};

/**
 * Mobile-optimized modal/dialog max-width
 * Ensures modals don't take entire screen on mobile
 */
export const getModalMaxWidth = (viewportSize: 'mobile' | 'tablet' | 'desktop'): string => {
  switch (viewportSize) {
    case 'mobile':
      return 'max-w-[95vw]'; // 95% of viewport
    case 'tablet':
      return 'max-w-md';
    case 'desktop':
      return 'max-w-lg';
  }
};

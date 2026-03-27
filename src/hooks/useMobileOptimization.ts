/**
 * useMobileOptimization Hook
 * Provides reactive mobile optimization helpers for components
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getViewportSize,
  isTouchDevice,
  getViewportDimensions,
  getMobilePageSize,
  getOptimalLineLength,
  getModalMaxWidth,
  prefersReducedMotion,
  createMobileOptimizedListener,
} from '@/utils/mobile';

export const useMobileOptimization = () => {
  const [viewportSize, setViewportSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [isTouch, setIsTouch] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, isPortrait: false, isLandscape: false });
  const [preferReducedMotion, setPreferReducedMotion] = useState(false);

  // Initialize on mount
  useEffect(() => {
    setViewportSize(getViewportSize());
    setIsTouch(isTouchDevice());
    setDimensions(getViewportDimensions());
    setPreferReducedMotion(prefersReducedMotion());
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = createMobileOptimizedListener(() => {
      setViewportSize(getViewportSize());
      setDimensions(getViewportDimensions());
    });

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get derived values
  const pageSize = getMobilePageSize(viewportSize);
  const lineLength = getOptimalLineLength(viewportSize);
  const modalMaxWidth = getModalMaxWidth(viewportSize);
  const isMobile = viewportSize === 'mobile';
  const isTablet = viewportSize === 'tablet';
  const isDesktop = viewportSize === 'desktop';

  const getResponsiveValue = useCallback(
    <T,>(mobile: T, tablet: T, desktop: T): T => {
      switch (viewportSize) {
        case 'mobile':
          return mobile;
        case 'tablet':
          return tablet;
        case 'desktop':
          return desktop;
      }
    },
    [viewportSize]
  );

  return {
    // Viewport info
    viewportSize,
    isMobile,
    isTablet,
    isDesktop,
    dimensions,

    // Device capabilities
    isTouch,
    preferReducedMotion,

    // Optimized values
    pageSize,
    lineLength,
    modalMaxWidth,

    // Helpers
    getResponsiveValue,
  };
};

/**
 * useMobileMenu Hook
 * Manages mobile menu open/close state with touch handling
 */
export const useMobileMenu = (initialOpen: boolean = false) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const { isTouch } = useMobileOptimization();

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Auto-close on outside click for touch devices
  useEffect(() => {
    if (!isOpen || !isTouch) return;

    const handleClickOutside = (e: TouchEvent) => {
      // This should be connected to menu element via ref
      // For now, just provide close function
    };

    return () => {
      // Cleanup
    };
  }, [isOpen, isTouch]);

  return { isOpen, toggle, open, close };
};

/**
 * useMobileTable Hook
 * Manages mobile table behavior (column hiding, row expansion, etc.)
 */
export const useMobileTable = <T extends Record<string, any>>(
  data: T[],
  allColumns: (keyof T)[]
) => {
  const { viewportSize } = useMobileOptimization();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const visibleColumns = getVisibleTableColumnsForMobile(allColumns, viewportSize);

  const toggleRowExpansion = useCallback((rowId: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(rowId)) {
        next.delete(rowId);
      } else {
        next.add(rowId);
      }
      return next;
    });
  }, []);

  return {
    visibleColumns,
    expandedRows,
    toggleRowExpansion,
    shouldStackOnMobile: viewportSize === 'mobile',
  };
};

/**
 * Helper for mobile table columns
 */
function getVisibleTableColumnsForMobile(
  allColumns: (string | number | symbol)[],
  viewportSize: 'mobile' | 'tablet' | 'desktop'
): (string | number | symbol)[] {
  if (viewportSize === 'mobile') {
    const importantColumns = ['name', 'id', 'status', 'title'];
    return allColumns.filter(col =>
      importantColumns.some(ic => String(col).toLowerCase().includes(ic.toLowerCase()))
    );
  }

  if (viewportSize === 'tablet') {
    const hideColumns = ['metadata', 'notes', 'description'];
    return allColumns.filter(col =>
      !hideColumns.some(hc => String(col).toLowerCase().includes(hc.toLowerCase()))
    );
  }

  return allColumns;
}

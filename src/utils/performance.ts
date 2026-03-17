import { memo, useMemo, useCallback, Suspense, ReactNode } from 'react';
import dynamic from 'next/dynamic';
import React from 'react';

/**
 * Performance Optimization Utilities
 * - Memoization helpers
 * - Code splitting utilities
 * - Lazy loading components
 */

/**
 * Memoize component to prevent unnecessary re-renders
 * Use when component receives same props frequently
 */
export const withMemo = <P extends object>(
    Component: React.ComponentType<P>,
    propsAreEqual?: (prevProps: P, nextProps: P) => boolean
) => {
    return memo(Component, propsAreEqual);
};

/**
 * Dynamic import with code splitting and loading state
 * Automatically splits code for better performance
 */
export const dynamicComponent = <T extends React.ComponentType<any>>(
    importFunc: () => Promise<{ default: T }>,
    options?: {
        fallback?: ReactNode;
        loading?: boolean;
    }
) => {
    return dynamic(importFunc, {
        loading: () => (options?.fallback as ReactNode) || React.createElement('div', null, 'Loading...'),
        ssr: true,
    });
};

/**
 * Server-side code splitting
 * Use for pages that need SSR but heavy components
 */
export const serverSplitCode = <T extends React.ComponentType<any>>(
    importFunc: () => Promise<{ default: T }>,
) => {
    return dynamic(importFunc, {
        ssr: true,
    });
};

/**
 * Client-side only code splitting
 * Use for components that should only render on client
 */
export const clientOnlyComponent = <T extends React.ComponentType<any>>(
    importFunc: () => Promise<{ default: T }>,
) => {
    return dynamic(importFunc, {
        ssr: false,
        loading: () => React.createElement('div', null, 'Loading...'),
    });
};

/**
 * Lazy load images with intersection observer
 */
export const useLazyImage = (src: string, onLoad?: () => void) => {
    const [imageSrc, setImageSrc] = React.useState<string>('');
    const [imageRef, setImageRef] = React.useState<HTMLImageElement | null>(null);

    React.useEffect(() => {
        let observer: IntersectionObserver;

        const img = imageRef;
        if (img) {
            observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setImageSrc(src);
                            onLoad?.();
                            observer.unobserve(img);
                        }
                    });
                },
                { rootMargin: '50px' }
            );

            observer.observe(img);
        }

        return () => {
            if (observer && img) {
                observer.unobserve(img);
            }
        };
    }, [src, imageRef, onLoad]);

    return { imageSrc, setImageRef };
};

/**
 * Optimize expensive computations with useMemo
 * Usage: const result = useOptimizedValue(expensiveComputation, [deps])
 */
export const useOptimizedValue = <T,>(
    computeFn: () => T,
    dependencies: React.DependencyList
) => {
    return useMemo(computeFn, dependencies);
};

/**
 * Memoized callback for event handlers
 * Prevents function recreation on each render
 */
export const useStableCallback = <T extends (...args: any[]) => any>(
    callback: T,
    dependencies: React.DependencyList
): T => {
    return useCallback(callback, dependencies) as T;
};

/**
 * Preload images
 * Use before rendering images to prevent layout shift
 */
export const preloadImage = (src: string) => {
    if (typeof window === 'undefined') return;

    const img = new Image();
    img.src = src;
};

/**
 * Batch preload multiple images
 */
export const preloadImages = (sources: string[]) => {
    if (typeof window === 'undefined') return;

    sources.forEach(src => preloadImage(src));
};

/**
 * Virtualize long lists for performance
 * For lists with 1000+ items
 */
export const useVirtualizedList = <T extends any>(
    items: T[],
    itemHeight: number,
    containerHeight: number
) => {
    const [scrollY, setScrollY] = React.useState(0);

    const startIndex = Math.floor(scrollY / itemHeight);
    const endIndex = Math.min(
        items.length,
        Math.ceil((scrollY + containerHeight) / itemHeight)
    );

    const visibleItems = items.slice(startIndex, endIndex);
    const offsetY = startIndex * itemHeight;

    return {
        visibleItems,
        offsetY,
        totalHeight: items.length * itemHeight,
        handleScroll: (e: React.UIEvent<HTMLDivElement>) => {
            setScrollY((e.target as HTMLDivElement).scrollTop);
        },
    };
};

/**
 * Debounce function calls
 * Use for search, resize, scroll handlers
 */
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return function (...args: Parameters<T>) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

/**
 * Throttle function calls
 * Use for scroll, resize events
 */
export const throttle = <T extends (...args: any[]) => any>(
    func: T,
    limit: number
): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return function (...args: Parameters<T>) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
};

/**
 * Cache API responses in memory
 */
export const createCache = <T,>() => {
    const cache = new Map<string, T>();

    return {
        get: (key: string) => cache.get(key),
        set: (key: string, value: T) => cache.set(key, value),
        has: (key: string) => cache.has(key),
        clear: () => cache.clear(),
    };
};

/**
 * Request deduplication for API calls
 * Prevents multiple identical requests
 */
export const createRequestDeduplicator = () => {
    const pendingRequests = new Map<string, Promise<any>>();

    return {
        deduplicate: async <T,>(
            key: string,
            requestFn: () => Promise<T>
        ): Promise<T> => {
            if (pendingRequests.has(key)) {
                return pendingRequests.get(key)!;
            }

            const promise = requestFn().finally(() => {
                pendingRequests.delete(key);
            });

            pendingRequests.set(key, promise);
            return promise;
        },
    };
};

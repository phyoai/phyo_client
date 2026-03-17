import Image from 'next/image';
import { useState, useEffect } from 'react';

/**
 * Optimized Image Component
 * Features:
 * - Automatic image optimization
 * - Lazy loading
 * - Responsive images
 * - Error handling
 * - Placeholder support
 * - WebP format support
 */
export default function OptimizedImage({
    src,
    alt = 'Image',
    width,
    height,
    responsive = true,
    lazyLoad = true,
    placeholder = 'blur',
    quality = 85,
    priority = false,
    sizes,
    className = '',
    onLoad,
    onError,
    ...props
}) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);

    // Generate responsive sizes if not provided
    const responsiveSizes = responsive && !sizes
        ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
        : sizes;

    const handleLoadingComplete = () => {
        setIsLoaded(true);
        onLoad?.();
    };

    const handleError = (err) => {
        setError(true);
        onError?.(err);
    };

    // Fallback if image fails to load
    if (error) {
        return (
            <div
                className={`bg-gray-200 flex items-center justify-center ${className}`}
                style={{ width: width || '100%', height: height || '100%' }}
            >
                <span className="text-gray-400">Failed to load image</span>
            </div>
        );
    }

    return (
        <div className={`relative ${className}`} style={{ width, height }}>
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                quality={quality}
                priority={priority}
                loading={lazyLoad ? 'lazy' : 'eager'}
                placeholder={placeholder}
                sizes={responsiveSizes}
                onLoadingComplete={handleLoadingComplete}
                onError={handleError}
                className={`object-cover transition-opacity duration-300 ${
                    isLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                {...props}
            />
        </div>
    );
}

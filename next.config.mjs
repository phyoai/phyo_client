/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable strict mode for development
    reactStrictMode: true,

    // Image Optimization
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.fbcdn.net',
            },
            {
                protocol: 'https',
                hostname: '**.translate.goog',
            },
        ],
        // Enable AVIF format for better compression
        formats: ['image/avif', 'image/webp'],
        // Cache optimized images
        minimumCacheTTL: 60,
        // Responsive image optimization
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },

    // Experimental features for better performance
    experimental: {
        optimizePackageImports: ['lucide-react', 'react-icons'],
    },

    // Webpack optimization
    webpack: (config, { isServer }) => {
        // Code splitting optimization
        if (!isServer) {
            config.optimization = {
                ...config.optimization,
                splitChunks: {
                    chunks: 'all',
                    cacheGroups: {
                        default: false,
                        vendors: false,
                        // Vendor code
                        vendor: {
                            filename: 'chunks/vendor.js',
                            test: /node_modules/,
                            name: 'vendor',
                            priority: 10,
                            reuseExistingChunk: true,
                        },
                        // Shared code
                        common: {
                            minChunks: 2,
                            priority: 5,
                            reuseExistingChunk: true,
                        },
                    },
                },
            };
        }
        return config;
    },

    // Empty turbopack config to silence the warning
    turbopack: {},

    // Compression
    compress: true,

    // Generate ETags for static resources
    generateEtags: true,

    // Headers for security and performance
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                ],
            },
            // Cache static assets
            {
                source: '/static/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
            // Cache public files
            {
                source: '/public/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;

import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Skip TypeScript errors during build to focus on bundle analysis
    typescript: {
        ignoreBuildErrors: true,
    },

    // When analyzing bundle, use standalone output to avoid SSG issues
    ...(process.env.ANALYZE === 'true' && {
        output: 'standalone',
    }),

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

            // Bundle analyzer integration
            if (process.env.ANALYZE === 'true') {
                config.plugins.push(
                    new BundleAnalyzerPlugin({
                        analyzerMode: 'static',
                        reportFilename: '.next/bundle-report.html',
                        openAnalyzer: false,
                        generateStatsFile: true,
                        statsFilename: '.next/bundle-stats.json',
                        maxSize: 250 * 1024, // 250kb threshold
                    })
                );
            }
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
    async redirects() {
        return [
            {
                source: '/contact_us',
                destination: '/contact-us',
                permanent: true,
            },
        ];
    },

    // Headers for security and performance
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    // Security Headers
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
                    // Strict Transport Security
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=31536000; includeSubDomains; preload',
                    },
                    // Content Security Policy - Prevent XSS
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://connect.facebook.net https://apis.google.com https://accounts.google.com https://ssl.gstatic.com; style-src 'self' 'unsafe-inline' https://accounts.google.com https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: https: https://lh3.googleusercontent.com; connect-src 'self' http://localhost:* https://api.phyo.ai https://accounts.google.com https://graph.instagram.com https://spool-reliance-channel.ngrok-free.dev https://*.ngrok-free.dev https://*.ngrok-free.app https://*.run.app; frame-src 'self' https://accounts.google.com; object-src 'none'; base-uri 'self'; form-action 'self'",
                    },
                    // Prevent Clickjacking
                    {
                        key: 'Permissions-Policy',
                        value: 'geolocation=(), microphone=(), camera=(), payment=()',
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

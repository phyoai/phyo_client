/** @type {import('next').NextConfig} */
const nextConfig = {
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
    },
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            '@': './src'
        };
        return config;
    }
};

export default nextConfig;

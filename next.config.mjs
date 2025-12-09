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
    // Empty turbopack config to silence the warning
    turbopack: {},
};

export default nextConfig;

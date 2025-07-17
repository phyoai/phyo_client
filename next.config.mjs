/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['instagram.fisb3-3.fna.fbcdn.net', "instagram.fpnq4-1.fna.fbcdn.net", "instagram.fisb31-1.fna.fbcdn.net", "z-p4-instagram.flhe1-1.fna.fbcdn.net", "instagram.fisb5-2.fna.fbcdn.net", "instagram.fisb6-2.fna.fbcdn.net"],
    },
    experimental: {
        // appDir: true // Removed as it's not valid in Next.js 15.1.2
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

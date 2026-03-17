/**
 * ISR (Incremental Static Regeneration) Configuration
 * Use these utilities to configure ISR on your pages
 */

/**
 * Standard ISR revalidation intervals
 */
export const ISR_REVALIDATE = {
    FAST: 60, // 1 minute - for frequently changing content
    NORMAL: 300, // 5 minutes - for moderately changing content
    SLOW: 3600, // 1 hour - for rarely changing content
    VERY_SLOW: 86400, // 24 hours - for static content
} as const;

/**
 * Example ISR configuration for a page
 *
 * Usage in a page.jsx or page.tsx:
 *
 * export const revalidate = ISR_REVALIDATE.NORMAL; // Revalidate every 5 minutes
 *
 * OR use dynamic segments:
 *
 * export async function generateStaticParams() {
 *   return [
 *     { id: '1' },
 *     { id: '2' },
 *   ];
 * }
 *
 * export const dynamicParams = true; // Allow other params to generate on demand
 * export const revalidate = ISR_REVALIDATE.NORMAL;
 */

/**
 * Helper to create ISR params for dynamic routes
 */
export function createISRParams<T extends Record<string, string>>(
    items: T[],
    keyName: keyof T
): Array<Record<string, string>> {
    return items.map(item => ({
        [String(keyName)]: String(item[keyName]),
    }));
}

/**
 * Fetch data with ISR caching
 * Use in generateStaticParams or getStaticProps equivalent
 */
export async function fetchWithISRCache<T>(
    url: string,
    options?: {
        revalidate?: number;
        tags?: string[];
    }
): Promise<T> {
    const { revalidate = ISR_REVALIDATE.NORMAL, tags = [] } = options || {};

    try {
        const response = await fetch(url, {
            next: {
                revalidate,
                tags,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error(`ISR Cache fetch failed for ${url}:`, error);
        throw error;
    }
}

/**
 * Example: How to use ISR in a dynamic route
 *
 * // src/app/brand-profile/[id]/page.jsx
 *
 * import { ISR_REVALIDATE, fetchWithISRCache } from '@/utils/isr';
 *
 * export async function generateStaticParams() {
 *   const brands = await fetchWithISRCache<Array<{ id: string }>>(
 *     'https://api.example.com/brands',
 *     { revalidate: ISR_REVALIDATE.SLOW }
 *   );
 *
 *   return brands.map(brand => ({
 *     id: brand.id,
 *   }));
 * }
 *
 * export const dynamicParams = true;
 * export const revalidate = ISR_REVALIDATE.NORMAL;
 *
 * export default async function Page({ params }) {
 *   return <BrandProfile brandId={params.id} />;
 * }
 */

/**
 * On-demand revalidation helper
 * Use in API routes to manually trigger revalidation
 *
 * // pages/api/revalidate.js
 * export default async function handler(req, res) {
 *   if (req.query.secret !== process.env.REVALIDATE_SECRET) {
 *     return res.status(401).json({ message: 'Invalid token' });
 *   }
 *
 *   try {
 *     await res.revalidate('/brand-profile/[id]');
 *     return res.json({ revalidated: true });
 *   } catch (err) {
 *     return res.status(500).send('Error revalidating');
 *   }
 * }
 */

export const onDemandRevalidateExample = `
// API Route: pages/api/revalidate.ts
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret');

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { message: 'Invalid token' },
      { status: 401 }
    );
  }

  try {
    const tag = request.nextUrl.searchParams.get('tag');

    if (tag) {
      revalidateTag(tag);
    }

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json(
      { message: 'Error revalidating' },
      { status: 500 }
    );
  }
}
`;

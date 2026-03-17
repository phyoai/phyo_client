import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route: GET /api/payments/plans
 *
 * Fetches available subscription plans
 * Returns cached plans or fetches from backend
 */

// Default plans cache
const DEFAULT_PLANS = {
    success: true,
    data: [
        {
            id: 'free',
            name: 'Free',
            displayName: 'Free Plan',
            price: '$0',
            priceMonthly: '$0',
            priceAnnually: '$0',
            description: 'Get started with basic features',
            features: [
                'Browse campaigns',
                'View influencer profiles',
                'Limited messaging',
                'Basic analytics',
            ],
            limits: {
                campaigns: 0,
                applications: 10,
                messages: 20,
            },
            recommended: false,
        },
        {
            id: 'silver',
            name: 'Silver',
            displayName: 'Silver Plan',
            price: '$29',
            priceMonthly: '$29/month',
            priceAnnually: '$290/year',
            description: 'Perfect for growing brands',
            features: [
                'Up to 5 campaigns',
                'Advanced search filters',
                'Unlimited messaging',
                'Campaign analytics',
                'Influencer insights',
                'Priority support',
            ],
            limits: {
                campaigns: 5,
                applications: 100,
                messages: -1,
            },
            recommended: true,
        },
        {
            id: 'gold',
            name: 'Gold',
            displayName: 'Gold Plan',
            price: '$79',
            priceMonthly: '$79/month',
            priceAnnually: '$790/year',
            description: 'For established businesses',
            features: [
                'Unlimited campaigns',
                'Advanced analytics',
                'Custom audience targeting',
                'Dedicated account manager',
                'API access',
                'Advanced reporting',
            ],
            limits: {
                campaigns: -1,
                applications: -1,
                messages: -1,
            },
            recommended: false,
        },
    ]
};

export async function GET(request: NextRequest) {
    try {
        // Try to fetch from backend
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.phyo.ai/api';

        const response = await fetch(`${backendUrl}/payments/plans`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            return NextResponse.json(data);
        }
    } catch (error) {
        console.error('Error fetching plans from backend:', error);
    }

    // Return default plans if backend fails
    return NextResponse.json(DEFAULT_PLANS);
}

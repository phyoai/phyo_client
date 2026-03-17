import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route: GET /api/payments/current-plan
 *
 * Fetches the current user's subscription plan
 * Proxies request to backend or returns default response
 */
export async function GET(request: NextRequest) {
    try {
        // Get auth token from request headers
        const authHeader = request.headers.get('authorization');

        if (!authHeader) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Proxy to backend API
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.phyo.ai/api';

        const response = await fetch(`${backendUrl}/payments/current-plan`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader,
            },
        });

        if (!response.ok) {
            // If backend endpoint doesn't exist, return default response
            if (response.status === 404) {
                return NextResponse.json(
                    {
                        success: true,
                        data: {
                            currentPlan: null,
                            status: 'free',
                            message: 'No active subscription'
                        }
                    },
                    { status: 200 }
                );
            }

            throw new Error(`Backend responded with ${response.status}`);
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching user plan:', error);

        // Return fallback response
        return NextResponse.json(
            {
                success: true,
                data: {
                    currentPlan: null,
                    status: 'free',
                    message: 'Unable to fetch plan'
                }
            },
            { status: 200 }
        );
    }
}

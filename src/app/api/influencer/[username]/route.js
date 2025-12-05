import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { username } = params;

    if (!username) {
      return NextResponse.json(
        { success: false, error: 'Username is required' },
        { status: 400 }
      );
    }

    // Fetch from your backend API
    const response = await fetch(
      `https://api.phyo.ai/api/ask/details?userName=${username}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication token if needed
          // 'Authorization': `Bearer ${process.env.API_TOKEN}`
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch influencer details');
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching influencer details:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch influencer details' 
      },
      { status: 500 }
    );
  }
}

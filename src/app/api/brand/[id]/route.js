import { NextResponse } from 'next/server';

export async function GET(_, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Brand ID is required' },
        { status: 400 }
      );
    }

    // Fetch from your backend API
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://phyo-node-server-586564333800.us-central1.run.app/api';
    const url = `${apiBaseUrl}/brands/${id}`;

    console.log('Fetching brand details from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    console.log('API Response Status:', response.status);
    console.log('API Response Data:', data);

    if (!response.ok) {
      throw new Error(data?.error || data?.message || 'Failed to fetch brand details');
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching brand details:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch brand details'
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';

function getBackendBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL || 'https://api.phyo.ai/api';
}

async function proxyRequest(request: NextRequest, pathSegments: string[]) {
  const backendBaseUrl = getBackendBaseUrl().replace(/\/$/, '');
  const backendUrl = `${backendBaseUrl}/auth/${pathSegments.join('/')}`;
  const headers = new Headers(request.headers);

  headers.delete('host');
  headers.delete('content-length');

  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: 'manual',
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = await request.text();
  }

  const response = await fetch(backendUrl, init);
  const responseBody = await response.arrayBuffer();
  const proxiedResponse = new NextResponse(responseBody, {
    status: response.status,
    statusText: response.statusText,
  });

  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'set-cookie') {
      proxiedResponse.headers.append(key, value);
      return;
    }

    if (key.toLowerCase() !== 'content-encoding' && key.toLowerCase() !== 'transfer-encoding') {
      proxiedResponse.headers.set(key, value);
    }
  });

  return proxiedResponse;
}

export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const params = await context.params;
  return proxyRequest(request, params.path);
}

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const params = await context.params;
  return proxyRequest(request, params.path);
}

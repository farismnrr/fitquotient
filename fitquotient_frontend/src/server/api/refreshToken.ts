'use server';

import { cookies } from 'next/headers';
import type { RefreshTokenResponse } from '@/types/auth';
import type { ApiResponse } from '@/types/api';

export async function refreshAccessToken(): Promise<ApiResponse<RefreshTokenResponse>> {
  const apiUrl = process.env.URL_CORE;
  const apiKey = process.env.URL_API_KEY;
  
  // Get the refresh token from cookies
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken');
  
  if (!refreshToken) {
    throw new Error('No refresh token found');
  }

  const response = await fetch(`${apiUrl}/users/refresh`, {
    method: 'GET',
    headers: {
      'X-API-KEY': apiKey || '',
      'Cookie': `refreshToken=${refreshToken.value}`,
    },
    credentials: 'include',
  });

  const result: ApiResponse<RefreshTokenResponse> = await response.json();
  
  if (!result.is_success) {
    throw new Error(JSON.stringify(result));
  }
  
  return result;
}

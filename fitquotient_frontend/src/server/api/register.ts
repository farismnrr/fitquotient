'use server';

import type { RegisterData } from '@/types/auth';
import type { ApiResponse } from '@/types/api';

export async function registerUser(data: RegisterData): Promise<ApiResponse> {
  const apiUrl = process.env.URL_CORE;
  const apiKey = process.env.URL_API_KEY;

  const response = await fetch(`${apiUrl}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': apiKey || '',
    },
    body: JSON.stringify(data),
  });

  const result: ApiResponse = await response.json();
  return result;
}

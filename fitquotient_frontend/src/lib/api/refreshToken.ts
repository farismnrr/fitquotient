import { refreshAccessToken as refreshAccessTokenAction } from '@/server/api/refreshToken';
import type { RefreshTokenResponse } from '@/types/auth';
import type { ApiResponse } from '@/types/api';

export async function refreshAccessToken(): Promise<ApiResponse<RefreshTokenResponse>> {
  try {
    const result = await refreshAccessTokenAction();
    return result;
  } catch (error) {
    if (error instanceof Error) {
      try {
        const parsedError = JSON.parse(error.message);
        throw parsedError;
      } catch {
        throw new Error(error.message);
      }
    }
    throw error;
  }
}

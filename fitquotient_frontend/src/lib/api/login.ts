import { loginUser as loginUserAction } from '@/server/api/login';
import type { LoginData, LoginResponse } from '@/types/auth';
import type { ApiResponse } from '@/types/api';

export async function loginUser(data: LoginData): Promise<ApiResponse<LoginResponse>> {
  const result = await loginUserAction(data);
  return result;
}

import { registerUser as registerUserAction } from '@/server/api/register';
import type { RegisterData } from '@/types/auth';
import type { ApiResponse } from '@/types/api';

export async function registerUser(data: RegisterData): Promise<ApiResponse> {
  const result = await registerUserAction(data);
  return result;
}

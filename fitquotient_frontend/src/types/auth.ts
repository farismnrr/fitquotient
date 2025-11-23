export interface RegisterData {
  full_name: string;
  email: string;
  username: string;
  password: string;
  confirm_password: string;
  role: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
}

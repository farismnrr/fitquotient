import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  clearAccessToken: () => void;
  getAccessToken: () => string | null;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  
  setAccessToken: (token: string) => {
    set({ accessToken: token });
  },
  
  clearAccessToken: () => {
    set({ accessToken: null });
  },
  
  getAccessToken: () => {
    return get().accessToken;
  },
}));

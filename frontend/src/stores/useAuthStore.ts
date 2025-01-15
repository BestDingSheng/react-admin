import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as loginApi } from '@/services/user';
import type { User } from '@/types/user';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      login: async (username: string, password: string) => {
        try {
          const { result } = await loginApi({ username, password });
          if (result && result.access_token && result.user) {
            set({
              token: result.access_token,
              user: result.user,
              isAuthenticated: true,
            });
          } else {
            throw new Error('登录响应数据格式错误');
          }
        } catch (error: any) {
          console.error('Login error:', error);
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('auth-storage');
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore; 
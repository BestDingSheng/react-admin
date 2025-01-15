import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as loginApi, getCurrentUser } from '@/services/user';
import type { User } from '@/types/user';

interface AuthState {
  token: string | null;
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  fetchCurrentUser: () => Promise<void>;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,

      login: async (username: string, password: string) => {
        try {
          const { result } = await loginApi({ username, password });
          if (result && result.access_token) {
            set({ token: result.access_token });
            // 登录后立即获取用户信息
            const userResponse = await getCurrentUser();
            if (userResponse.result) {
              set({ user: userResponse.result });
            }
          } else {
            throw new Error('登录响应数据格式错误');
          }
        } catch (error: any) {
          console.error('Login error:', error);
          throw error;
        }
      },

      logout: () => {
        set({
          token: null,
          user: null,
        });
      },

      fetchCurrentUser: async () => {
        try {
          const { result } = await getCurrentUser();
          if (result) {
            set({ user: result });
          }
        } catch (error) {
          console.error('Fetch current user error:', error);
          // 如果获取用户信息失败，清除登录状态
          set({ token: null, user: null });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }), // 只持久化 token
    }
  )
);

export default useAuthStore; 
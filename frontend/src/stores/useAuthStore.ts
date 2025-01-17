import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as loginApi, getCurrentUser } from '@/services/user';
import type { User } from '@/types/user';

interface CurrentUserResponse {
  user: User;
  menus: any[];
}

interface AuthState {
  token: string | null;
  user: User | null;
  userMenus: any[];
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  fetchCurrentUser: () => Promise<void>;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      userMenus: [],
      loading: false,
      login: async (username: string, password: string) => {
        try {
          const { result } = await loginApi({ username, password });
         
          if (result && result.access_token) {
            set({ token: result.access_token });
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
          set({ loading: true });
          const response = await getCurrentUser();
          if (response.result && 'user' in response.result && 'menus' in response.result) {
            const { user, menus } = response.result as CurrentUserResponse;
            set({ user, userMenus: menus });
          }
          
        } catch (error) {
          console.error('Fetch current user error:', error);
          // 如果获取用户信息失败，清除登录状态
          set({ token: null, user: null });
        } finally {
          set({ loading: false });
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
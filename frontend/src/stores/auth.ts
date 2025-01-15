import { create } from 'zustand';
import { getCurrentUser } from '../services/auth';

interface AuthState {
  token: string | null;
  user: any | null;
  userMenus: any[];
  setToken: (token: string) => void;
  setUser: (user: any) => void;
  setUserMenus: (menus: any[]) => void;
  logout: () => void;
  fetchCurrentUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  user: null,
  userMenus: [],
  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token });
  },
  setUser: (user) => set({ user }),
  setUserMenus: (menus) => set({ userMenus: menus }),
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null, userMenus: [] });
  },
  fetchCurrentUser: async () => {
    try {
      const response = await getCurrentUser();
      if (response.code === 0) {
      
        set({ 
          user: response.result.user,
          userMenus: response.result.menus,
        });
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
    }
  },
})); 
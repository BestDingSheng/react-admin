import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import request from '../utils/request';

interface User {
  id: number;
  username: string;
  email: string;
  isActive: boolean;
}

interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

interface LoginResponse {
  access_token: string;
  user: User;
}

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
          const response = await request.post<ApiResponse<LoginResponse>>('/auth/login', {
            username,
            password,
          });

          
          const { access_token, user } = response.result;
          
          // 设置 axios 默认 headers
          request.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

          set({
            token: access_token,
            user,
            isAuthenticated: true,
          });
        } catch (error: any) {
          if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
          }
          throw error;
        }
      },

      logout: () => {
        // 清除 axios 默认 headers
        delete request.defaults.headers.common['Authorization'];
        
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'auth-storage', // localStorage 中的 key
    }
  )
);

export default useAuthStore; 
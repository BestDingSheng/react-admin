import request from '../utils/request';
import { useAuthStore } from '../stores/auth';

export interface LoginParams {
  username: string;
  password: string;
}

export interface RegisterParams {
  username: string;
  email: string;
  password: string;
}

interface AuthResponse {
  access_token: string;
  user: any;
}

export async function login(params: LoginParams) {
  const response = await request.post<AuthResponse>('/auth/login', params);
  if (response.data?.access_token) {
    // 保存 token
    useAuthStore.getState().setToken(response.data.access_token);
    // 获取用户信息
    await useAuthStore.getState().fetchCurrentUser();
  }
  return response;
}

export async function register(params: RegisterParams) {
  const response = await request.post<AuthResponse>('/auth/register', params);
  if (response.data?.access_token) {
    // 保存 token
    useAuthStore.getState().setToken(response.data.access_token);
    // 获取用户信息
    await useAuthStore.getState().fetchCurrentUser();
  }
  return response;
}

export async function getCurrentUser() {
  return request.get('/auth/current');
} 
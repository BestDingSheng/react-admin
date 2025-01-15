import request from '@/utils/request';
import type { ApiResponse } from '@/types/api';
import type { User } from '@/types/user';

export interface LoginParams {
  username: string;
  password: string;
}

export async function login(data: LoginParams) {
  return request.post<{ token: string; user: User }>('/auth/login', data);
}

export async function register(data: LoginParams) {
  return request.post<User>('/auth/register', data);
}

export async function getCurrentUser() {
  return request.get<User>('/users/current');
} 
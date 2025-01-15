import request from '@/utils/request';
import type { ApiResponse } from '@/types/api';
import type { User } from '@/types/user';

export interface LoginParams {
  username: string;
  password: string;
}

export async function login(data: LoginParams) {
  return request.post<{ access_token: string; user: User }>('/auth/login', data);
}

export async function register(data: LoginParams) {
  return request.post<User>('/auth/register', data);
}

export async function getCurrentUser() {
  return request.get<User>('/users/current');
}

export interface UserData extends User {
  id: number;
  username: string;
  email: string;
  isActive: boolean;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserQueryParams {
  userId?: number;
  username?: string;
  email?: string;
}

export async function getUsers(params?: UserQueryParams) {
  return request.get<UserData[]>('/users', { params });
}

export async function updateUserStatus(id: number, isActive: boolean) {
  return request.patch<UserData>(`/users/${id}/status`, { isActive });
}

export async function deleteUser(id: number) {
  return request.delete<void>(`/users/${id}`);
}

export async function updateUser(id: number, data: Partial<UserData>) {
  return request.patch<UserData>(`/users/${id}`, data);
} 
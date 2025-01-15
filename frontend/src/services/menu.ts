import request from '@/utils/request';
import type { ApiResponse } from '@/types/api';
import type { Menu } from '@/types/menu';

export async function getMenus() {
  return request.get<Menu[]>('/menus');
}

export async function createMenu(data: Partial<Menu>) {
  return request.post<Menu>('/menus', data);
}

export async function updateMenu(id: number, data: Partial<Menu>) {
  return request.put<Menu>(`/menus/${id}`, data);
}

export async function deleteMenu(id: number) {
  return request.delete<null>(`/menus/${id}`);
}

export async function getRoleMenus(roleId: number) {
  return request.get<Menu[]>(`/roles/${roleId}/menus`);
} 
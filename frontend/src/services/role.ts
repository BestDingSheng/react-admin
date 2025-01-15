import request from '@/utils/request';
import type { ApiResponse } from '@/types/api';
import type { Role } from '@/types/role';
import type { Menu } from '@/types/menu';

export async function getRoles() {
  return request.get<Role[]>('/roles');
}

export async function createRole(data: Partial<Role>) {
  return request.post<Role>('/roles', data);
}

export async function updateRole(id: number, data: Partial<Role>) {
  return request.put<Role>(`/roles/${id}`, data);
}

export async function deleteRole(id: number) {
  return request.delete<null>(`/roles/${id}`);
}

export async function assignPermissions(roleId: number, menuIds: number[]) {
  return request.post<null>(`/roles/${roleId}/permissions`, { menuIds });
}

export async function updateRoleMenus(roleId: number, menuIds: number[]) {
  return request.patch<Role>(`/roles/${roleId}/menus`, { menuIds });
}

export async function getMenus() {
  return request.get<Menu[]>('/menus');
} 
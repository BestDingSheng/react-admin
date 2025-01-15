import request from '../utils/request';

export interface RoleData {
  id: number;
  roleName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  status: boolean;
}

export interface RoleQuery {
  roleId?: string;
  roleName?: string;
}

interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

// 获取角色列表
export const getRoles = (params: RoleQuery) => {
  return request.get<ApiResponse<RoleData[]>>('/roles', { params });
};

// 创建角色
export const createRole = (data: Partial<RoleData>) => {
  return request.post<ApiResponse<RoleData>>('/roles', data);
};

// 更新角色
export const updateRole = (id: number, data: Partial<RoleData>) => {
  return request.put<ApiResponse<RoleData>>(`/roles/${id}`, data);
};

// 删除角色
export const deleteRole = (id: number) => {
  return request.delete<ApiResponse<void>>(`/roles/${id}`);
}; 
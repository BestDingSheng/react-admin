import request from '../utils/request';
import { MenuItem } from '../types/menu';

interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

export const getMenuList = () => {
  return request<ApiResponse<MenuItem[]>>('/menus').then(res => res.result);
};

export const createMenu = (data: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>) => {
  return request<ApiResponse<MenuItem>>('/menus', {
    method: 'POST',
    data,
  }).then(res => res.result);
};

export const updateMenu = (id: number, data: Partial<MenuItem>) => {
  return request<ApiResponse<MenuItem>>(`/menus/${id}`, {
    method: 'PUT',
    data,
  }).then(res => res.result);
};

export const deleteMenu = (id: number) => {
  return request<ApiResponse<void>>(`/menus/${id}`, {
    method: 'DELETE',
  }).then(res => res.result);
}; 
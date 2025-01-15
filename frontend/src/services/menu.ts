import request from '../utils/request';
import { MenuItem } from '@/types/menu';

export const getMenuList = () => {
  return request<MenuItem[]>('/menus');
};

export const createMenu = (data: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>) => {
  return request<MenuItem>('/menus', {
    method: 'POST',
    data,
  });
};

export const updateMenu = (id: number, data: Partial<MenuItem>) => {
  return request<MenuItem>(`/menus/${id}`, {
    method: 'PUT',
    data,
  });
};

export const deleteMenu = (id: number) => {
  return request<void>(`/menus/${id}`, {
    method: 'DELETE',
  });
}; 
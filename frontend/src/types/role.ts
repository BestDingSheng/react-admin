import type { Menu } from './menu';

export interface Role {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  menus: Menu[];
  createdAt: string;
  updatedAt: string;
}

export interface RoleQuery {
  id?: string;
  name?: string;
} 
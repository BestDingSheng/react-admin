export interface MenuItem {
  id: number;
  name: string;
  path?: string;
  icon?: string;
  parentId: number | null;
  order: number;
  children?: MenuItem[];
  status: 'enabled' | 'disabled';
  type: 'menu' | 'button';
  component?: string;
  permission?: string;
  createdAt?: string;
  updatedAt?: string;
} 
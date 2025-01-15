export interface Menu {
  id: number;
  name: string;
  path?: string;
  icon?: string;
  isActive: boolean;
  sort: number;
  children?: Menu[];
  createdAt: string;
  updatedAt: string;
} 
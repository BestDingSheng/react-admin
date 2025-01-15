export interface Menu {
  id: number;
  parentId: number | null;
  name: string;
  path: string;
  component?: string;
  icon?: string;
  sort: number;
  status: boolean;
  isExternal: boolean;
  createdAt: string;
  updatedAt: string;
  children?: Menu[];
} 
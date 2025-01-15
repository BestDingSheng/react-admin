export interface Role {
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
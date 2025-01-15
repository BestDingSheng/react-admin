export interface Role {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoleQuery {
  roleId?: string;
  roleName?: string;
} 
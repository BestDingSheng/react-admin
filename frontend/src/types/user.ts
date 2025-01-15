import type { Role } from './role';

export interface User {
  id: number;
  username: string;
  email: string;
  isActive: boolean;
  roles: Role[];
  createdAt: string;
  updatedAt: string;
} 
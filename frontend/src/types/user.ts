export interface User {
  id: number;
  username: string;
  email: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  roles?: string[];
} 
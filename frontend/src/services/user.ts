import request from '../utils/request';

export interface RegisterParams {
  username: string;
  email: string;
  password: string;
}

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  isActive: boolean;
}

export const register = (params: RegisterParams) => {
  return request.post<UserInfo>('/users', params);
};

export const getUserInfo = () => {
  return request.get<UserInfo>('/auth/profile');
}; 
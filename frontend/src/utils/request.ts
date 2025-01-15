import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { message } from 'antd';
import type { ApiResponse } from '@/types/api';

const instance = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-storage');
    if (token) {
      try {
        const { state } = JSON.parse(token);
        if (state.token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch (error) {
        console.error('Failed to parse auth storage:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    const data = response.data;
    if (data.code === 0 || data.code === 200) {
      return data;
    } else {
      const errorMessage = data.message || '请求失败';
      message.error(errorMessage);
      return Promise.reject(new Error(errorMessage));
    }
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          message.error('未登录或登录已过期');
          localStorage.removeItem('auth-storage');
          window.location.href = '/login';
          break;
        case 403:
          message.error('没有权限访问');
          break;
        case 404:
          message.error('请求的资源不存在');
          break;
        case 500:
          message.error('服务器错误');
          break;
        default:
          message.error(error.response.data?.message || '请求失败');
      }
    } else if (error.request) {
      message.error('网络错误，请检查网络连接');
    } else {
      message.error(error.message || '请求失败');
    }
    return Promise.reject(error);
  }
);

const request = {
  get: <T>(url: string, config?: AxiosRequestConfig) => 
    instance.get<any, ApiResponse<T>>(url, config),
  
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    instance.post<any, ApiResponse<T>>(url, data, config),
  
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    instance.put<any, ApiResponse<T>>(url, data, config),
  
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    instance.delete<any, ApiResponse<T>>(url, config),
    
  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    instance.patch<any, ApiResponse<T>>(url, data, config),
};

export default request; 
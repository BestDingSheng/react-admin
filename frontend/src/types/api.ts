export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

// 分页响应数据接口
export interface PaginatedApiResponse<T> extends ApiResponse<{
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}> {} 
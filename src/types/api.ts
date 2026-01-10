export interface ApiResponse<T = void> {
  status: number;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  status: number;
  message: string;
  data: T[];
  meta: {
    page: number;
    page_size: number;
    total: number;
    total_pages?: number; 
  };
}
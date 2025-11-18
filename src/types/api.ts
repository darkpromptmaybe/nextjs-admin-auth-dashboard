// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination?: PaginationMeta;
}

// Request validation types
export interface ValidatedRequest<T = any> {
  body?: T;
  query?: Record<string, string | string[]>;
  params?: Record<string, string>;
}

// Error types
export enum ApiErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  BAD_REQUEST = 'BAD_REQUEST'
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: ApiErrorCode,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
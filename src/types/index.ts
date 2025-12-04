export interface CopperxConfig {
  apiKey: string;
  baseURL?: string;
  timeout?: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Metadata {
  [key: string]: unknown;
}

export interface Timestamps {
  createdAt: string;
  updatedAt: string;
}


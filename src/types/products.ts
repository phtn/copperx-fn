import type { PaginationParams, PaginatedResponse, Timestamps, Metadata } from './index';

export interface Product extends Timestamps {
  id: string;
  name: string;
  description?: string;
  image?: string;
  isActive: boolean;
  metadata?: Metadata;
}

export interface CreateProductParams {
  name: string;
  description?: string;
  image?: string;
  metadata?: Metadata;
}

export interface CreateProductResponse {
  product: Product;
}

export interface ListProductsParams extends PaginationParams {
  isActive?: boolean;
  search?: string;
}

export interface ListProductsResponse extends PaginatedResponse<Product> {}

export interface ProductResponse {
  product: Product;
}

export interface UpdateProductParams {
  name?: string;
  description?: string;
  image?: string;
  metadata?: Metadata;
}

export interface UpdateProductResponse {
  product: Product;
}


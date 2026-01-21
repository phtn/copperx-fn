import { HTTPClient } from '../utils/http';
import type {
  CreateProductParams,
  CreateProductResponse,
  ListProductsParams,
  ListProductsResponse,
  ProductResponse,
  UpdateProductParams,
  UpdateProductResponse,
} from '../types/products';

export function createProductsResource(client: HTTPClient) {
  return {
    async create(params: CreateProductParams): Promise<CreateProductResponse> {
      return client.post<CreateProductResponse>('/api/v1/products', params);
    },

    async list(params?: ListProductsParams): Promise<ListProductsResponse> {
      return client.get<ListProductsResponse>('/api/v1/products', { params });
    },

    async get(id: string): Promise<ProductResponse> {
      return client.get<ProductResponse>(`/api/v1/products/${id}`);
    },

    async update(
      id: string,
      params: UpdateProductParams
    ): Promise<UpdateProductResponse> {
      return client.put<UpdateProductResponse>(`/api/v1/products/${id}`, params);
    },

    async delete(id: string): Promise<void> {
      return client.delete<void>(`/api/v1/products/${id}`);
    },

    async activate(id: string): Promise<ProductResponse> {
      return client.put<ProductResponse>(`/api/v1/products/${id}/activate`);
    },

    async deactivate(id: string): Promise<ProductResponse> {
      return client.put<ProductResponse>(`/api/v1/products/${id}/deactivate`);
    },
  };
}


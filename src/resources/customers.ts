import { HTTPClient } from '../utils/http';
import type {
  CreateCustomerParams,
  CreateCustomerResponse,
  ListCustomersParams,
  ListCustomersResponse,
  CustomerResponse,
  UpdateCustomerParams,
  UpdateCustomerResponse,
} from '../types/customers';

export function createCustomersResource(client: HTTPClient) {
  return {
    async create(
      params: CreateCustomerParams
    ): Promise<CreateCustomerResponse> {
      return client.post<CreateCustomerResponse>('/api/v1/customers', params);
    },

    async list(params?: ListCustomersParams): Promise<ListCustomersResponse> {
      return client.get<ListCustomersResponse>('/api/v1/customers', { params });
    },

    async get(id: string): Promise<CustomerResponse> {
      return client.get<CustomerResponse>(`/api/v1/customers/${id}`);
    },

    async update(
      id: string,
      params: UpdateCustomerParams
    ): Promise<UpdateCustomerResponse> {
      return client.put<UpdateCustomerResponse>(`/api/v1/customers/${id}`, params);
    },

    async delete(id: string): Promise<void> {
      return client.delete<void>(`/api/v1/customers/${id}`);
    },
  };
}


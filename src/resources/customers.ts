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
      return client.post<CreateCustomerResponse>('/customers', params);
    },

    async list(params?: ListCustomersParams): Promise<ListCustomersResponse> {
      return client.get<ListCustomersResponse>('/customers', { params });
    },

    async get(id: string): Promise<CustomerResponse> {
      return client.get<CustomerResponse>(`/customers/${id}`);
    },

    async update(
      id: string,
      params: UpdateCustomerParams
    ): Promise<UpdateCustomerResponse> {
      return client.put<UpdateCustomerResponse>(`/customers/${id}`, params);
    },

    async delete(id: string): Promise<void> {
      return client.delete<void>(`/customers/${id}`);
    },
  };
}


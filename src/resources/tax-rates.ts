import { HTTPClient } from '../utils/http';
import type {
  ListTaxRatesParams,
  ListTaxRatesResponse,
  CreateTaxRateParams,
  CreateTaxRateResponse,
  TaxRateResponse,
  UpdateTaxRateParams,
  UpdateTaxRateResponse,
} from '../types/tax-rates';

export function createTaxRatesResource(client: HTTPClient) {
  return {
    async list(params?: ListTaxRatesParams): Promise<ListTaxRatesResponse> {
      return client.get<ListTaxRatesResponse>('/api/v1/tax-rates', { params });
    },

    async create(
      params: CreateTaxRateParams
    ): Promise<CreateTaxRateResponse> {
      return client.post<CreateTaxRateResponse>('/api/v1/tax-rates', params);
    },

    async get(id: string): Promise<TaxRateResponse> {
      return client.get<TaxRateResponse>(`/api/v1/tax-rates/${id}`);
    },

    async update(
      id: string,
      params: UpdateTaxRateParams
    ): Promise<UpdateTaxRateResponse> {
      return client.put<UpdateTaxRateResponse>(`/api/v1/tax-rates/${id}`, params);
    },

    async activate(id: string): Promise<TaxRateResponse> {
      return client.put<TaxRateResponse>(`/api/v1/tax-rates/${id}/activate`);
    },

    async deactivate(id: string): Promise<TaxRateResponse> {
      return client.put<TaxRateResponse>(`/api/v1/tax-rates/${id}/deactivate`);
    },
  };
}


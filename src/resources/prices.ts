import { HTTPClient } from '../utils/http';
import type {
  CreatePriceParams,
  CreatePriceResponse,
  ListPricesParams,
  ListPricesResponse,
  PriceResponse,
  UpdatePriceParams,
  UpdatePriceResponse,
} from '../types/prices';

export function createPricesResource(client: HTTPClient) {
  return {
    async create(params: CreatePriceParams): Promise<CreatePriceResponse> {
      return client.post<CreatePriceResponse>('/prices', params);
    },

    async list(params?: ListPricesParams): Promise<ListPricesResponse> {
      return client.get<ListPricesResponse>('/prices', { params });
    },

    async get(id: string): Promise<PriceResponse> {
      return client.get<PriceResponse>(`/prices/${id}`);
    },

    async update(
      id: string,
      params: UpdatePriceParams
    ): Promise<UpdatePriceResponse> {
      return client.put<UpdatePriceResponse>(`/prices/${id}`, params);
    },
  };
}


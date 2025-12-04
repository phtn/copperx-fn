import { HTTPClient } from '../utils/http';
import type {
  ListChainsParams,
  ListChainsResponse,
  ChainResponse,
} from '../types/chains';

export function createChainsResource(client: HTTPClient) {
  return {
    async list(params?: ListChainsParams): Promise<ListChainsResponse> {
      return client.get<ListChainsResponse>('/chains', { params });
    },

    async get(id: string): Promise<ChainResponse> {
      return client.get<ChainResponse>(`/chains/${id}`);
    },
  };
}


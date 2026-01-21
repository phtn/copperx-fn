import { HTTPClient } from '../utils/http';
import type {
  ListAssetsParams,
  ListAssetsResponse,
  AssetResponse,
} from '../types/assets';

export function createAssetsResource(client: HTTPClient) {
  return {
    async list(params?: ListAssetsParams): Promise<ListAssetsResponse> {
      return client.get<ListAssetsResponse>('/api/v1/assets', { params });
    },

    async get(id: string): Promise<AssetResponse> {
      return client.get<AssetResponse>(`/api/v1/assets/${id}`);
    },
  };
}


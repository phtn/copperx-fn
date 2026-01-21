import { HTTPClient } from '../utils/http';
import type { ConstantsResponse } from '../types/constants';

export function createConstantsResource(client: HTTPClient) {
  return {
    async getPrices(): Promise<ConstantsResponse> {
      return client.get<ConstantsResponse>('/api/v1/constants/prices');
    },
  };
}


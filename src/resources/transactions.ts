import { HTTPClient } from '../utils/http';
import type {
  ListTransactionsParams,
  ListTransactionsResponse,
} from '../types/transactions';

export function createTransactionsResource(client: HTTPClient) {
  return {
    async list(
      params?: ListTransactionsParams
    ): Promise<ListTransactionsResponse> {
      return client.get<ListTransactionsResponse>('/api/v1/transactions', {
        params,
      });
    },
  };
}


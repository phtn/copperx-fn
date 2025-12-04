import { HTTPClient } from '../utils/http';
import type {
  CreateCheckoutSessionParams,
  CreateCheckoutSessionResponse,
  ListCheckoutSessionsParams,
  ListCheckoutSessionsResponse,
  CheckoutSessionResponse,
  CheckoutSessionStatusResponse,
  RecoverCheckoutSessionParams,
  CompleteCheckoutSessionParams,
  ExportCheckoutSessionsParams,
} from '../types/checkout';

export function createCheckoutSessionsResource(client: HTTPClient) {
  return {
    async create(
      params: CreateCheckoutSessionParams
    ): Promise<CreateCheckoutSessionResponse> {
      return client.post<CreateCheckoutSessionResponse>(
        '/checkout-sessions',
        params
      );
    },

    async list(
      params?: ListCheckoutSessionsParams
    ): Promise<ListCheckoutSessionsResponse> {
      return client.get<ListCheckoutSessionsResponse>('/checkout-sessions', {
        params,
      });
    },

    async recoverByHash(
      sessionId: string,
      params: RecoverCheckoutSessionParams
    ): Promise<CheckoutSessionResponse> {
      return client.post<CheckoutSessionResponse>(
        `/checkout-sessions/${sessionId}/recover`,
        params
      );
    },

    async export(
      params?: ExportCheckoutSessionsParams
    ): Promise<Blob | unknown> {
      return client.get<Blob | unknown>('/checkout-sessions/export', {
        params,
        responseType: 'blob',
      });
    },

    async get(id: string): Promise<CheckoutSessionResponse> {
      return client.get<CheckoutSessionResponse>(`/checkout-sessions/${id}`);
    },

    async getStatus(id: string): Promise<CheckoutSessionStatusResponse> {
      return client.get<CheckoutSessionStatusResponse>(
        `/checkout-sessions/${id}/status`
      );
    },

    async recover(
      id: string,
      params: RecoverCheckoutSessionParams
    ): Promise<CheckoutSessionResponse> {
      return client.post<CheckoutSessionResponse>(
        `/checkout-sessions/${id}/recover`,
        params
      );
    },

    async complete(
      id: string,
      params: CompleteCheckoutSessionParams
    ): Promise<CheckoutSessionResponse> {
      return client.post<CheckoutSessionResponse>(
        `/checkout-sessions/${id}/complete`,
        params
      );
    },
  };
}


import { HTTPClient } from '../utils/http';
import type {
  ListWebhookEndpointsParams,
  ListWebhookEndpointsResponse,
  CreateWebhookEndpointParams,
  CreateWebhookEndpointResponse,
  WebhookEndpointResponse,
  UpdateWebhookEndpointParams,
  UpdateWebhookEndpointResponse,
  RegenerateWebhookSecretResponse,
  TestWebhookParams,
  TestWebhookResponse,
} from '../types/webhooks';

export function createWebhooksResource(client: HTTPClient) {
  return {
    async list(
      params?: ListWebhookEndpointsParams
    ): Promise<ListWebhookEndpointsResponse> {
      return client.get<ListWebhookEndpointsResponse>('/api/v1/webhook-endpoints', {
        params,
      });
    },

    async create(
      params: CreateWebhookEndpointParams
    ): Promise<CreateWebhookEndpointResponse> {
      return client.post<CreateWebhookEndpointResponse>(
        '/api/v1/webhook-endpoints',
        params
      );
    },

    async get(id: string): Promise<WebhookEndpointResponse> {
      return client.get<WebhookEndpointResponse>(`/api/v1/webhook-endpoints/${id}`);
    },

    async update(
      id: string,
      params: UpdateWebhookEndpointParams
    ): Promise<UpdateWebhookEndpointResponse> {
      return client.put<UpdateWebhookEndpointResponse>(
        `/api/v1/webhook-endpoints/${id}`,
        params
      );
    },

    async delete(id: string): Promise<void> {
      return client.delete<void>(`/api/v1/webhook-endpoints/${id}`);
    },

    async regenerateSecret(
      id: string
    ): Promise<RegenerateWebhookSecretResponse> {
      return client.post<RegenerateWebhookSecretResponse>(
        `/api/v1/webhook-endpoints/${id}/regenerate`
      );
    },

    async test(id: string, params: TestWebhookParams): Promise<TestWebhookResponse> {
      return client.post<TestWebhookResponse>(
        `/api/v1/webhook-endpoints/${id}/test`,
        params
      );
    },
  };
}


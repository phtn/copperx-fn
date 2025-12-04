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
      return client.get<ListWebhookEndpointsResponse>('/webhook-endpoints', {
        params,
      });
    },

    async create(
      params: CreateWebhookEndpointParams
    ): Promise<CreateWebhookEndpointResponse> {
      return client.post<CreateWebhookEndpointResponse>(
        '/webhook-endpoints',
        params
      );
    },

    async get(id: string): Promise<WebhookEndpointResponse> {
      return client.get<WebhookEndpointResponse>(`/webhook-endpoints/${id}`);
    },

    async update(
      id: string,
      params: UpdateWebhookEndpointParams
    ): Promise<UpdateWebhookEndpointResponse> {
      return client.put<UpdateWebhookEndpointResponse>(
        `/webhook-endpoints/${id}`,
        params
      );
    },

    async delete(id: string): Promise<void> {
      return client.delete<void>(`/webhook-endpoints/${id}`);
    },

    async regenerateSecret(
      id: string
    ): Promise<RegenerateWebhookSecretResponse> {
      return client.post<RegenerateWebhookSecretResponse>(
        `/webhook-endpoints/${id}/regenerate`
      );
    },

    async test(id: string, params: TestWebhookParams): Promise<TestWebhookResponse> {
      return client.post<TestWebhookResponse>(
        `/webhook-endpoints/${id}/test`,
        params
      );
    },
  };
}


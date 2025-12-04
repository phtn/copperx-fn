import type { PaginationParams, PaginatedResponse, Timestamps } from './index';

export interface WebhookEndpoint extends Timestamps {
  id: string;
  url: string;
  events: string[];
  isActive: boolean;
  secret: string;
}

export interface ListWebhookEndpointsParams extends PaginationParams {
  isActive?: boolean;
}

export interface ListWebhookEndpointsResponse
  extends PaginatedResponse<WebhookEndpoint> {}

export interface CreateWebhookEndpointParams {
  url: string;
  events: string[];
}

export interface CreateWebhookEndpointResponse {
  webhookEndpoint: WebhookEndpoint;
}

export interface WebhookEndpointResponse {
  webhookEndpoint: WebhookEndpoint;
}

export interface UpdateWebhookEndpointParams {
  url?: string;
  events?: string[];
  isActive?: boolean;
}

export interface UpdateWebhookEndpointResponse {
  webhookEndpoint: WebhookEndpoint;
}

export interface RegenerateWebhookSecretResponse {
  webhookEndpoint: WebhookEndpoint;
}

export interface TestWebhookParams {
  event: string;
  payload?: Record<string, unknown>;
}

export interface TestWebhookResponse {
  success: boolean;
}


import { HTTPClient } from '../utils/http';
import type {
  ListSubscriptionsParams,
  ListSubscriptionsResponse,
  SubscriptionResponse,
  CancelSubscriptionParams,
  CancelSubscriptionResponse,
} from '../types/subscriptions';

export function createSubscriptionsResource(client: HTTPClient) {
  return {
    async list(
      params?: ListSubscriptionsParams
    ): Promise<ListSubscriptionsResponse> {
      return client.get<ListSubscriptionsResponse>('/subscriptions', {
        params,
      });
    },

    async get(id: string): Promise<SubscriptionResponse> {
      return client.get<SubscriptionResponse>(`/subscriptions/${id}`);
    },

    async cancel(
      id: string,
      params?: CancelSubscriptionParams
    ): Promise<CancelSubscriptionResponse> {
      return client.post<CancelSubscriptionResponse>(
        `/subscriptions/${id}/cancel`,
        params
      );
    },

    async resume(id: string): Promise<SubscriptionResponse> {
      return client.post<SubscriptionResponse>(`/subscriptions/${id}/resume`);
    },

    async cancelImmediately(id: string): Promise<CancelSubscriptionResponse> {
      return client.post<CancelSubscriptionResponse>(
        `/subscriptions/${id}/cancel-immediately`
      );
    },
  };
}


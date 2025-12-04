import { HTTPClient } from '../utils/http';
import type {
  CreatePaymentLinkParams,
  CreatePaymentLinkResponse,
  ListPaymentLinksParams,
  ListPaymentLinksResponse,
  PaymentLinkResponse,
  UpdatePaymentLinkParams,
  UpdatePaymentLinkResponse,
} from '../types/payment-links';

export function createPaymentLinksResource(client: HTTPClient) {
  return {
    async create(
      params: CreatePaymentLinkParams
    ): Promise<CreatePaymentLinkResponse> {
      return client.post<CreatePaymentLinkResponse>('/payment-links', params);
    },

    async list(
      params?: ListPaymentLinksParams
    ): Promise<ListPaymentLinksResponse> {
      return client.get<ListPaymentLinksResponse>('/payment-links', {
        params,
      });
    },

    async get(id: string): Promise<PaymentLinkResponse> {
      return client.get<PaymentLinkResponse>(`/payment-links/${id}`);
    },

    async update(
      id: string,
      params: UpdatePaymentLinkParams
    ): Promise<UpdatePaymentLinkResponse> {
      return client.put<UpdatePaymentLinkResponse>(
        `/payment-links/${id}`,
        params
      );
    },

    async delete(id: string): Promise<void> {
      return client.delete<void>(`/payment-links/${id}`);
    },

    async activate(id: string): Promise<PaymentLinkResponse> {
      return client.put<PaymentLinkResponse>(`/payment-links/${id}/activate`);
    },

    async deactivate(id: string): Promise<PaymentLinkResponse> {
      return client.put<PaymentLinkResponse>(`/payment-links/${id}/deactivate`);
    },
  };
}


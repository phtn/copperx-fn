import type { PaginationParams, PaginatedResponse, Timestamps, Metadata } from './index';

export interface PaymentLink extends Timestamps {
  id: string;
  name: string;
  description?: string;
  amount: number;
  currency: string;
  isActive: boolean;
  metadata?: Metadata;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CreatePaymentLinkParams {
  name: string;
  description?: string;
  amount: number;
  currency: string;
  metadata?: Metadata;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CreatePaymentLinkResponse {
  paymentLink: PaymentLink;
}

export interface ListPaymentLinksParams extends PaginationParams {
  isActive?: boolean;
}

export interface ListPaymentLinksResponse
  extends PaginatedResponse<PaymentLink> {}

export interface PaymentLinkResponse {
  paymentLink: PaymentLink;
}

export interface UpdatePaymentLinkParams {
  name?: string;
  description?: string;
  amount?: number;
  currency?: string;
  metadata?: Metadata;
  successUrl?: string;
  cancelUrl?: string;
}

export interface UpdatePaymentLinkResponse {
  paymentLink: PaymentLink;
}


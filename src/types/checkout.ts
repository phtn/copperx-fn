import type { PaginationParams, PaginatedResponse, Timestamps, Metadata } from './index';

export type CheckoutSessionStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'expired'
  | 'cancelled';

export interface CheckoutSession extends Timestamps {
  id: string;
  customerId?: string;
  amount: number;
  currency: string;
  status: CheckoutSessionStatus;
  paymentLinkId?: string;
  metadata?: Metadata;
  successUrl?: string;
  cancelUrl?: string;
  expiresAt?: string;
  transactionHash?: string;
}

export interface CreateCheckoutSessionParams {
  amount: number;
  currency: string;
  customerId?: string;
  paymentLinkId?: string;
  successUrl?: string;
  cancelUrl?: string;
  metadata?: Metadata;
  expiresAt?: string;
}

export interface CreateCheckoutSessionResponse {
  checkoutSession: CheckoutSession;
}

export interface ListCheckoutSessionsParams extends PaginationParams {
  status?: CheckoutSessionStatus;
  customerId?: string;
  paymentLinkId?: string;
}

export interface ListCheckoutSessionsResponse
  extends PaginatedResponse<CheckoutSession> {}

export interface CheckoutSessionResponse {
  checkoutSession: CheckoutSession;
}

export interface CheckoutSessionStatusResponse {
  status: CheckoutSessionStatus;
}

export interface RecoverCheckoutSessionParams {
  transactionHash: string;
}

export interface CompleteCheckoutSessionParams {
  transactionHash: string;
}

export interface ExportCheckoutSessionsParams extends PaginationParams {
  status?: CheckoutSessionStatus;
  startDate?: string;
  endDate?: string;
  format?: 'csv' | 'json';
}


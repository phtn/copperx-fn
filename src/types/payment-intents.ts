import type { Timestamps } from './index';

export interface PaymentIntent extends Timestamps {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed';
  customerId?: string;
  transactionHash?: string;
}

export interface SendPaymentReceiptParams {
  email?: string;
}

export interface SendPaymentReceiptResponse {
  success: boolean;
}

export interface MarkPaymentRefundedParams {
  refundAmount?: number;
  reason?: string;
}

export interface MarkPaymentRefundedResponse {
  paymentIntent: PaymentIntent;
}


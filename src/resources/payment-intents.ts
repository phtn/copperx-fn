import { HTTPClient } from '../utils/http';
import type {
  SendPaymentReceiptParams,
  SendPaymentReceiptResponse,
  MarkPaymentRefundedParams,
  MarkPaymentRefundedResponse,
} from '../types/payment-intents';

export function createPaymentIntentsResource(client: HTTPClient) {
  return {
    async sendReceipt(
      id: string,
      params?: SendPaymentReceiptParams
    ): Promise<SendPaymentReceiptResponse> {
      return client.post<SendPaymentReceiptResponse>(
        `/api/v1/payment-intents/${id}/receipt`,
        params
      );
    },

    async markRefunded(
      id: string,
      params?: MarkPaymentRefundedParams
    ): Promise<MarkPaymentRefundedResponse> {
      return client.post<MarkPaymentRefundedResponse>(
        `/api/v1/payment-intents/${id}/refund`,
        params
      );
    },
  };
}


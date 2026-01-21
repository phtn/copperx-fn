import { HTTPClient } from '../utils/http';
import type { PaymentSettingResponse } from '../types/payment-setting';

export function createPaymentSettingResource(client: HTTPClient) {
  return {
    async get(): Promise<PaymentSettingResponse> {
      return client.get<PaymentSettingResponse>('/api/v1/payment-setting');
    },
  };
}


import { HTTPClient } from '../utils/http';
import type { InvoiceSettingResponse } from '../types/invoice-setting';

export function createInvoiceSettingResource(client: HTTPClient) {
  return {
    async get(): Promise<InvoiceSettingResponse> {
      return client.get<InvoiceSettingResponse>('/api/v1/invoice-setting');
    },
  };
}


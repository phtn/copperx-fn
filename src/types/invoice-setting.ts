import type { Timestamps } from './index';

export interface InvoiceSetting extends Timestamps {
  id: string;
  organizationId: string;
  defaultDueDays: number;
  defaultTerms?: string;
  defaultNotes?: string;
}

export interface InvoiceSettingResponse {
  invoiceSetting: InvoiceSetting;
}


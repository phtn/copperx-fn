import type { PaginationParams, PaginatedResponse, Timestamps, Metadata } from './index';

export type InvoiceStatus =
  | 'draft'
  | 'open'
  | 'paid'
  | 'void'
  | 'uncollectible';

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitAmount: number;
  totalAmount: number;
  taxRateId?: string;
}

export interface Invoice extends Timestamps {
  id: string;
  customerId: string;
  status: InvoiceStatus;
  amount: number;
  currency: string;
  dueDate?: string;
  paidAt?: string;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  tax: number;
  total: number;
  metadata?: Metadata;
  invoiceNumber?: string;
}

export interface CreateInvoiceParams {
  customerId: string;
  lineItems: Array<{
    description: string;
    quantity: number;
    unitAmount: number;
    taxRateId?: string;
  }>;
  dueDate?: string;
  metadata?: Metadata;
}

export interface CreateInvoiceResponse {
  invoice: Invoice;
}

export interface ListInvoicesParams extends PaginationParams {
  customerId?: string;
  status?: InvoiceStatus;
}

export interface ListInvoicesResponse extends PaginatedResponse<Invoice> {}

export interface InvoiceResponse {
  invoice: Invoice;
}

export interface UpdateInvoiceParams {
  lineItems?: Array<{
    description: string;
    quantity: number;
    unitAmount: number;
    taxRateId?: string;
  }>;
  dueDate?: string;
  metadata?: Metadata;
}

export interface UpdateInvoiceResponse {
  invoice: Invoice;
}

export interface SendInvoiceParams {
  email?: string;
}

export interface MarkInvoicePaidParams {
  transactionHash?: string;
  paidAt?: string;
}


import { HTTPClient } from '../utils/http';
import type {
  CreateInvoiceParams,
  CreateInvoiceResponse,
  ListInvoicesParams,
  ListInvoicesResponse,
  InvoiceResponse,
  UpdateInvoiceParams,
  UpdateInvoiceResponse,
  SendInvoiceParams,
  MarkInvoicePaidParams,
} from '../types/invoices';

export function createInvoicesResource(client: HTTPClient) {
  return {
    async create(params: CreateInvoiceParams): Promise<CreateInvoiceResponse> {
      return client.post<CreateInvoiceResponse>('/invoices', params);
    },

    async list(params?: ListInvoicesParams): Promise<ListInvoicesResponse> {
      return client.get<ListInvoicesResponse>('/invoices', { params });
    },

    async get(id: string): Promise<InvoiceResponse> {
      return client.get<InvoiceResponse>(`/invoices/${id}`);
    },

    async update(
      id: string,
      params: UpdateInvoiceParams
    ): Promise<UpdateInvoiceResponse> {
      return client.put<UpdateInvoiceResponse>(`/invoices/${id}`, params);
    },

    async delete(id: string): Promise<void> {
      return client.delete<void>(`/invoices/${id}`);
    },

    async duplicate(id: string): Promise<CreateInvoiceResponse> {
      return client.post<CreateInvoiceResponse>(`/invoices/${id}/duplicate`);
    },

    async void(id: string): Promise<InvoiceResponse> {
      return client.post<InvoiceResponse>(`/invoices/${id}/void`);
    },

    async markUncollectible(id: string): Promise<InvoiceResponse> {
      return client.post<InvoiceResponse>(`/invoices/${id}/uncollectible`);
    },

    async finalize(id: string): Promise<InvoiceResponse> {
      return client.post<InvoiceResponse>(`/invoices/${id}/finalize`);
    },

    async send(id: string, params?: SendInvoiceParams): Promise<InvoiceResponse> {
      return client.post<InvoiceResponse>(`/invoices/${id}/send`, params);
    },

    async markPaid(
      id: string,
      params?: MarkInvoicePaidParams
    ): Promise<InvoiceResponse> {
      return client.post<InvoiceResponse>(`/invoices/${id}/mark-paid`, params);
    },
  };
}


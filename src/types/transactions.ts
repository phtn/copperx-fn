import type { PaginationParams, PaginatedResponse, Timestamps } from './index';

export type TransactionType = 'payment' | 'refund' | 'withdrawal';

export type TransactionStatus = 'pending' | 'completed' | 'failed';

export interface Transaction extends Timestamps {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: string;
  transactionHash?: string;
  fromAddress?: string;
  toAddress?: string;
  customerId?: string;
  invoiceId?: string;
  checkoutSessionId?: string;
}

export interface ListTransactionsParams extends PaginationParams {
  type?: TransactionType;
  status?: TransactionStatus;
  customerId?: string;
}

export interface ListTransactionsResponse
  extends PaginatedResponse<Transaction> {}


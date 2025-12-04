import type { PaginationParams, PaginatedResponse, Timestamps, Metadata } from './index';

export type PriceType = 'one_time' | 'recurring';

export type RecurringInterval = 'day' | 'week' | 'month' | 'year';

export interface Price extends Timestamps {
  id: string;
  productId: string;
  amount: number;
  currency: string;
  type: PriceType;
  interval?: RecurringInterval;
  intervalCount?: number;
  metadata?: Metadata;
}

export interface CreatePriceParams {
  productId: string;
  amount: number;
  currency: string;
  type: PriceType;
  interval?: RecurringInterval;
  intervalCount?: number;
  metadata?: Metadata;
}

export interface CreatePriceResponse {
  price: Price;
}

export interface ListPricesParams extends PaginationParams {
  productId?: string;
  type?: PriceType;
}

export interface ListPricesResponse extends PaginatedResponse<Price> {}

export interface PriceResponse {
  price: Price;
}

export interface UpdatePriceParams {
  amount?: number;
  currency?: string;
  metadata?: Metadata;
}

export interface UpdatePriceResponse {
  price: Price;
}


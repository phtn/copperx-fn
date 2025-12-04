import type { PaginationParams, PaginatedResponse, Timestamps } from './index';

export interface TaxRate extends Timestamps {
  id: string;
  name: string;
  rate: number;
  isActive: boolean;
  description?: string;
}

export interface ListTaxRatesParams extends PaginationParams {
  isActive?: boolean;
}

export interface ListTaxRatesResponse extends PaginatedResponse<TaxRate> {}

export interface CreateTaxRateParams {
  name: string;
  rate: number;
  description?: string;
}

export interface CreateTaxRateResponse {
  taxRate: TaxRate;
}

export interface TaxRateResponse {
  taxRate: TaxRate;
}

export interface UpdateTaxRateParams {
  name?: string;
  rate?: number;
  description?: string;
}

export interface UpdateTaxRateResponse {
  taxRate: TaxRate;
}


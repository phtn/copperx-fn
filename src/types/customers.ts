import type { PaginationParams, PaginatedResponse, Timestamps, Metadata } from './index';

export interface Customer extends Timestamps {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  metadata?: Metadata;
}

export interface CreateCustomerParams {
  email: string;
  name?: string;
  phone?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  metadata?: Metadata;
}

export interface CreateCustomerResponse {
  customer: Customer;
}

export interface ListCustomersParams extends PaginationParams {
  search?: string;
}

export interface ListCustomersResponse extends PaginatedResponse<Customer> {}

export interface CustomerResponse {
  customer: Customer;
}

export interface UpdateCustomerParams {
  email?: string;
  name?: string;
  phone?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  metadata?: Metadata;
}

export interface UpdateCustomerResponse {
  customer: Customer;
}


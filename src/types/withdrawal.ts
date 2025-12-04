import type { PaginationParams, PaginatedResponse, Timestamps } from './index';

export interface WithdrawalAddress extends Timestamps {
  id: string;
  address: string;
  label?: string;
  chainId: string;
  isDefault: boolean;
}

export interface ListWithdrawalAddressesParams extends PaginationParams {}

export interface ListWithdrawalAddressesResponse
  extends PaginatedResponse<WithdrawalAddress> {}

export interface CreateWithdrawalAddressParams {
  address: string;
  label?: string;
  chainId: string;
}

export interface CreateWithdrawalAddressResponse {
  withdrawalAddress: WithdrawalAddress;
}

export interface UpdateWithdrawalAddressParams {
  label?: string;
  address?: string;
}

export interface UpdateWithdrawalAddressResponse {
  withdrawalAddress: WithdrawalAddress;
}

export interface WithdrawalAddressResponse {
  withdrawalAddress: WithdrawalAddress;
}


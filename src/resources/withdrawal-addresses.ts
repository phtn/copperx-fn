import { HTTPClient } from '../utils/http';
import type {
  ListWithdrawalAddressesParams,
  ListWithdrawalAddressesResponse,
  CreateWithdrawalAddressParams,
  CreateWithdrawalAddressResponse,
  UpdateWithdrawalAddressParams,
  UpdateWithdrawalAddressResponse,
  WithdrawalAddressResponse,
} from '../types/withdrawal';

export function createWithdrawalAddressesResource(client: HTTPClient) {
  return {
    async list(
      params?: ListWithdrawalAddressesParams
    ): Promise<ListWithdrawalAddressesResponse> {
      return client.get<ListWithdrawalAddressesResponse>(
        '/api/v1/withdrawal-addresses',
        { params }
      );
    },

    async create(
      params: CreateWithdrawalAddressParams
    ): Promise<CreateWithdrawalAddressResponse> {
      return client.post<CreateWithdrawalAddressResponse>(
        '/api/v1/withdrawal-addresses',
        params
      );
    },

    async get(id: string): Promise<WithdrawalAddressResponse> {
      return client.get<WithdrawalAddressResponse>(
        `/api/v1/withdrawal-addresses/${id}`
      );
    },

    async update(
      id: string,
      params: UpdateWithdrawalAddressParams
    ): Promise<UpdateWithdrawalAddressResponse> {
      return client.put<UpdateWithdrawalAddressResponse>(
        `/api/v1/withdrawal-addresses/${id}`,
        params
      );
    },

    async delete(id: string): Promise<void> {
      return client.delete<void>(`/api/v1/withdrawal-addresses/${id}`);
    },

    async markAsDefault(id: string): Promise<WithdrawalAddressResponse> {
      return client.post<WithdrawalAddressResponse>(
        `/api/v1/withdrawal-addresses/${id}/default`
      );
    },
  };
}


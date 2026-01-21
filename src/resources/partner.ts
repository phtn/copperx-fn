import { HTTPClient } from '../utils/http';
import type {
  CreatePartnerAccountParams,
  CreatePartnerAccountResponse,
  GetPartnerAccountsParams,
  GetPartnerAccountsResponse,
} from '../types/partner';

export function createPartnerResource(client: HTTPClient) {
  return {
    async createAccount(
      params: CreatePartnerAccountParams
    ): Promise<CreatePartnerAccountResponse> {
      return client.post<CreatePartnerAccountResponse>(
        '/api/v1/partner/accounts',
        params
      );
    },

    async getAccountsByEmails(
      params: GetPartnerAccountsParams
    ): Promise<GetPartnerAccountsResponse> {
      return client.get<GetPartnerAccountsResponse>(
        '/api/v1/partner/accounts/by-emails',
        { params: { emails: params.emails.join(',') } }
      );
    },
  };
}


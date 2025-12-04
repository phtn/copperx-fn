import type { Timestamps } from './index';

export interface PartnerAccount extends Timestamps {
  id: string;
  email: string;
  organizationId: string;
  status: 'active' | 'inactive';
}

export interface CreatePartnerAccountParams {
  email: string;
  organizationId: string;
}

export interface CreatePartnerAccountResponse {
  account: PartnerAccount;
}

export interface GetPartnerAccountsParams {
  emails: string[];
}

export interface GetPartnerAccountsResponse {
  accounts: PartnerAccount[];
}


import { HTTPClient } from '../utils/http';
import type {
  OrganizationResponse,
  UpdateBrandingParams,
} from '../types/organization';

export function createOrganizationResource(client: HTTPClient) {
  return {
    async get(): Promise<OrganizationResponse> {
      return client.get<OrganizationResponse>('/organization');
    },

    async updateBranding(
      params: UpdateBrandingParams
    ): Promise<OrganizationResponse> {
      return client.put<OrganizationResponse>('/organization/branding', params);
    },

    async deleteBrandLogo(): Promise<void> {
      return client.delete<void>('/organization/brand-logo');
    },
  };
}


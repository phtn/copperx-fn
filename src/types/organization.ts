import type { Timestamps } from './index';

export interface Organization extends Timestamps {
  id: string;
  name: string;
  logo?: string;
  branding?: {
    primaryColor?: string;
    secondaryColor?: string;
    logo?: string;
  };
}

export interface UpdateBrandingParams {
  primaryColor?: string;
  secondaryColor?: string;
  logo?: string;
}

export interface OrganizationResponse {
  organization: Organization;
}


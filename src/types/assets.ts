import type { PaginationParams, PaginatedResponse, Timestamps } from './index';

export interface Asset extends Timestamps {
  id: string;
  symbol: string;
  name: string;
  decimals: number;
  chainId: string;
  contractAddress?: string;
  logoUrl?: string;
}

export interface ListAssetsParams extends PaginationParams {
  chainId?: string;
}

export interface ListAssetsResponse extends PaginatedResponse<Asset> {}

export interface AssetResponse {
  asset: Asset;
}


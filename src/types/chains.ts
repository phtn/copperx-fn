import type { PaginationParams, PaginatedResponse, Timestamps } from './index';

export interface Chain extends Timestamps {
  id: string;
  name: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl?: string;
  nativeCurrency: {
    symbol: string;
    decimals: number;
  };
}

export interface ListChainsParams extends PaginationParams {}

export interface ListChainsResponse extends PaginatedResponse<Chain> {}

export interface ChainResponse {
  chain: Chain;
}


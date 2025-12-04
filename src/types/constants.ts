export interface PriceConstants {
  currencies: string[];
  minAmounts: Record<string, number>;
  maxAmounts: Record<string, number>;
}

export interface ConstantsResponse {
  prices: PriceConstants;
}


import type { PaginationParams, PaginatedResponse, Timestamps } from './index';

export type CouponType = 'percentage' | 'fixed_amount';

export type CouponStatus = 'active' | 'inactive' | 'archived';

export interface Coupon extends Timestamps {
  id: string;
  code: string;
  name: string;
  type: CouponType;
  value: number;
  status: CouponStatus;
  maxRedemptions?: number;
  timesRedeemed: number;
  validFrom?: string;
  validUntil?: string;
}

export interface ListCouponsParams extends PaginationParams {
  status?: CouponStatus;
}

export interface ListCouponsResponse extends PaginatedResponse<Coupon> {}

export interface CreateCouponParams {
  code: string;
  name: string;
  type: CouponType;
  value: number;
  maxRedemptions?: number;
  validFrom?: string;
  validUntil?: string;
}

export interface CreateCouponResponse {
  coupon: Coupon;
}

export interface CouponResponse {
  coupon: Coupon;
}

export interface UpdateCouponParams {
  name?: string;
  maxRedemptions?: number;
  validFrom?: string;
  validUntil?: string;
}

export interface UpdateCouponResponse {
  coupon: Coupon;
}


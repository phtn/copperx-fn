import { HTTPClient } from '../utils/http';
import type {
  ListCouponsParams,
  ListCouponsResponse,
  CreateCouponParams,
  CreateCouponResponse,
  CouponResponse,
  UpdateCouponParams,
  UpdateCouponResponse,
} from '../types/coupons';

export function createCouponsResource(client: HTTPClient) {
  return {
    async list(params?: ListCouponsParams): Promise<ListCouponsResponse> {
      return client.get<ListCouponsResponse>('/coupons', { params });
    },

    async create(params: CreateCouponParams): Promise<CreateCouponResponse> {
      return client.post<CreateCouponResponse>('/coupons', params);
    },

    async get(id: string): Promise<CouponResponse> {
      return client.get<CouponResponse>(`/coupons/${id}`);
    },

    async update(
      id: string,
      params: UpdateCouponParams
    ): Promise<UpdateCouponResponse> {
      return client.put<UpdateCouponResponse>(`/coupons/${id}`, params);
    },

    async enable(id: string): Promise<CouponResponse> {
      return client.post<CouponResponse>(`/coupons/${id}/enable`);
    },

    async disable(id: string): Promise<CouponResponse> {
      return client.post<CouponResponse>(`/coupons/${id}/disable`);
    },

    async archive(id: string): Promise<CouponResponse> {
      return client.post<CouponResponse>(`/coupons/${id}/archive`);
    },
  };
}


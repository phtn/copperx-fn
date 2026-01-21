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
      return client.get<ListCouponsResponse>('/api/v1/coupons', { params });
    },

    async create(params: CreateCouponParams): Promise<CreateCouponResponse> {
      return client.post<CreateCouponResponse>('/api/v1/coupons', params);
    },

    async get(id: string): Promise<CouponResponse> {
      return client.get<CouponResponse>(`/api/v1/coupons/${id}`);
    },

    async update(
      id: string,
      params: UpdateCouponParams
    ): Promise<UpdateCouponResponse> {
      return client.put<UpdateCouponResponse>(`/api/v1/coupons/${id}`, params);
    },

    async enable(id: string): Promise<CouponResponse> {
      return client.post<CouponResponse>(`/api/v1/coupons/${id}/enable`);
    },

    async disable(id: string): Promise<CouponResponse> {
      return client.post<CouponResponse>(`/api/v1/coupons/${id}/disable`);
    },

    async archive(id: string): Promise<CouponResponse> {
      return client.post<CouponResponse>(`/api/v1/coupons/${id}/archive`);
    },
  };
}


import { HTTPClient } from '../utils/http'
import type {
  CreateCheckoutSessionParams,
  CreateCheckoutSessionResponse,
  ListCheckoutSessionsParams,
  ListCheckoutSessionsResponse,
  CheckoutSessionResponse,
  CheckoutSessionStatusResponse,
  RecoverCheckoutSessionParams,
  CompleteCheckoutSessionParams,
  ExportCheckoutSessionsParams
} from '../types/checkout'

export function createCheckoutSessionsResource(client: HTTPClient) {
  return {
    async create(params: CreateCheckoutSessionParams): Promise<CreateCheckoutSessionResponse> {
      return client.post<CreateCheckoutSessionResponse>('/api/v1/checkout/sessions', params)
    },

    async list(params?: ListCheckoutSessionsParams): Promise<ListCheckoutSessionsResponse> {
      return client.get<ListCheckoutSessionsResponse>('/api/v1/checkout/sessions', {
        params
      })
    },

    async recoverByHash(sessionId: string, params: RecoverCheckoutSessionParams): Promise<CheckoutSessionResponse> {
      return client.post<CheckoutSessionResponse>(`/api/v1/checkout/sessions/${sessionId}/recover`, params)
    },

    async export(params?: ExportCheckoutSessionsParams): Promise<Blob | unknown> {
      return client.get<Blob | unknown>('/api/v1/checkout/sessions/export', {
        params,
        responseType: 'blob'
      })
    },

    async get(id: string): Promise<CheckoutSessionResponse> {
      return client.get<CheckoutSessionResponse>(`/api/v1/checkout/sessions/${id}`)
    },

    async getStatus(id: string): Promise<CheckoutSessionStatusResponse> {
      return client.get<CheckoutSessionStatusResponse>(`/api/v1/checkout/sessions/${id}/status`)
    },

    async recover(id: string, params: RecoverCheckoutSessionParams): Promise<CheckoutSessionResponse> {
      return client.post<CheckoutSessionResponse>(`/api/v1/checkout/sessions/${id}/recover`, params)
    },

    async complete(id: string, params: CompleteCheckoutSessionParams): Promise<CheckoutSessionResponse> {
      return client.post<CheckoutSessionResponse>(`/api/v1/checkout/sessions/${id}/complete`, params)
    }
  }
}

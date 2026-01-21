import type { PaginationParams, PaginatedResponse, Timestamps, Metadata } from './index'

export type CheckoutSessionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'expired' | 'cancelled'

export type SubmitType = 'pay' | 'book' | 'donate'

export type CheckoutMode = 'payment' | 'subscription' | 'setup'

export type AfterCompletion = 'hosted_confirmation' | 'redirect'

export interface CheckoutSession extends Timestamps {
  id: string
  customerId?: string
  amount: number
  currency: string
  status: CheckoutSessionStatus
  paymentLinkId?: string
  metadata?: Metadata
  successUrl?: string
  cancelUrl?: string
  expiresAt?: string
  transactionHash?: string
}

export interface CheckoutLineItemPriceData {
  currency: string
  productData: {
    visibility: number
    name: string
    unitLabel?: string
    description?: string
    image?: string
  }
  type: 'one_time' | 'recurring'
  unitAmount: number
  intervalCount?: number
}

export interface CheckoutLineItem {
  priceData: CheckoutLineItemPriceData
  quantity: number
}

export interface CheckoutPaymentSetting {
  allowSwap?: boolean
  allowFiatPayment?: boolean
  allowedChains?: Array<{ chainId: number }>
  preferredChainId?: number
}

export interface CheckoutLineItemsData {
  submitType: SubmitType
  lineItems: {
    data: CheckoutLineItem[]
  }
  paymentSetting?: CheckoutPaymentSetting
  mode: CheckoutMode
  clientReferenceId?: string
  afterCompletion?: AfterCompletion
  successUrl?: string
  cancelUrl?: string
}

export interface CheckoutLineItems {
  data: CheckoutLineItemsData
}

export interface CreateCheckoutSessionParams {
  amount?: number
  currency?: string
  customerId?: string
  paymentLinkId?: string
  successUrl?: string
  cancelUrl?: string
  metadata?: Metadata
  expiresAt?: string
  lineItems?: CheckoutLineItems
}

export interface CreateCheckoutSessionResponse {
  checkoutSession: CheckoutSession
}

export interface ListCheckoutSessionsParams extends PaginationParams {
  status?: CheckoutSessionStatus
  customerId?: string
  paymentLinkId?: string
}

export interface ListCheckoutSessionsResponse extends PaginatedResponse<CheckoutSession> {}

export interface CheckoutSessionResponse {
  checkoutSession: CheckoutSession
}

export interface CheckoutSessionStatusResponse {
  status: CheckoutSessionStatus
}

export interface RecoverCheckoutSessionParams {
  transactionHash: string
}

export interface CompleteCheckoutSessionParams {
  transactionHash: string
}

export interface ExportCheckoutSessionsParams extends PaginationParams {
  status?: CheckoutSessionStatus
  startDate?: string
  endDate?: string
  format?: 'csv' | 'json'
}

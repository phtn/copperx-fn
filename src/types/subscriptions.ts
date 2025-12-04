import type { PaginationParams, PaginatedResponse, Timestamps } from './index';

export type SubscriptionStatus =
  | 'active'
  | 'cancelled'
  | 'past_due'
  | 'unpaid'
  | 'trialing';

export interface Subscription extends Timestamps {
  id: string;
  customerId: string;
  priceId: string;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  cancelledAt?: string;
}

export interface ListSubscriptionsParams extends PaginationParams {
  customerId?: string;
  status?: SubscriptionStatus;
}

export interface ListSubscriptionsResponse
  extends PaginatedResponse<Subscription> {}

export interface SubscriptionResponse {
  subscription: Subscription;
}

export interface CancelSubscriptionParams {
  cancelAtPeriodEnd?: boolean;
}

export interface CancelSubscriptionResponse {
  subscription: Subscription;
}


import { beforeEach, describe, expect, test } from 'bun:test'
import { createSubscriptionsResource } from '../src/resources/subscriptions'
import type {
  CancelSubscriptionResponse,
  ListSubscriptionsResponse,
  SubscriptionResponse,
} from '../src/types/subscriptions'
import {
  CopperxAPIError,
  CopperxAuthenticationError,
  CopperxNetworkError,
} from '../src/utils/errors'
import { asHTTPClient, MockHTTPClient } from './utils/mock-http-client'

describe('Subscriptions Resource', () => {
  let mockClient: MockHTTPClient
  let subscriptionsResource: ReturnType<typeof createSubscriptionsResource>

  beforeEach(() => {
    mockClient = new MockHTTPClient()
    subscriptionsResource = createSubscriptionsResource(asHTTPClient(mockClient))
  })

  describe('list()', () => {
    test('should list subscriptions successfully', async () => {
      const mockResponse: ListSubscriptionsResponse = {
        data: [
          {
            id: 'sub_123',
            customerId: 'cus_123',
            priceId: 'price_123',
            status: 'active',
            currentPeriodStart: '2024-01-01T00:00:00Z',
            currentPeriodEnd: '2024-02-01T00:00:00Z',
            cancelAtPeriodEnd: false,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      }

      mockClient.setMockGet(async (url: string) => {
        expect(url).toBe('/subscriptions')
        return mockResponse
      })

      const result = await subscriptionsResource.list()

      expect(result).toEqual(mockResponse)
      expect(result.data).toHaveLength(1)
    })

    test('should handle error', async () => {
      mockClient.setMockGet(async () => {
        throw new CopperxAPIError('Server error', 500, 'SERVER_ERROR')
      })

      await expect(subscriptionsResource.list()).rejects.toThrow(
        CopperxAPIError
      )
    })
  })

  describe('get()', () => {
    test('should get subscription successfully', async () => {
      const mockResponse: SubscriptionResponse = {
        subscription: {
          id: 'sub_123',
          customerId: 'cus_123',
          priceId: 'price_123',
          status: 'active',
          currentPeriodStart: '2024-01-01T00:00:00Z',
          currentPeriodEnd: '2024-02-01T00:00:00Z',
          cancelAtPeriodEnd: false,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      }

      mockClient.setMockGet(async (url: string) => {
        expect(url).toBe('/subscriptions/sub_123')
        return mockResponse
      })

      const result = await subscriptionsResource.get('sub_123')

      expect(result).toEqual(mockResponse)
      expect(result.subscription.id).toBe('sub_123')
    })
  })

  describe('cancel()', () => {
    test('should cancel subscription successfully', async () => {
      const mockResponse: CancelSubscriptionResponse = {
        subscription: {
          id: 'sub_123',
          customerId: 'cus_123',
          priceId: 'price_123',
          status: 'cancelled',
          currentPeriodStart: '2024-01-01T00:00:00Z',
          currentPeriodEnd: '2024-02-01T00:00:00Z',
          cancelAtPeriodEnd: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
        },
      }

      mockClient.setMockPost(async (url: string, data: unknown) => {
        expect(url).toBe('/subscriptions/sub_123/cancel')
        return mockResponse
      })

      const result = await subscriptionsResource.cancel('sub_123')

      expect(result).toEqual(mockResponse)
      expect(result.subscription.status).toBe('cancelled')
    })

    test('should cancel with params', async () => {
      const mockResponse: CancelSubscriptionResponse = {
        subscription: {
          id: 'sub_123',
          customerId: 'cus_123',
          priceId: 'price_123',
          status: 'cancelled',
          currentPeriodStart: '2024-01-01T00:00:00Z',
          currentPeriodEnd: '2024-02-01T00:00:00Z',
          cancelAtPeriodEnd: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
        },
      }

      mockClient.setMockPost(async (url: string, data: unknown) => {
        expect(url).toBe('/subscriptions/sub_123/cancel')
        expect(data).toBeDefined()
        return mockResponse
      })

      const result = await subscriptionsResource.cancel('sub_123', {
        cancelAtPeriodEnd: true,
      })

      expect(result).toEqual(mockResponse)
    })
  })

  describe('resume()', () => {
    test('should resume subscription successfully', async () => {
      const mockResponse: SubscriptionResponse = {
        subscription: {
          id: 'sub_123',
          customerId: 'cus_123',
          priceId: 'price_123',
          status: 'active',
          currentPeriodStart: '2024-01-01T00:00:00Z',
          currentPeriodEnd: '2024-02-01T00:00:00Z',
          cancelAtPeriodEnd: false,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
        },
      }

      mockClient.setMockPost(async (url: string) => {
        expect(url).toBe('/subscriptions/sub_123/resume')
        return mockResponse
      })

      const result = await subscriptionsResource.resume('sub_123')

      expect(result).toEqual(mockResponse)
      expect(result.subscription.status).toBe('active')
    })
  })

  describe('cancelImmediately()', () => {
    test('should cancel subscription immediately successfully', async () => {
      const mockResponse: CancelSubscriptionResponse = {
        subscription: {
          id: 'sub_123',
          customerId: 'cus_123',
          priceId: 'price_123',
          status: 'cancelled',
          currentPeriodStart: '2024-01-01T00:00:00Z',
          currentPeriodEnd: '2024-02-01T00:00:00Z',
          cancelAtPeriodEnd: false,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
        },
      }

      mockClient.setMockPost(async (url: string) => {
        expect(url).toBe('/subscriptions/sub_123/cancel-immediately')
        return mockResponse
      })

      const result = await subscriptionsResource.cancelImmediately('sub_123')

      expect(result).toEqual(mockResponse)
    })

    test('should handle authentication error', async () => {
      mockClient.setMockPost(async () => {
        throw new CopperxAuthenticationError('Invalid API key')
      })

      await expect(
        subscriptionsResource.cancelImmediately('sub_123')
      ).rejects.toThrow(CopperxAuthenticationError)
    })

    test('should handle network error', async () => {
      mockClient.setMockPost(async () => {
        throw new CopperxNetworkError('Network error')
      })

      await expect(
        subscriptionsResource.cancelImmediately('sub_123')
      ).rejects.toThrow(CopperxNetworkError)
    })
  })
})


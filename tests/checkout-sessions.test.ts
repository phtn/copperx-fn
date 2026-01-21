import { beforeEach, describe, expect, test } from 'bun:test'
import { createCheckoutSessionsResource } from '../src/resources/checkout-sessions'
import type {
  CheckoutSessionResponse,
  CheckoutSessionStatusResponse,
  CreateCheckoutSessionResponse,
  ListCheckoutSessionsResponse,
} from '../src/types/checkout'
import {
  CopperxAPIError,
  CopperxAuthenticationError,
  CopperxNetworkError,
} from '../src/utils/errors'
import { asHTTPClient, MockHTTPClient } from './utils/mock-http-client'

describe('Checkout Sessions Resource', () => {
  let mockClient: MockHTTPClient
  let checkoutSessionsResource: ReturnType<
    typeof createCheckoutSessionsResource
  >

  beforeEach(() => {
    mockClient = new MockHTTPClient()
    checkoutSessionsResource = createCheckoutSessionsResource(
      asHTTPClient(mockClient)
    )
  })

  describe('create()', () => {
    test('should create checkout session successfully', async () => {
      const mockResponse: CreateCheckoutSessionResponse = {
        checkoutSession: {
          id: 'cs_123',
          amount: 1000,
          currency: 'USD',
          status: 'pending',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      }

      mockClient.setMockPost(async (url: string, data: unknown) => {
        expect(url).toBe('/api/v1/checkout/sessions')
        expect(data).toBeDefined()
        return mockResponse
      })

      const result = await checkoutSessionsResource.create({
        amount: 1000,
        currency: 'USD',
      })

      expect(result).toEqual(mockResponse)
      expect(result.checkoutSession.id).toBe('cs_123')
    })

    test('should handle authentication error', async () => {
      mockClient.setMockPost(async () => {
        throw new CopperxAuthenticationError('Invalid API key')
      })

      await expect(
        checkoutSessionsResource.create({ amount: 1000, currency: 'USD' })
      ).rejects.toThrow(CopperxAuthenticationError)
    })
  })

  describe('list()', () => {
    test('should list checkout sessions successfully', async () => {
      const mockResponse: ListCheckoutSessionsResponse = {
        data: [
          {
            id: 'cs_123',
            amount: 1000,
            currency: 'USD',
            status: 'completed',
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
        expect(url).toBe('/api/v1/checkout/sessions')
        return mockResponse
      })

      const result = await checkoutSessionsResource.list()

      expect(result).toEqual(mockResponse)
      expect(result.data).toHaveLength(1)
    })
  })

  describe('get()', () => {
    test('should get checkout session successfully', async () => {
      const mockResponse: CheckoutSessionResponse = {
        checkoutSession: {
          id: 'cs_123',
          amount: 1000,
          currency: 'USD',
          status: 'completed',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      }

      mockClient.setMockGet(async (url: string) => {
        expect(url).toBe('/api/v1/checkout/sessions/cs_123')
        return mockResponse
      })

      const result = await checkoutSessionsResource.get('cs_123')

      expect(result).toEqual(mockResponse)
    })
  })

  describe('getStatus()', () => {
    test('should get checkout session status successfully', async () => {
      const mockResponse: CheckoutSessionStatusResponse = {
        status: 'completed',
      }

      mockClient.setMockGet(async (url: string) => {
        expect(url).toBe('/api/v1/checkout/sessions/cs_123/status')
        return mockResponse
      })

      const result = await checkoutSessionsResource.getStatus('cs_123')

      expect(result).toEqual(mockResponse)
      expect(result.status).toBe('completed')
    })
  })

  describe('recover()', () => {
    test('should recover checkout session successfully', async () => {
      const mockResponse: CheckoutSessionResponse = {
        checkoutSession: {
          id: 'cs_123',
          amount: 1000,
          currency: 'USD',
          status: 'pending',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
        },
      }

      mockClient.setMockPost(async (url: string, data: unknown) => {
        expect(url).toBe('/api/v1/checkout/sessions/cs_123/recover')
        expect(data).toBeDefined()
        return mockResponse
      })

      const result = await checkoutSessionsResource.recover('cs_123', {
        transactionHash: 'recovery-hash',
      })

      expect(result).toEqual(mockResponse)
    })
  })

  describe('complete()', () => {
    test('should complete checkout session successfully', async () => {
      const mockResponse: CheckoutSessionResponse = {
        checkoutSession: {
          id: 'cs_123',
          amount: 1000,
          currency: 'USD',
          status: 'completed',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
        },
      }

      mockClient.setMockPost(async (url: string, data: unknown) => {
        expect(url).toBe('/api/v1/checkout/sessions/cs_123/complete')
        expect(data).toBeDefined()
        return mockResponse
      })

      const result = await checkoutSessionsResource.complete('cs_123', {
        transactionHash: 'tx_hash_123',
      })

      expect(result).toEqual(mockResponse)
    })

    test('should handle network error', async () => {
      mockClient.setMockPost(async () => {
        throw new CopperxNetworkError('Network error')
      })

      await expect(
        checkoutSessionsResource.complete('cs_123', {
          transactionHash: 'tx_hash_123',
        })
      ).rejects.toThrow(CopperxNetworkError)
    })
  })

  describe('export()', () => {
    test('should export checkout sessions successfully', async () => {
      const mockBlob = new Blob(['csv,data'], { type: 'text/csv' })

      mockClient.setMockGet(async (url: string) => {
        expect(url).toBe('/api/v1/checkout/sessions/export')
        return mockBlob
      })

      const result = await checkoutSessionsResource.export()

      expect(result).toBeInstanceOf(Blob)
    })
  })
})


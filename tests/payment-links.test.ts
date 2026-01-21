import { beforeEach, describe, expect, test } from 'bun:test'
import { createPaymentLinksResource } from '../src/resources/payment-links'
import type {
  CreatePaymentLinkResponse,
  ListPaymentLinksResponse,
  PaymentLinkResponse,
  UpdatePaymentLinkResponse,
} from '../src/types/payment-links'
import {
  CopperxAPIError,
  CopperxAuthenticationError,
  CopperxNetworkError,
} from '../src/utils/errors'
import { asHTTPClient, MockHTTPClient } from './utils/mock-http-client'

describe('Payment Links Resource', () => {
  let mockClient: MockHTTPClient
  let paymentLinksResource: ReturnType<typeof createPaymentLinksResource>

  beforeEach(() => {
    mockClient = new MockHTTPClient()
    paymentLinksResource = createPaymentLinksResource(asHTTPClient(mockClient))
  })

  describe('create()', () => {
    test('should create payment link successfully', async () => {
      const mockResponse: CreatePaymentLinkResponse = {
        paymentLink: {
          id: 'pl_123',
          name: 'Test Payment Link',
          amount: 1000,
          currency: 'USD',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      }

      mockClient.setMockPost(async (url: string, data: unknown) => {
        expect(url).toBe('/api/v1/payment-links')
        expect(data).toBeDefined()
        return mockResponse
      })

      const result = await paymentLinksResource.create({
        name: 'Test Payment Link',
        amount: 1000,
        currency: 'USD',
      })

      expect(result).toEqual(mockResponse)
      expect(result.paymentLink.id).toBe('pl_123')
    })

    test('should handle authentication error', async () => {
      mockClient.setMockPost(async () => {
        throw new CopperxAuthenticationError('Invalid API key')
      })

      await expect(
        paymentLinksResource.create({
          name: 'Test Payment Link',
          amount: 1000,
          currency: 'USD',
        })
      ).rejects.toThrow(CopperxAuthenticationError)
    })
  })

  describe('list()', () => {
    test('should list payment links successfully', async () => {
      const mockResponse: ListPaymentLinksResponse = {
        data: [
          {
            id: 'pl_123',
            name: 'Test Payment Link',
            amount: 1000,
            currency: 'USD',
            isActive: true,
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
        expect(url).toBe('/api/v1/payment-links')
        return mockResponse
      })

      const result = await paymentLinksResource.list()

      expect(result).toEqual(mockResponse)
      expect(result.data).toHaveLength(1)
    })
  })

  describe('get()', () => {
    test('should get payment link successfully', async () => {
      const mockResponse: PaymentLinkResponse = {
        paymentLink: {
          id: 'pl_123',
          name: 'Test Payment Link',
          amount: 1000,
          currency: 'USD',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      }

      mockClient.setMockGet(async (url: string) => {
        expect(url).toBe('/api/v1/payment-links/pl_123')
        return mockResponse
      })

      const result = await paymentLinksResource.get('pl_123')

      expect(result).toEqual(mockResponse)
    })
  })

  describe('update()', () => {
    test('should update payment link successfully', async () => {
      const mockResponse: UpdatePaymentLinkResponse = {
        paymentLink: {
          id: 'pl_123',
          name: 'Updated Payment Link',
          amount: 2000,
          currency: 'USD',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
        },
      }

      mockClient.setMockPut(async (url: string, data: unknown) => {
        expect(url).toBe('/api/v1/payment-links/pl_123')
        expect(data).toBeDefined()
        return mockResponse
      })

      const result = await paymentLinksResource.update('pl_123', {
        amount: 2000,
      })

      expect(result).toEqual(mockResponse)
    })
  })

  describe('delete()', () => {
    test('should delete payment link successfully', async () => {
      mockClient.setMockDelete(async (url: string) => {
        expect(url).toBe('/api/v1/payment-links/pl_123')
        return undefined
      })

      await expect(paymentLinksResource.delete('pl_123')).resolves.toBeUndefined()
    })
  })

  describe('activate()', () => {
    test('should activate payment link successfully', async () => {
      const mockResponse: PaymentLinkResponse = {
        paymentLink: {
          id: 'pl_123',
          name: 'Test Payment Link',
          amount: 1000,
          currency: 'USD',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      }

      mockClient.setMockPut(async (url: string) => {
        expect(url).toBe('/api/v1/payment-links/pl_123/activate')
        return mockResponse
      })

      const result = await paymentLinksResource.activate('pl_123')

      expect(result).toEqual(mockResponse)
      expect(result.paymentLink.isActive).toBe(true)
    })
  })

  describe('deactivate()', () => {
    test('should deactivate payment link successfully', async () => {
      const mockResponse: PaymentLinkResponse = {
        paymentLink: {
          id: 'pl_123',
          name: 'Test Payment Link',
          amount: 1000,
          currency: 'USD',
          isActive: false,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      }

      mockClient.setMockPut(async (url: string) => {
        expect(url).toBe('/api/v1/payment-links/pl_123/deactivate')
        return mockResponse
      })

      const result = await paymentLinksResource.deactivate('pl_123')

      expect(result).toEqual(mockResponse)
      expect(result.paymentLink.isActive).toBe(false)
    })

    test('should handle network error', async () => {
      mockClient.setMockPut(async () => {
        throw new CopperxNetworkError('Network error')
      })

      await expect(paymentLinksResource.deactivate('pl_123')).rejects.toThrow(
        CopperxNetworkError
      )
    })
  })
})


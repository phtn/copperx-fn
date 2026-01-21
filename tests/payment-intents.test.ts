import { beforeEach, describe, expect, test } from 'bun:test'
import { createPaymentIntentsResource } from '../src/resources/payment-intents'
import type {
  MarkPaymentRefundedResponse,
  SendPaymentReceiptResponse,
} from '../src/types/payment-intents'
import {
  CopperxAPIError,
  CopperxAuthenticationError,
  CopperxNetworkError,
} from '../src/utils/errors'
import { asHTTPClient, MockHTTPClient } from './utils/mock-http-client'

describe('Payment Intents Resource', () => {
  let mockClient: MockHTTPClient
  let paymentIntentsResource: ReturnType<typeof createPaymentIntentsResource>

  beforeEach(() => {
    mockClient = new MockHTTPClient()
    paymentIntentsResource = createPaymentIntentsResource(
      asHTTPClient(mockClient)
    )
  })

  describe('sendReceipt()', () => {
    test('should send receipt successfully', async () => {
      const mockResponse: SendPaymentReceiptResponse = {
        success: true,
      }

      mockClient.setMockPost(async (url: string, data: unknown) => {
        expect(url).toBe('/api/v1/payment-intents/pi_123/receipt')
        return mockResponse
      })

      const result = await paymentIntentsResource.sendReceipt('pi_123')

      expect(result).toEqual(mockResponse)
      expect(result.success).toBe(true)
    })

    test('should send receipt with params', async () => {
      const mockResponse: SendPaymentReceiptResponse = {
        success: true,
      }

      mockClient.setMockPost(async (url: string, data: unknown) => {
        expect(url).toBe('/api/v1/payment-intents/pi_123/receipt')
        expect(data).toBeDefined()
        return mockResponse
      })

      const result = await paymentIntentsResource.sendReceipt('pi_123', {
        email: 'customer@example.com',
      })

      expect(result).toEqual(mockResponse)
    })

    test('should handle authentication error', async () => {
      mockClient.setMockPost(async () => {
        throw new CopperxAuthenticationError('Invalid API key')
      })

      await expect(
        paymentIntentsResource.sendReceipt('pi_123')
      ).rejects.toThrow(CopperxAuthenticationError)
    })

    test('should handle API error', async () => {
      mockClient.setMockPost(async () => {
        throw new CopperxAPIError('Payment intent not found', 404, 'NOT_FOUND')
      })

      await expect(
        paymentIntentsResource.sendReceipt('invalid')
      ).rejects.toThrow(CopperxAPIError)
    })

    test('should handle network error', async () => {
      mockClient.setMockPost(async () => {
        throw new CopperxNetworkError('Network error')
      })

      await expect(
        paymentIntentsResource.sendReceipt('pi_123')
      ).rejects.toThrow(CopperxNetworkError)
    })
  })

  describe('markRefunded()', () => {
    test('should mark payment as refunded successfully', async () => {
      const mockResponse: MarkPaymentRefundedResponse = {
        paymentIntent: {
          id: 'pi_123',
          amount: 1000,
          currency: 'USD',
          status: 'succeeded',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      }

      mockClient.setMockPost(async (url: string, data: unknown) => {
        expect(url).toBe('/api/v1/payment-intents/pi_123/refund')
        return mockResponse
      })

      const result = await paymentIntentsResource.markRefunded('pi_123')

      expect(result).toEqual(mockResponse)
      expect(result.paymentIntent.id).toBe('pi_123')
    })

    test('should mark refunded with params', async () => {
      const mockResponse: MarkPaymentRefundedResponse = {
        paymentIntent: {
          id: 'pi_123',
          amount: 1000,
          currency: 'USD',
          status: 'succeeded',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      }

      mockClient.setMockPost(async (url: string, data: unknown) => {
        expect(url).toBe('/api/v1/payment-intents/pi_123/refund')
        expect(data).toBeDefined()
        return mockResponse
      })

      const result = await paymentIntentsResource.markRefunded('pi_123', {
        refundAmount: 100,
      })

      expect(result).toEqual(mockResponse)
    })

    test('should handle error', async () => {
      mockClient.setMockPost(async () => {
        throw new CopperxAPIError('Refund failed', 400, 'VALIDATION_ERROR')
      })

      await expect(
        paymentIntentsResource.markRefunded('pi_123')
      ).rejects.toThrow(CopperxAPIError)
    })
  })
})


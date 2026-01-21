import { beforeEach, describe, expect, test } from 'bun:test'
import { createPaymentSettingResource } from '../src/resources/payment-setting'
import type { PaymentSettingResponse } from '../src/types/payment-setting'
import {
  CopperxAPIError,
  CopperxAuthenticationError,
  CopperxNetworkError,
} from '../src/utils/errors'
import { asHTTPClient, MockHTTPClient } from './utils/mock-http-client'

describe('Payment Setting Resource', () => {
  let mockClient: MockHTTPClient
  let paymentSettingResource: ReturnType<typeof createPaymentSettingResource>

  beforeEach(() => {
    mockClient = new MockHTTPClient()
    paymentSettingResource = createPaymentSettingResource(
      asHTTPClient(mockClient)
    )
  })

  describe('get()', () => {
    test('should get payment setting successfully', async () => {
      const mockResponse: PaymentSettingResponse = {
        paymentSetting: {
          id: 'ps_123',
          organizationId: 'org_123',
          autoWithdrawEnabled: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      }

      mockClient.setMockGet(async (url: string) => {
        expect(url).toBe('/api/v1/payment-setting')
        return mockResponse
      })

      const result = await paymentSettingResource.get()

      expect(result).toEqual(mockResponse)
      expect(result.paymentSetting.id).toBe('ps_123')
    })

    test('should handle authentication error', async () => {
      mockClient.setMockGet(async () => {
        throw new CopperxAuthenticationError('Invalid API key')
      })

      await expect(paymentSettingResource.get()).rejects.toThrow(
        CopperxAuthenticationError
      )
    })

    test('should handle API error', async () => {
      mockClient.setMockGet(async () => {
        throw new CopperxAPIError('Server error', 500, 'SERVER_ERROR')
      })

      await expect(paymentSettingResource.get()).rejects.toThrow(
        CopperxAPIError
      )
    })

    test('should handle network error', async () => {
      mockClient.setMockGet(async () => {
        throw new CopperxNetworkError('Network error')
      })

      await expect(paymentSettingResource.get()).rejects.toThrow(
        CopperxNetworkError
      )
    })
  })
})


import { beforeEach, describe, expect, test } from 'bun:test'
import { createInvoiceSettingResource } from '../src/resources/invoice-setting'
import type { InvoiceSettingResponse } from '../src/types/invoice-setting'
import {
  CopperxAPIError,
  CopperxAuthenticationError,
  CopperxNetworkError,
} from '../src/utils/errors'
import { asHTTPClient, MockHTTPClient } from './utils/mock-http-client'

describe('Invoice Setting Resource', () => {
  let mockClient: MockHTTPClient
  let invoiceSettingResource: ReturnType<typeof createInvoiceSettingResource>

  beforeEach(() => {
    mockClient = new MockHTTPClient()
    invoiceSettingResource = createInvoiceSettingResource(
      asHTTPClient(mockClient)
    )
  })

  describe('get()', () => {
    test('should get invoice setting successfully', async () => {
      const mockResponse: InvoiceSettingResponse = {
        invoiceSetting: {
          id: 'is_123',
          organizationId: 'org_123',
          defaultDueDays: 30,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      }

      mockClient.setMockGet(async (url: string) => {
        expect(url).toBe('/api/v1/invoice-setting')
        return mockResponse
      })

      const result = await invoiceSettingResource.get()

      expect(result).toEqual(mockResponse)
      expect(result.invoiceSetting.id).toBe('is_123')
    })

    test('should handle authentication error', async () => {
      mockClient.setMockGet(async () => {
        throw new CopperxAuthenticationError('Invalid API key')
      })

      await expect(invoiceSettingResource.get()).rejects.toThrow(
        CopperxAuthenticationError
      )
    })

    test('should handle network error', async () => {
      mockClient.setMockGet(async () => {
        throw new CopperxNetworkError('Network error')
      })

      await expect(invoiceSettingResource.get()).rejects.toThrow(
        CopperxNetworkError
      )
    })
  })
})


import { beforeEach, describe, expect, test } from 'bun:test'
import { createConstantsResource } from '../src/resources/constants'
import type { ConstantsResponse } from '../src/types/constants'
import {
  CopperxAPIError,
  CopperxAuthenticationError,
  CopperxNetworkError,
} from '../src/utils/errors'
import { asHTTPClient, MockHTTPClient } from './utils/mock-http-client'

describe('Constants Resource', () => {
  let mockClient: MockHTTPClient
  let constantsResource: ReturnType<typeof createConstantsResource>

  beforeEach(() => {
    mockClient = new MockHTTPClient()
    constantsResource = createConstantsResource(asHTTPClient(mockClient))
  })

  describe('getPrices()', () => {
    test('should get prices constants successfully', async () => {
      const mockResponse: ConstantsResponse = {
        prices: {
          currencies: ['USD', 'EUR'],
          minAmounts: { USD: 1 },
          maxAmounts: { USD: 1000000 },
        },
      }

      mockClient.setMockGet(async (url: string) => {
        expect(url).toBe('/api/v1/constants/prices')
        return mockResponse
      })

      const result = await constantsResource.getPrices()

      expect(result).toEqual(mockResponse)
      expect(result.prices).toBeDefined()
    })

    test('should handle authentication error', async () => {
      mockClient.setMockGet(async () => {
        throw new CopperxAuthenticationError('Invalid API key')
      })

      await expect(constantsResource.getPrices()).rejects.toThrow(
        CopperxAuthenticationError
      )
    })

    test('should handle API error', async () => {
      mockClient.setMockGet(async () => {
        throw new CopperxAPIError('Server error', 500, 'SERVER_ERROR')
      })

      await expect(constantsResource.getPrices()).rejects.toThrow(
        CopperxAPIError
      )
    })

    test('should handle network error', async () => {
      mockClient.setMockGet(async () => {
        throw new CopperxNetworkError('Network error')
      })

      await expect(constantsResource.getPrices()).rejects.toThrow(
        CopperxNetworkError
      )
    })
  })
})


import { beforeEach, describe, expect, test } from 'bun:test'
import { createAssetsResource } from '../src/resources/assets'
import type { AssetResponse, ListAssetsResponse } from '../src/types/assets'
import {
  CopperxAPIError,
  CopperxAuthenticationError,
  CopperxNetworkError,
} from '../src/utils/errors'
import { asHTTPClient, MockHTTPClient } from './utils/mock-http-client'

describe('Assets Resource', () => {
  let mockClient: MockHTTPClient
  let assetsResource: ReturnType<typeof createAssetsResource>

  beforeEach(() => {
    mockClient = new MockHTTPClient()
    assetsResource = createAssetsResource(asHTTPClient(mockClient))
  })

  describe('list()', () => {
    test('should list assets successfully', async () => {
      const mockResponse: ListAssetsResponse = {
        data: [
          {
            id: 'asset_123',
            symbol: 'USDC',
            name: 'USD Coin',
            decimals: 6,
            chainId: 'eth',
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
        expect(url).toBe('/api/v1/assets')
        return mockResponse
      })

      const result = await assetsResource.list()

      expect(result).toEqual(mockResponse)
      expect(result.data).toHaveLength(1)
    })

    test('should list assets with params', async () => {
      const mockResponse: ListAssetsResponse = {
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      }

      mockClient.setMockGet(async (url: string) => {
        expect(url).toBe('/api/v1/assets')
        return mockResponse
      })

      const result = await assetsResource.list({ chainId: 'eth' })

      expect(result).toEqual(mockResponse)
    })

    test('should handle authentication error', async () => {
      mockClient.setMockGet(async () => {
        throw new CopperxAuthenticationError('Invalid API key')
      })

      await expect(assetsResource.list()).rejects.toThrow(
        CopperxAuthenticationError
      )
    })

    test('should handle network error', async () => {
      mockClient.setMockGet(async () => {
        throw new CopperxNetworkError('Network error')
      })

      await expect(assetsResource.list()).rejects.toThrow(CopperxNetworkError)
    })
  })

  describe('get()', () => {
    test('should get asset successfully', async () => {
      const mockResponse: AssetResponse = {
        asset: {
          id: 'asset_123',
          symbol: 'USDC',
          name: 'USD Coin',
          decimals: 6,
          chainId: 'eth',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      }

      mockClient.setMockGet(async (url: string) => {
        expect(url).toBe('/api/v1/assets/asset_123')
        return mockResponse
      })

      const result = await assetsResource.get('asset_123')

      expect(result).toEqual(mockResponse)
      expect(result.asset.id).toBe('asset_123')
    })

    test('should handle not found error', async () => {
      mockClient.setMockGet(async () => {
        throw new CopperxAPIError('Asset not found', 404, 'NOT_FOUND')
      })

      await expect(assetsResource.get('invalid')).rejects.toThrow(
        CopperxAPIError
      )
    })
  })
})


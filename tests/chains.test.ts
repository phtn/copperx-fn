import { beforeEach, describe, expect, test } from 'bun:test'
import { createChainsResource } from '../src/resources/chains'
import type { ChainResponse, ListChainsResponse } from '../src/types/chains'
import {
  CopperxAPIError,
  CopperxAuthenticationError,
  CopperxNetworkError,
} from '../src/utils/errors'
import { asHTTPClient, MockHTTPClient } from './utils/mock-http-client'

describe('Chains Resource', () => {
  let mockClient: MockHTTPClient
  let chainsResource: ReturnType<typeof createChainsResource>

  beforeEach(() => {
    mockClient = new MockHTTPClient()
    chainsResource = createChainsResource(asHTTPClient(mockClient))
  })

  describe('list()', () => {
    test('should list chains successfully', async () => {
      const mockResponse: ListChainsResponse = {
        data: [
          {
            id: 'eth',
            name: 'Ethereum',
            chainId: 1,
            rpcUrl: 'https://eth.llamarpc.com',
            nativeCurrency: {
              symbol: 'ETH',
              decimals: 18,
            },
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
        expect(url).toBe('/chains')
        return mockResponse
      })

      const result = await chainsResource.list()

      expect(result).toEqual(mockResponse)
      expect(result.data).toHaveLength(1)
    })

    test('should list chains with params', async () => {
      const mockResponse: ListChainsResponse = {
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      }

      mockClient.setMockGet(async (url: string) => {
        expect(url).toBe('/chains')
        return mockResponse
      })

      const result = await chainsResource.list()

      expect(result).toEqual(mockResponse)
    })

    test('should handle authentication error', async () => {
      mockClient.setMockGet(async () => {
        throw new CopperxAuthenticationError('Invalid API key')
      })

      await expect(chainsResource.list()).rejects.toThrow(
        CopperxAuthenticationError
      )
    })

    test('should handle network error', async () => {
      mockClient.setMockGet(async () => {
        throw new CopperxNetworkError('Network error')
      })

      await expect(chainsResource.list()).rejects.toThrow(CopperxNetworkError)
    })
  })

  describe('get()', () => {
    test('should get chain successfully', async () => {
      const mockResponse: ChainResponse = {
        chain: {
          id: 'eth',
          name: 'Ethereum',
          chainId: 1,
          rpcUrl: 'https://eth.llamarpc.com',
          nativeCurrency: {
            symbol: 'ETH',
            decimals: 18,
          },
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      }

      mockClient.setMockGet(async (url: string) => {
        expect(url).toBe('/chains/eth')
        return mockResponse
      })

      const result = await chainsResource.get('eth')

      expect(result).toEqual(mockResponse)
      expect(result.chain.id).toBe('eth')
    })

    test('should handle not found error', async () => {
      mockClient.setMockGet(async () => {
        throw new CopperxAPIError('Chain not found', 404, 'NOT_FOUND')
      })

      await expect(chainsResource.get('invalid')).rejects.toThrow(
        CopperxAPIError
      )
    })
  })
})


import { beforeEach, describe, expect, test } from 'bun:test'
import { createTransactionsResource } from '../src/resources/transactions'
import type { ListTransactionsResponse } from '../src/types/transactions'
import {
  CopperxAPIError,
  CopperxAuthenticationError,
  CopperxNetworkError,
} from '../src/utils/errors'
import { asHTTPClient, MockHTTPClient } from './utils/mock-http-client'

describe('Transactions Resource', () => {
  let mockClient: MockHTTPClient
  let transactionsResource: ReturnType<typeof createTransactionsResource>

  beforeEach(() => {
    mockClient = new MockHTTPClient()
    transactionsResource = createTransactionsResource(asHTTPClient(mockClient))
  })

  describe('list()', () => {
    test('should list transactions successfully', async () => {
      const mockResponse: ListTransactionsResponse = {
        data: [
          {
            id: 'txn_123',
            type: 'payment',
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
        expect(url).toBe('/api/v1/transactions')
        return mockResponse
      })

      const result = await transactionsResource.list()

      expect(result).toEqual(mockResponse)
      expect(result.data).toHaveLength(1)
    })

    test('should list transactions with params', async () => {
      const mockResponse: ListTransactionsResponse = {
        data: [],
        pagination: {
          page: 2,
          limit: 20,
          total: 0,
          totalPages: 0,
        },
      }

      mockClient.setMockGet(async (url: string) => {
        expect(url).toBe('/api/v1/transactions')
        return mockResponse
      })

      const result = await transactionsResource.list({ page: 2, limit: 20 })

      expect(result).toEqual(mockResponse)
    })

    test('should handle authentication error', async () => {
      mockClient.setMockGet(async () => {
        throw new CopperxAuthenticationError('Invalid API key')
      })

      await expect(transactionsResource.list()).rejects.toThrow(
        CopperxAuthenticationError
      )
    })

    test('should handle API error', async () => {
      mockClient.setMockGet(async () => {
        throw new CopperxAPIError('Server error', 500, 'SERVER_ERROR')
      })

      await expect(transactionsResource.list()).rejects.toThrow(CopperxAPIError)
    })

    test('should handle network error', async () => {
      mockClient.setMockGet(async () => {
        throw new CopperxNetworkError('Network error')
      })

      await expect(transactionsResource.list()).rejects.toThrow(
        CopperxNetworkError
      )
    })
  })
})


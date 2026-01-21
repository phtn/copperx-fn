import { beforeEach, describe, expect, test } from 'bun:test'
import { createPricesResource } from '../src/resources/prices'
import type {
  CreatePriceResponse,
  ListPricesResponse,
  PriceResponse,
  UpdatePriceResponse,
} from '../src/types/prices'
import {
  CopperxAPIError,
  CopperxAuthenticationError,
  CopperxNetworkError,
} from '../src/utils/errors'
import { asHTTPClient, MockHTTPClient } from './utils/mock-http-client'

describe('Prices Resource', () => {
  let mockClient: MockHTTPClient
  let pricesResource: ReturnType<typeof createPricesResource>

  beforeEach(() => {
    mockClient = new MockHTTPClient()
    pricesResource = createPricesResource(asHTTPClient(mockClient))
  })

  describe('create()', () => {
    test('should create price successfully', async () => {
      const mockResponse: CreatePriceResponse = {
        price: {
          id: 'price_123',
          productId: 'prod_123',
          amount: 1000,
          currency: 'USD',
          type: 'one_time',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      }

      mockClient.setMockPost(async (url: string, data: unknown) => {
        expect(url).toBe('/api/v1/prices')
        expect(data).toBeDefined()
        return mockResponse
      })

      const result = await pricesResource.create({
        productId: 'prod_123',
        amount: 1000,
        currency: 'USD',
        type: 'one_time',
      })

      expect(result).toEqual(mockResponse)
      expect(result.price.id).toBe('price_123')
    })

    test('should handle authentication error', async () => {
      mockClient.setMockPost(async () => {
        throw new CopperxAuthenticationError('Invalid API key')
      })

      await expect(
        pricesResource.create({
          productId: 'prod_123',
          amount: 1000,
          currency: 'USD',
          type: 'one_time',
        })
      ).rejects.toThrow(CopperxAuthenticationError)
    })
  })

  describe('list()', () => {
    test('should list prices successfully', async () => {
      const mockResponse: ListPricesResponse = {
        data: [
          {
            id: 'price_123',
            productId: 'prod_123',
            amount: 1000,
            currency: 'USD',
            type: 'one_time',
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
        expect(url).toBe('/api/v1/prices')
        return mockResponse
      })

      const result = await pricesResource.list()

      expect(result).toEqual(mockResponse)
      expect(result.data).toHaveLength(1)
    })
  })

  describe('get()', () => {
    test('should get price successfully', async () => {
      const mockResponse: PriceResponse = {
        price: {
          id: 'price_123',
          productId: 'prod_123',
          amount: 1000,
          currency: 'USD',
          type: 'one_time',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      }

      mockClient.setMockGet(async (url: string) => {
        expect(url).toBe('/api/v1/prices/price_123')
        return mockResponse
      })

      const result = await pricesResource.get('price_123')

      expect(result).toEqual(mockResponse)
    })
  })

  describe('update()', () => {
    test('should update price successfully', async () => {
      const mockResponse: UpdatePriceResponse = {
        price: {
          id: 'price_123',
          productId: 'prod_123',
          amount: 2000,
          currency: 'USD',
          type: 'one_time',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
        },
      }

      mockClient.setMockPut(async (url: string, data: unknown) => {
        expect(url).toBe('/api/v1/prices/price_123')
        expect(data).toBeDefined()
        return mockResponse
      })

      const result = await pricesResource.update('price_123', {
        amount: 2000,
      })

      expect(result).toEqual(mockResponse)
    })

    test('should handle network error', async () => {
      mockClient.setMockPut(async () => {
        throw new CopperxNetworkError('Network error')
      })

      await expect(
        pricesResource.update('price_123', { amount: 2000 })
      ).rejects.toThrow(CopperxNetworkError)
    })
  })
})


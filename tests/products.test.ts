import { beforeEach, describe, expect, test } from 'bun:test'
import { createProductsResource } from '../src/resources/products'
import type {
  CreateProductResponse,
  ListProductsResponse,
  ProductResponse,
  UpdateProductResponse,
} from '../src/types/products'
import {
  CopperxAPIError,
  CopperxAuthenticationError,
  CopperxNetworkError,
} from '../src/utils/errors'
import { asHTTPClient, MockHTTPClient } from './utils/mock-http-client'

describe('Products Resource', () => {
  let mockClient: MockHTTPClient
  let productsResource: ReturnType<typeof createProductsResource>

  beforeEach(() => {
    mockClient = new MockHTTPClient()
    productsResource = createProductsResource(asHTTPClient(mockClient))
  })

  describe('create()', () => {
    test('should create product successfully', async () => {
      const mockResponse: CreateProductResponse = {
        product: {
          id: 'prod_123',
          name: 'Test Product',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      }

      mockClient.setMockPost(async (url: string, data: unknown) => {
        expect(url).toBe('/api/v1/products')
        expect(data).toBeDefined()
        return mockResponse
      })

      const result = await productsResource.create({
        name: 'Test Product',
      })

      expect(result).toEqual(mockResponse)
      expect(result.product.id).toBe('prod_123')
    })

    test('should handle authentication error', async () => {
      mockClient.setMockPost(async () => {
        throw new CopperxAuthenticationError('Invalid API key')
      })

      await expect(
        productsResource.create({ name: 'Test Product' })
      ).rejects.toThrow(CopperxAuthenticationError)
    })

    test('should handle network error', async () => {
      mockClient.setMockPost(async () => {
        throw new CopperxNetworkError('Network error')
      })

      await expect(
        productsResource.create({ name: 'Test Product' })
      ).rejects.toThrow(CopperxNetworkError)
    })
  })

  describe('list()', () => {
    test('should list products successfully', async () => {
      const mockResponse: ListProductsResponse = {
        data: [
          {
            id: 'prod_123',
            name: 'Product 1',
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
        expect(url).toBe('/api/v1/products')
        return mockResponse
      })

      const result = await productsResource.list()

      expect(result).toEqual(mockResponse)
      expect(result.data).toHaveLength(1)
    })

    test('should handle error', async () => {
      mockClient.setMockGet(async () => {
        throw new CopperxAPIError('Server error', 500, 'SERVER_ERROR')
      })

      await expect(productsResource.list()).rejects.toThrow(CopperxAPIError)
    })
  })

  describe('get()', () => {
    test('should get product successfully', async () => {
      const mockResponse: ProductResponse = {
        product: {
          id: 'prod_123',
          name: 'Test Product',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      }

      mockClient.setMockGet(async (url: string) => {
        expect(url).toBe('/api/v1/products/prod_123')
        return mockResponse
      })

      const result = await productsResource.get('prod_123')

      expect(result).toEqual(mockResponse)
      expect(result.product.id).toBe('prod_123')
    })
  })

  describe('update()', () => {
    test('should update product successfully', async () => {
      const mockResponse: UpdateProductResponse = {
        product: {
          id: 'prod_123',
          name: 'Updated Product',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
        },
      }

      mockClient.setMockPut(async (url: string, data: unknown) => {
        expect(url).toBe('/api/v1/products/prod_123')
        expect(data).toBeDefined()
        return mockResponse
      })

      const result = await productsResource.update('prod_123', {
        name: 'Updated Product',
      })

      expect(result).toEqual(mockResponse)
    })
  })

  describe('delete()', () => {
    test('should delete product successfully', async () => {
      mockClient.setMockDelete(async (url: string) => {
        expect(url).toBe('/api/v1/products/prod_123')
        return undefined
      })

      await expect(productsResource.delete('prod_123')).resolves.toBeUndefined()
    })
  })

  describe('activate()', () => {
    test('should activate product successfully', async () => {
      const mockResponse: ProductResponse = {
        product: {
          id: 'prod_123',
          name: 'Test Product',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      }

      mockClient.setMockPut(async (url: string) => {
        expect(url).toBe('/api/v1/products/prod_123/activate')
        return mockResponse
      })

      const result = await productsResource.activate('prod_123')

      expect(result).toEqual(mockResponse)
      expect(result.product.isActive).toBe(true)
    })
  })

  describe('deactivate()', () => {
    test('should deactivate product successfully', async () => {
      const mockResponse: ProductResponse = {
        product: {
          id: 'prod_123',
          name: 'Test Product',
          isActive: false,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      }

      mockClient.setMockPut(async (url: string) => {
        expect(url).toBe('/api/v1/products/prod_123/deactivate')
        return mockResponse
      })

      const result = await productsResource.deactivate('prod_123')

      expect(result).toEqual(mockResponse)
      expect(result.product.isActive).toBe(false)
    })
  })
})


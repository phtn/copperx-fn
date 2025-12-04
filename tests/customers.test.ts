import { beforeEach, describe, expect, test } from 'bun:test'
import { createCustomersResource } from '../src/resources/customers'
import type {
  CreateCustomerResponse,
  CustomerResponse,
  ListCustomersResponse,
  UpdateCustomerResponse,
} from '../src/types/customers'
import {
  CopperxAPIError,
  CopperxAuthenticationError,
  CopperxNetworkError,
} from '../src/utils/errors'
import { asHTTPClient, MockHTTPClient } from './utils/mock-http-client'

describe('Customers Resource', () => {
  let mockClient: MockHTTPClient
  let customersResource: ReturnType<typeof createCustomersResource>

  beforeEach(() => {
    mockClient = new MockHTTPClient()
    customersResource = createCustomersResource(asHTTPClient(mockClient))
  })

  describe('create()', () => {
    test('should create customer successfully', async () => {
      const mockResponse: CreateCustomerResponse = {
        customer: {
          id: 'cus_123',
          email: 'customer@example.com',
          name: 'Test Customer',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      }

      mockClient.setMockPost(async (url: string, data: unknown) => {
        expect(url).toBe('/customers')
        expect(data).toBeDefined()
        return mockResponse
      })

      const result = await customersResource.create({
        email: 'customer@example.com',
        name: 'Test Customer',
      })

      expect(result).toEqual(mockResponse)
      expect(result.customer.id).toBe('cus_123')
    })

    test('should handle authentication error', async () => {
      mockClient.setMockPost(async () => {
        throw new CopperxAuthenticationError('Invalid API key')
      })

      await expect(
        customersResource.create({ email: 'test@example.com' })
      ).rejects.toThrow(CopperxAuthenticationError)
    })

    test('should handle API error', async () => {
      mockClient.setMockPost(async () => {
        throw new CopperxAPIError('Validation failed', 400, 'VALIDATION_ERROR')
      })

      await expect(
        customersResource.create({ email: 'invalid' })
      ).rejects.toThrow(CopperxAPIError)
    })

    test('should handle network error', async () => {
      mockClient.setMockPost(async () => {
        throw new CopperxNetworkError('Network error')
      })

      await expect(
        customersResource.create({ email: 'test@example.com' })
      ).rejects.toThrow(CopperxNetworkError)
    })
  })

  describe('list()', () => {
    test('should list customers successfully', async () => {
      const mockResponse: ListCustomersResponse = {
        data: [
          {
            id: 'cus_123',
            email: 'customer1@example.com',
            name: 'Customer 1',
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
        expect(url).toBe('/customers')
        return mockResponse
      })

      const result = await customersResource.list()

      expect(result).toEqual(mockResponse)
      expect(result.data).toHaveLength(1)
    })

    test('should list customers with params', async () => {
      const mockResponse: ListCustomersResponse = {
        data: [],
        pagination: {
          page: 2,
          limit: 20,
          total: 0,
          totalPages: 0,
        },
      }

      mockClient.setMockGet(async (url: string) => {
        expect(url).toBe('/customers')
        return mockResponse
      })

      const result = await customersResource.list({ page: 2, limit: 20 })

      expect(result).toEqual(mockResponse)
    })

    test('should handle error', async () => {
      mockClient.setMockGet(async () => {
        throw new CopperxAPIError('Server error', 500, 'SERVER_ERROR')
      })

      await expect(customersResource.list()).rejects.toThrow(CopperxAPIError)
    })
  })

  describe('get()', () => {
    test('should get customer successfully', async () => {
      const mockResponse: CustomerResponse = {
        customer: {
          id: 'cus_123',
          email: 'customer@example.com',
          name: 'Test Customer',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      }

      mockClient.setMockGet(async (url: string) => {
        expect(url).toBe('/customers/cus_123')
        return mockResponse
      })

      const result = await customersResource.get('cus_123')

      expect(result).toEqual(mockResponse)
      expect(result.customer.id).toBe('cus_123')
    })

    test('should handle not found error', async () => {
      mockClient.setMockGet(async () => {
        throw new CopperxAPIError('Customer not found', 404, 'NOT_FOUND')
      })

      await expect(customersResource.get('invalid')).rejects.toThrow(
        CopperxAPIError
      )
    })
  })

  describe('update()', () => {
    test('should update customer successfully', async () => {
      const mockResponse: UpdateCustomerResponse = {
        customer: {
          id: 'cus_123',
          email: 'updated@example.com',
          name: 'Updated Customer',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
        },
      }

      mockClient.setMockPut(async (url: string, data: unknown) => {
        expect(url).toBe('/customers/cus_123')
        expect(data).toBeDefined()
        return mockResponse
      })

      const result = await customersResource.update('cus_123', {
        name: 'Updated Customer',
      })

      expect(result).toEqual(mockResponse)
      expect(result.customer.name).toBe('Updated Customer')
    })

    test('should handle error', async () => {
      mockClient.setMockPut(async () => {
        throw new CopperxAPIError('Update failed', 400, 'VALIDATION_ERROR')
      })

      await expect(
        customersResource.update('cus_123', { name: '' })
      ).rejects.toThrow(CopperxAPIError)
    })
  })

  describe('delete()', () => {
    test('should delete customer successfully', async () => {
      mockClient.setMockDelete(async (url: string) => {
        expect(url).toBe('/customers/cus_123')
        return undefined
      })

      await expect(customersResource.delete('cus_123')).resolves.toBeUndefined()
    })

    test('should handle error', async () => {
      mockClient.setMockDelete(async () => {
        throw new CopperxAPIError('Delete failed', 404, 'NOT_FOUND')
      })

      await expect(customersResource.delete('invalid')).rejects.toThrow(
        CopperxAPIError
      )
    })
  })
})


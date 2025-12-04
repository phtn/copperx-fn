import { beforeEach, describe, expect, test } from 'bun:test'
import { createTaxRatesResource } from '../src/resources/tax-rates'
import type {
  CreateTaxRateResponse,
  ListTaxRatesResponse,
  TaxRateResponse,
  UpdateTaxRateResponse,
} from '../src/types/tax-rates'
import {
  CopperxAPIError,
  CopperxAuthenticationError,
  CopperxNetworkError,
} from '../src/utils/errors'
import { asHTTPClient, MockHTTPClient } from './utils/mock-http-client'

describe('Tax Rates Resource', () => {
  let mockClient: MockHTTPClient
  let taxRatesResource: ReturnType<typeof createTaxRatesResource>

  beforeEach(() => {
    mockClient = new MockHTTPClient()
    taxRatesResource = createTaxRatesResource(asHTTPClient(mockClient))
  })

  describe('list()', () => {
    test('should list tax rates successfully', async () => {
      const mockResponse: ListTaxRatesResponse = {
        data: [
          {
            id: 'tax_123',
            name: 'VAT',
            rate: 20,
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
        expect(url).toBe('/tax-rates')
        return mockResponse
      })

      const result = await taxRatesResource.list()

      expect(result).toEqual(mockResponse)
      expect(result.data).toHaveLength(1)
    })

    test('should handle error', async () => {
      mockClient.setMockGet(async () => {
        throw new CopperxAPIError('Server error', 500, 'SERVER_ERROR')
      })

      await expect(taxRatesResource.list()).rejects.toThrow(CopperxAPIError)
    })
  })

  describe('create()', () => {
    test('should create tax rate successfully', async () => {
      const mockResponse: CreateTaxRateResponse = {
        taxRate: {
          id: 'tax_123',
          name: 'VAT',
          rate: 20,
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      }

      mockClient.setMockPost(async (url: string, data: unknown) => {
        expect(url).toBe('/tax-rates')
        expect(data).toBeDefined()
        return mockResponse
      })

      const result = await taxRatesResource.create({
        name: 'VAT',
        rate: 20,
      })

      expect(result).toEqual(mockResponse)
      expect(result.taxRate.name).toBe('VAT')
    })

    test('should handle authentication error', async () => {
      mockClient.setMockPost(async () => {
        throw new CopperxAuthenticationError('Invalid API key')
      })

      await expect(
        taxRatesResource.create({ name: 'VAT', rate: 20 })
      ).rejects.toThrow(CopperxAuthenticationError)
    })
  })

  describe('get()', () => {
    test('should get tax rate successfully', async () => {
      const mockResponse: TaxRateResponse = {
        taxRate: {
          id: 'tax_123',
          name: 'VAT',
          rate: 20,
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      }

      mockClient.setMockGet(async (url: string) => {
        expect(url).toBe('/tax-rates/tax_123')
        return mockResponse
      })

      const result = await taxRatesResource.get('tax_123')

      expect(result).toEqual(mockResponse)
    })
  })

  describe('update()', () => {
    test('should update tax rate successfully', async () => {
      const mockResponse: UpdateTaxRateResponse = {
        taxRate: {
          id: 'tax_123',
          name: 'Updated VAT',
          rate: 25,
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
        },
      }

      mockClient.setMockPut(async (url: string, data: unknown) => {
        expect(url).toBe('/tax-rates/tax_123')
        expect(data).toBeDefined()
        return mockResponse
      })

      const result = await taxRatesResource.update('tax_123', {
        rate: 25,
      })

      expect(result).toEqual(mockResponse)
    })
  })

  describe('activate()', () => {
    test('should activate tax rate successfully', async () => {
      const mockResponse: TaxRateResponse = {
        taxRate: {
          id: 'tax_123',
          name: 'VAT',
          rate: 20,
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      }

      mockClient.setMockPut(async (url: string) => {
        expect(url).toBe('/tax-rates/tax_123/activate')
        return mockResponse
      })

      const result = await taxRatesResource.activate('tax_123')

      expect(result).toEqual(mockResponse)
      expect(result.taxRate.isActive).toBe(true)
    })
  })

  describe('deactivate()', () => {
    test('should deactivate tax rate successfully', async () => {
      const mockResponse: TaxRateResponse = {
        taxRate: {
          id: 'tax_123',
          name: 'VAT',
          rate: 20,
          isActive: false,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      }

      mockClient.setMockPut(async (url: string) => {
        expect(url).toBe('/tax-rates/tax_123/deactivate')
        return mockResponse
      })

      const result = await taxRatesResource.deactivate('tax_123')

      expect(result).toEqual(mockResponse)
      expect(result.taxRate.isActive).toBe(false)
    })

    test('should handle network error', async () => {
      mockClient.setMockPut(async () => {
        throw new CopperxNetworkError('Network error')
      })

      await expect(taxRatesResource.deactivate('tax_123')).rejects.toThrow(
        CopperxNetworkError
      )
    })
  })
})


import { beforeEach, describe, expect, test } from 'bun:test'
import { createInvoicesResource } from '../src/resources/invoices'
import type {
  CreateInvoiceResponse,
  Invoice,
  InvoiceResponse,
  ListInvoicesResponse,
  UpdateInvoiceResponse,
} from '../src/types/invoices'
import {
  CopperxAPIError,
  CopperxAuthenticationError,
  CopperxNetworkError,
} from '../src/utils/errors'
import { asHTTPClient, MockHTTPClient } from './utils/mock-http-client'

const createMockInvoice = (overrides: Partial<Invoice> = {}): Invoice => ({
  id: 'inv_123',
  customerId: 'cus_123',
  status: 'draft',
  amount: 1000,
  currency: 'USD',
  lineItems: [
    {
      id: 'li_123',
      description: 'Test item',
      quantity: 1,
      unitAmount: 1000,
      totalAmount: 1000,
    },
  ],
  subtotal: 1000,
  tax: 0,
  total: 1000,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  ...overrides,
})

describe('Invoices Resource', () => {
  let mockClient: MockHTTPClient
  let invoicesResource: ReturnType<typeof createInvoicesResource>

  beforeEach(() => {
    mockClient = new MockHTTPClient()
    invoicesResource = createInvoicesResource(asHTTPClient(mockClient))
  })

  describe('create()', () => {
    test('should create invoice successfully', async () => {
      const mockResponse: CreateInvoiceResponse = {
        invoice: {
          id: 'inv_123',
          customerId: 'cus_123',
          status: 'draft',
          amount: 1000,
          currency: 'USD',
          lineItems: [
            {
              id: 'li_123',
              description: 'Test item',
              quantity: 1,
              unitAmount: 1000,
              totalAmount: 1000,
            },
          ],
          subtotal: 1000,
          tax: 0,
          total: 1000,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      }

      mockClient.setMockPost(async (url: string, data: unknown) => {
        expect(url).toBe('/api/v1/invoices')
        expect(data).toBeDefined()
        return mockResponse
      })

      const result = await invoicesResource.create({
        customerId: 'cus_123',
        lineItems: [
          {
            description: 'Test item',
            quantity: 1,
            unitAmount: 1000,
          },
        ],
      })

      expect(result).toEqual(mockResponse)
      expect(result.invoice.id).toBe('inv_123')
    })

    test('should handle authentication error', async () => {
      mockClient.setMockPost(async () => {
        throw new CopperxAuthenticationError('Invalid API key')
      })

      await expect(
        invoicesResource.create({
          customerId: 'cus_123',
          lineItems: [
            {
              description: 'Test item',
              quantity: 1,
              unitAmount: 1000,
            },
          ],
        })
      ).rejects.toThrow(CopperxAuthenticationError)
    })
  })

  describe('list()', () => {
    test('should list invoices successfully', async () => {
      const mockResponse: ListInvoicesResponse = {
        data: [
          {
            id: 'inv_123',
            customerId: 'cus_123',
            status: 'paid',
            amount: 1000,
            currency: 'USD',
            lineItems: [
              {
                id: 'li_123',
                description: 'Test item',
                quantity: 1,
                unitAmount: 1000,
                totalAmount: 1000,
              },
            ],
            subtotal: 1000,
            tax: 0,
            total: 1000,
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
        expect(url).toBe('/api/v1/invoices')
        return mockResponse
      })

      const result = await invoicesResource.list()

      expect(result).toEqual(mockResponse)
      expect(result.data).toHaveLength(1)
    })
  })

  describe('get()', () => {
    test('should get invoice successfully', async () => {
      const mockResponse: InvoiceResponse = {
        invoice: {
          id: 'inv_123',
          customerId: 'cus_123',
          status: 'paid',
          amount: 1000,
          currency: 'USD',
          lineItems: [
            {
              id: 'li_123',
              description: 'Test item',
              quantity: 1,
              unitAmount: 1000,
              totalAmount: 1000,
            },
          ],
          subtotal: 1000,
          tax: 0,
          total: 1000,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      }

      mockClient.setMockGet(async (url: string) => {
        expect(url).toBe('/api/v1/invoices/inv_123')
        return mockResponse
      })

      const result = await invoicesResource.get('inv_123')

      expect(result).toEqual(mockResponse)
    })
  })

  describe('update()', () => {
    test('should update invoice successfully', async () => {
      const mockResponse: UpdateInvoiceResponse = {
        invoice: {
          id: 'inv_123',
          customerId: 'cus_123',
          status: 'draft',
          amount: 2000,
          currency: 'USD',
          lineItems: [
            {
              id: 'li_123',
              description: 'Updated item',
              quantity: 2,
              unitAmount: 1000,
              totalAmount: 2000,
            },
          ],
          subtotal: 2000,
          tax: 0,
          total: 2000,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
        },
      }

      mockClient.setMockPut(async (url: string, data: unknown) => {
        expect(url).toBe('/api/v1/invoices/inv_123')
        expect(data).toBeDefined()
        return mockResponse
      })

      const result = await invoicesResource.update('inv_123', {
        lineItems: [
          {
            description: 'Updated item',
            quantity: 2,
            unitAmount: 1000,
          },
        ],
      })

      expect(result).toEqual(mockResponse)
    })
  })

  describe('delete()', () => {
    test('should delete invoice successfully', async () => {
      mockClient.setMockDelete(async (url: string) => {
        expect(url).toBe('/api/v1/invoices/inv_123')
        return undefined
      })

      await expect(invoicesResource.delete('inv_123')).resolves.toBeUndefined()
    })
  })

  describe('duplicate()', () => {
    test('should duplicate invoice successfully', async () => {
      const mockResponse: CreateInvoiceResponse = {
        invoice: createMockInvoice({ id: 'inv_456' }),
      }

      mockClient.setMockPost(async (url: string) => {
        expect(url).toBe('/api/v1/invoices/inv_123/duplicate')
        return mockResponse
      })

      const result = await invoicesResource.duplicate('inv_123')

      expect(result).toEqual(mockResponse)
    })
  })

  describe('void()', () => {
    test('should void invoice successfully', async () => {
      const mockResponse: InvoiceResponse = {
        invoice: createMockInvoice({ status: 'void', updatedAt: '2024-01-02T00:00:00Z' }),
      }

      mockClient.setMockPost(async (url: string) => {
        expect(url).toBe('/api/v1/invoices/inv_123/void')
        return mockResponse
      })

      const result = await invoicesResource.void('inv_123')

      expect(result).toEqual(mockResponse)
      expect(result.invoice.status).toBe('void')
    })
  })

  describe('markUncollectible()', () => {
    test('should mark invoice as uncollectible successfully', async () => {
      const mockResponse: InvoiceResponse = {
        invoice: createMockInvoice({ status: 'uncollectible', updatedAt: '2024-01-02T00:00:00Z' }),
      }

      mockClient.setMockPost(async (url: string) => {
        expect(url).toBe('/api/v1/invoices/inv_123/uncollectible')
        return mockResponse
      })

      const result = await invoicesResource.markUncollectible('inv_123')

      expect(result).toEqual(mockResponse)
    })
  })

  describe('finalize()', () => {
    test('should finalize invoice successfully', async () => {
      const mockResponse: InvoiceResponse = {
        invoice: createMockInvoice({ status: 'open', updatedAt: '2024-01-02T00:00:00Z' }),
      }

      mockClient.setMockPost(async (url: string) => {
        expect(url).toBe('/api/v1/invoices/inv_123/finalize')
        return mockResponse
      })

      const result = await invoicesResource.finalize('inv_123')

      expect(result).toEqual(mockResponse)
    })
  })

  describe('send()', () => {
    test('should send invoice successfully', async () => {
      const mockResponse: InvoiceResponse = {
        invoice: createMockInvoice({ status: 'open', updatedAt: '2024-01-02T00:00:00Z' }),
      }

      mockClient.setMockPost(async (url: string, data: unknown) => {
        expect(url).toBe('/api/v1/invoices/inv_123/send')
        return mockResponse
      })

      const result = await invoicesResource.send('inv_123')

      expect(result).toEqual(mockResponse)
    })

    test('should send invoice with params', async () => {
      const mockResponse: InvoiceResponse = {
        invoice: createMockInvoice({ status: 'open', updatedAt: '2024-01-02T00:00:00Z' }),
      }

      mockClient.setMockPost(async (url: string, data: unknown) => {
        expect(url).toBe('/api/v1/invoices/inv_123/send')
        expect(data).toBeDefined()
        return mockResponse
      })

      const result = await invoicesResource.send('inv_123', {
        email: 'customer@example.com',
      })

      expect(result).toEqual(mockResponse)
    })
  })

  describe('markPaid()', () => {
    test('should mark invoice as paid successfully', async () => {
      const mockResponse: InvoiceResponse = {
        invoice: createMockInvoice({ status: 'paid', updatedAt: '2024-01-02T00:00:00Z' }),
      }

      mockClient.setMockPost(async (url: string, data: unknown) => {
        expect(url).toBe('/api/v1/invoices/inv_123/mark-paid')
        return mockResponse
      })

      const result = await invoicesResource.markPaid('inv_123')

      expect(result).toEqual(mockResponse)
      expect(result.invoice.status).toBe('paid')
    })

    test('should handle network error', async () => {
      mockClient.setMockPost(async () => {
        throw new CopperxNetworkError('Network error')
      })

      await expect(invoicesResource.markPaid('inv_123')).rejects.toThrow(
        CopperxNetworkError
      )
    })
  })
})


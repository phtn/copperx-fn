import { beforeEach, describe, expect, test } from 'bun:test'
import { createWithdrawalAddressesResource } from '../src/resources/withdrawal-addresses'
import type {
  CreateWithdrawalAddressResponse,
  ListWithdrawalAddressesResponse,
  UpdateWithdrawalAddressResponse,
  WithdrawalAddressResponse,
} from '../src/types/withdrawal'
import {
  CopperxAPIError,
  CopperxAuthenticationError,
  CopperxNetworkError,
} from '../src/utils/errors'
import { asHTTPClient, MockHTTPClient } from './utils/mock-http-client'

describe('Withdrawal Addresses Resource', () => {
  let mockClient: MockHTTPClient
  let withdrawalAddressesResource: ReturnType<
    typeof createWithdrawalAddressesResource
  >

  beforeEach(() => {
    mockClient = new MockHTTPClient()
    withdrawalAddressesResource = createWithdrawalAddressesResource(
      asHTTPClient(mockClient)
    )
  })

  describe('list()', () => {
    test('should list withdrawal addresses successfully', async () => {
      const mockResponse: ListWithdrawalAddressesResponse = {
        data: [
          {
            id: 'wa_123',
            address: '0x123...',
            chainId: 'eth',
            isDefault: false,
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
        expect(url).toBe('/withdrawal-addresses')
        return mockResponse
      })

      const result = await withdrawalAddressesResource.list()

      expect(result).toEqual(mockResponse)
      expect(result.data).toHaveLength(1)
    })

    test('should handle error', async () => {
      mockClient.setMockGet(async () => {
        throw new CopperxAPIError('Server error', 500, 'SERVER_ERROR')
      })

      await expect(withdrawalAddressesResource.list()).rejects.toThrow(
        CopperxAPIError
      )
    })
  })

  describe('create()', () => {
    test('should create withdrawal address successfully', async () => {
      const mockResponse: CreateWithdrawalAddressResponse = {
        withdrawalAddress: {
          id: 'wa_123',
          address: '0x123...',
          chainId: 'eth',
          isDefault: false,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      }

      mockClient.setMockPost(async (url: string, data: unknown) => {
        expect(url).toBe('/withdrawal-addresses')
        expect(data).toBeDefined()
        return mockResponse
      })

      const result = await withdrawalAddressesResource.create({
        address: '0x123...',
        chainId: 'eth',
      })

      expect(result).toEqual(mockResponse)
    })

    test('should handle authentication error', async () => {
      mockClient.setMockPost(async () => {
        throw new CopperxAuthenticationError('Invalid API key')
      })

      await expect(
        withdrawalAddressesResource.create({
          address: '0x123...',
          chainId: 'eth',
        })
      ).rejects.toThrow(CopperxAuthenticationError)
    })
  })

  describe('get()', () => {
    test('should get withdrawal address successfully', async () => {
      const mockResponse: WithdrawalAddressResponse = {
        withdrawalAddress: {
          id: 'wa_123',
          address: '0x123...',
          chainId: 'eth',
          isDefault: false,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      }

      mockClient.setMockGet(async (url: string) => {
        expect(url).toBe('/withdrawal-addresses/wa_123')
        return mockResponse
      })

      const result = await withdrawalAddressesResource.get('wa_123')

      expect(result).toEqual(mockResponse)
    })
  })

  describe('update()', () => {
    test('should update withdrawal address successfully', async () => {
      const mockResponse: UpdateWithdrawalAddressResponse = {
        withdrawalAddress: {
          id: 'wa_123',
          address: '0x456...',
          chainId: 'eth',
          isDefault: false,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
        },
      }

      mockClient.setMockPut(async (url: string, data: unknown) => {
        expect(url).toBe('/withdrawal-addresses/wa_123')
        expect(data).toBeDefined()
        return mockResponse
      })

      const result = await withdrawalAddressesResource.update('wa_123', {
        address: '0x456...',
      })

      expect(result).toEqual(mockResponse)
    })
  })

  describe('delete()', () => {
    test('should delete withdrawal address successfully', async () => {
      mockClient.setMockDelete(async (url: string) => {
        expect(url).toBe('/withdrawal-addresses/wa_123')
        return undefined
      })

      await expect(
        withdrawalAddressesResource.delete('wa_123')
      ).resolves.toBeUndefined()
    })
  })

  describe('markAsDefault()', () => {
    test('should mark address as default successfully', async () => {
      const mockResponse: WithdrawalAddressResponse = {
        withdrawalAddress: {
          id: 'wa_123',
          address: '0x123...',
          chainId: 'eth',
          isDefault: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      }

      mockClient.setMockPost(async (url: string) => {
        expect(url).toBe('/withdrawal-addresses/wa_123/default')
        return mockResponse
      })

      const result = await withdrawalAddressesResource.markAsDefault('wa_123')

      expect(result).toEqual(mockResponse)
    })
  })
})


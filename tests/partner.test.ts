import { beforeEach, describe, expect, test } from 'bun:test'
import { createPartnerResource } from '../src/resources/partner'
import type {
  CreatePartnerAccountResponse,
  GetPartnerAccountsResponse,
} from '../src/types/partner'
import {
  CopperxAPIError,
  CopperxAuthenticationError,
  CopperxNetworkError,
} from '../src/utils/errors'
import { asHTTPClient, MockHTTPClient } from './utils/mock-http-client'

describe('Partner Resource', () => {
  let mockClient: MockHTTPClient
  let partnerResource: ReturnType<typeof createPartnerResource>

  beforeEach(() => {
    mockClient = new MockHTTPClient()
    partnerResource = createPartnerResource(asHTTPClient(mockClient))
  })

  describe('createAccount()', () => {
    test('should create partner account successfully', async () => {
      const mockResponse: CreatePartnerAccountResponse = {
        account: {
          id: 'acc_123',
          email: 'partner@example.com',
          organizationId: 'org_123',
          status: 'active',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      }

      mockClient.setMockPost(async (url: string, data: unknown) => {
        expect(url).toBe('/partner/accounts')
        expect(data).toBeDefined()
        return mockResponse
      })

      const result = await partnerResource.createAccount({
        email: 'partner@example.com',
        organizationId: 'org_123',
      })

      expect(result).toEqual(mockResponse)
      expect(result.account.id).toBe('acc_123')
    })

    test('should handle authentication error', async () => {
      mockClient.setMockPost(async () => {
        throw new CopperxAuthenticationError('Invalid API key')
      })

      await expect(
        partnerResource.createAccount({
          email: 'partner@example.com',
          organizationId: 'org_123',
        })
      ).rejects.toThrow(CopperxAuthenticationError)
    })

    test('should handle API error', async () => {
      mockClient.setMockPost(async () => {
        throw new CopperxAPIError('Validation failed', 400, 'VALIDATION_ERROR')
      })

      await expect(
        partnerResource.createAccount({
          email: 'invalid-email',
          organizationId: 'org_123',
        })
      ).rejects.toThrow(CopperxAPIError)
    })

    test('should handle network error', async () => {
      mockClient.setMockPost(async () => {
        throw new CopperxNetworkError('Network error')
      })

      await expect(
        partnerResource.createAccount({
          email: 'partner@example.com',
          organizationId: 'org_123',
        })
      ).rejects.toThrow(CopperxNetworkError)
    })
  })

  describe('getAccountsByEmails()', () => {
    test('should get partner accounts by emails successfully', async () => {
      const mockResponse: GetPartnerAccountsResponse = {
        accounts: [
          {
            id: 'acc_123',
            email: 'partner1@example.com',
            organizationId: 'org_123',
            status: 'active',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
          {
            id: 'acc_456',
            email: 'partner2@example.com',
            organizationId: 'org_456',
            status: 'active',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        ],
      }

      mockClient.setMockGet(async (url: string) => {
        expect(url).toBe('/partner/accounts/by-emails')
        return mockResponse
      })

      const result = await partnerResource.getAccountsByEmails({
        emails: ['partner1@example.com', 'partner2@example.com'],
      })

      expect(result).toEqual(mockResponse)
      expect(result.accounts).toHaveLength(2)
    })

    test('should handle single email', async () => {
      const mockResponse: GetPartnerAccountsResponse = {
        accounts: [
          {
            id: 'acc_123',
            email: 'partner@example.com',
            organizationId: 'org_123',
            status: 'active',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        ],
      }

      mockClient.setMockGet(async (url: string) => {
        expect(url).toBe('/partner/accounts/by-emails')
        return mockResponse
      })

      const result = await partnerResource.getAccountsByEmails({
        emails: ['partner@example.com'],
      })

      expect(result).toEqual(mockResponse)
      expect(result.accounts).toHaveLength(1)
    })

    test('should handle error', async () => {
      mockClient.setMockGet(async () => {
        throw new CopperxAPIError('Server error', 500, 'SERVER_ERROR')
      })

      await expect(
        partnerResource.getAccountsByEmails({
          emails: ['partner@example.com'],
        })
      ).rejects.toThrow(CopperxAPIError)
    })
  })
})


import { beforeEach, describe, expect, test } from 'bun:test'
import { createOrganizationResource } from '../src/resources/organization'
import type { OrganizationResponse } from '../src/types/organization'
import {
  CopperxAPIError,
  CopperxAuthenticationError,
  CopperxNetworkError,
} from '../src/utils/errors'
import { asHTTPClient, MockHTTPClient } from './utils/mock-http-client'

describe('Organization Resource', () => {
  let mockClient: MockHTTPClient
  let organizationResource: ReturnType<typeof createOrganizationResource>

  beforeEach(() => {
    mockClient = new MockHTTPClient()
    organizationResource = createOrganizationResource(asHTTPClient(mockClient))
  })

  describe('get()', () => {
    test('should get organization successfully', async () => {
      const mockResponse: OrganizationResponse = {
        organization: {
          id: 'org_123',
          name: 'Test Organization',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      }

      mockClient.setMockGet(async (url: string) => {
        expect(url).toBe('/organization')
        return mockResponse
      })

      const result = await organizationResource.get()

      expect(result).toEqual(mockResponse)
      expect(result.organization.id).toBe('org_123')
    })

    test('should handle authentication error', async () => {
      mockClient.setMockGet(async () => {
        throw new CopperxAuthenticationError('Invalid API key')
      })

      await expect(organizationResource.get()).rejects.toThrow(
        CopperxAuthenticationError
      )
    })

    test('should handle network error', async () => {
      mockClient.setMockGet(async () => {
        throw new CopperxNetworkError('Network error')
      })

      await expect(organizationResource.get()).rejects.toThrow(
        CopperxNetworkError
      )
    })
  })

  describe('updateBranding()', () => {
    test('should update branding successfully', async () => {
      const mockResponse: OrganizationResponse = {
        organization: {
          id: 'org_123',
          name: 'Test Organization',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
        },
      }

      mockClient.setMockPut(async (url: string, data: unknown) => {
        expect(url).toBe('/organization/branding')
        expect(data).toBeDefined()
        return mockResponse
      })

      const result = await organizationResource.updateBranding({
        primaryColor: '#000000',
      })

      expect(result).toEqual(mockResponse)
    })

    test('should handle error', async () => {
      mockClient.setMockPut(async () => {
        throw new CopperxAPIError('Update failed', 400, 'VALIDATION_ERROR')
      })

      await expect(
        organizationResource.updateBranding({ primaryColor: 'invalid' })
      ).rejects.toThrow(CopperxAPIError)
    })
  })

  describe('deleteBrandLogo()', () => {
    test('should delete brand logo successfully', async () => {
      mockClient.setMockDelete(async (url: string) => {
        expect(url).toBe('/organization/brand-logo')
        return undefined
      })

      await expect(
        organizationResource.deleteBrandLogo()
      ).resolves.toBeUndefined()
    })

    test('should handle error', async () => {
      mockClient.setMockDelete(async () => {
        throw new CopperxAPIError('Delete failed', 404, 'NOT_FOUND')
      })

      await expect(organizationResource.deleteBrandLogo()).rejects.toThrow(
        CopperxAPIError
      )
    })
  })
})


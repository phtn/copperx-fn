import { beforeEach, describe, expect, test } from 'bun:test'
import { createUsersResource } from '../src/resources/users'
import type {
  ListUsersResponse,
  UpdateUserRoleResponse,
} from '../src/types/users'
import {
  CopperxAPIError,
  CopperxAuthenticationError,
  CopperxNetworkError,
} from '../src/utils/errors'
import { asHTTPClient, MockHTTPClient } from './utils/mock-http-client'

describe('Users Resource', () => {
  let mockClient: MockHTTPClient
  let usersResource: ReturnType<typeof createUsersResource>

  beforeEach(() => {
    mockClient = new MockHTTPClient()
    usersResource = createUsersResource(asHTTPClient(mockClient))
  })

  describe('list()', () => {
    test('should list users successfully', async () => {
      const mockResponse: ListUsersResponse = {
        data: [
          {
            id: 'user_123',
            email: 'user@example.com',
            name: 'Test User',
            role: 'admin',
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
        expect(url).toBe('/api/v1/users')
        return mockResponse
      })

      const result = await usersResource.list()

      expect(result).toEqual(mockResponse)
      expect(result.data).toHaveLength(1)
    })

    test('should list users with params', async () => {
      const mockResponse: ListUsersResponse = {
        data: [],
        pagination: {
          page: 2,
          limit: 20,
          total: 0,
          totalPages: 0,
        },
      }

      mockClient.setMockGet(async (url: string) => {
        expect(url).toBe('/api/v1/users')
        return mockResponse
      })

      const result = await usersResource.list({ page: 2, limit: 20 })

      expect(result).toEqual(mockResponse)
    })

    test('should handle authentication error', async () => {
      mockClient.setMockGet(async () => {
        throw new CopperxAuthenticationError('Invalid API key')
      })

      await expect(usersResource.list()).rejects.toThrow(
        CopperxAuthenticationError
      )
    })

    test('should handle network error', async () => {
      mockClient.setMockGet(async () => {
        throw new CopperxNetworkError('Network error')
      })

      await expect(usersResource.list()).rejects.toThrow(CopperxNetworkError)
    })
  })

  describe('delete()', () => {
    test('should delete user successfully', async () => {
      mockClient.setMockDelete(async (url: string) => {
        expect(url).toBe('/api/v1/users/user_123')
        return undefined
      })

      await expect(usersResource.delete('user_123')).resolves.toBeUndefined()
    })

    test('should handle error', async () => {
      mockClient.setMockDelete(async () => {
        throw new CopperxAPIError('User not found', 404, 'NOT_FOUND')
      })

      await expect(usersResource.delete('invalid')).rejects.toThrow(
        CopperxAPIError
      )
    })
  })

  describe('updateRole()', () => {
    test('should update user role successfully', async () => {
      const mockResponse: UpdateUserRoleResponse = {
        user: {
          id: 'user_123',
          email: 'user@example.com',
          role: 'admin',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
        },
      }

      mockClient.setMockPut(async (url: string, data: unknown) => {
        expect(url).toBe('/api/v1/users/user_123/role')
        expect(data).toBeDefined()
        return mockResponse
      })

      const result = await usersResource.updateRole('user_123', {
        role: 'admin',
      })

      expect(result).toEqual(mockResponse)
      expect(result.user.role).toBe('admin')
    })

    test('should handle error', async () => {
      mockClient.setMockPut(async () => {
        throw new CopperxAPIError('Invalid role', 400, 'VALIDATION_ERROR')
      })

      await expect(
        usersResource.updateRole('user_123', { role: 'invalid' as never })
      ).rejects.toThrow(CopperxAPIError)
    })
  })
})


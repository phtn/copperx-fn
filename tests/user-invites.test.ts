import { beforeEach, describe, expect, test } from 'bun:test'
import { createUserInvitesResource } from '../src/resources/user-invites'
import type {
  InviteUserResponse,
  ListUserInvitesResponse,
  UserInviteResponse,
} from '../src/types/user-invites'
import {
  CopperxAPIError,
  CopperxAuthenticationError,
  CopperxNetworkError,
} from '../src/utils/errors'
import { asHTTPClient, MockHTTPClient } from './utils/mock-http-client'

describe('User Invites Resource', () => {
  let mockClient: MockHTTPClient
  let userInvitesResource: ReturnType<typeof createUserInvitesResource>

  beforeEach(() => {
    mockClient = new MockHTTPClient()
    userInvitesResource = createUserInvitesResource(asHTTPClient(mockClient))
  })

  describe('list()', () => {
    test('should list user invites successfully', async () => {
      const mockResponse: ListUserInvitesResponse = {
        data: [
          {
            id: 'inv_123',
            email: 'invite@example.com',
            role: 'user',
            status: 'pending',
            expiresAt: '2024-01-08T00:00:00Z',
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
        expect(url).toBe('/user-invites')
        return mockResponse
      })

      const result = await userInvitesResource.list()

      expect(result).toEqual(mockResponse)
      expect(result.data).toHaveLength(1)
    })

    test('should handle error', async () => {
      mockClient.setMockGet(async () => {
        throw new CopperxAPIError('Server error', 500, 'SERVER_ERROR')
      })

      await expect(userInvitesResource.list()).rejects.toThrow(CopperxAPIError)
    })
  })

  describe('invite()', () => {
    test('should invite user successfully', async () => {
      const mockResponse: InviteUserResponse = {
        invite: {
          id: 'inv_123',
          email: 'invite@example.com',
          role: 'user',
          status: 'pending',
          expiresAt: '2024-01-08T00:00:00Z',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      }

      mockClient.setMockPost(async (url: string, data: unknown) => {
        expect(url).toBe('/user-invites')
        expect(data).toBeDefined()
        return mockResponse
      })

      const result = await userInvitesResource.invite({
        email: 'invite@example.com',
        role: 'user',
      })

      expect(result).toEqual(mockResponse)
    })

    test('should handle authentication error', async () => {
      mockClient.setMockPost(async () => {
        throw new CopperxAuthenticationError('Invalid API key')
      })

      await expect(
        userInvitesResource.invite({ email: 'test@example.com', role: 'user' })
      ).rejects.toThrow(CopperxAuthenticationError)
    })
  })

  describe('remove()', () => {
    test('should remove invite successfully', async () => {
      mockClient.setMockDelete(async (url: string) => {
        expect(url).toBe('/user-invites/inv_123')
        return undefined
      })

      await expect(userInvitesResource.remove('inv_123')).resolves.toBeUndefined()
    })
  })

  describe('resend()', () => {
    test('should resend invite successfully', async () => {
      const mockResponse: UserInviteResponse = {
        invite: {
          id: 'inv_123',
          email: 'invite@example.com',
          role: 'user',
          status: 'pending',
          expiresAt: '2024-01-08T00:00:00Z',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
        },
      }

      mockClient.setMockPost(async (url: string) => {
        expect(url).toBe('/user-invites/inv_123/resend')
        return mockResponse
      })

      const result = await userInvitesResource.resend('inv_123')

      expect(result).toEqual(mockResponse)
    })

    test('should handle network error', async () => {
      mockClient.setMockPost(async () => {
        throw new CopperxNetworkError('Network error')
      })

      await expect(userInvitesResource.resend('inv_123')).rejects.toThrow(
        CopperxNetworkError
      )
    })
  })
})


import { beforeEach, describe, expect, test } from 'bun:test'
import { createAuthResource } from '../src/resources/auth'
import type { AuthMeResponse, PointsTokenResponse } from '../src/types/auth'
import type { User } from '../src/types/users'
import { CopperxAPIError, CopperxAuthenticationError, CopperxNetworkError } from '../src/utils/errors'
import { asHTTPClient, MockHTTPClient } from './utils/mock-http-client'

describe('Auth Resource', () => {
  let mockClient: MockHTTPClient
  let authResource: ReturnType<typeof createAuthResource>

  beforeEach(() => {
    mockClient = new MockHTTPClient()
    authResource = createAuthResource(asHTTPClient(mockClient))
  })

  describe('me()', () => {
    test('should return current user successfully', async () => {
      const mockUser: User = {
        id: 'user_123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'admin',
        avatar: 'https://example.com/avatar.png',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }

      const mockResponse: AuthMeResponse = {
        user: mockUser
      }

      mockClient.setMockGet(async (url: string) => {
        expect(url).toBe('/api/v1/auth/me')
        return mockResponse
      })

      const result = await authResource.me()

      expect(result).toEqual(mockResponse)
      expect(result.user).toEqual(mockUser)
      expect(result.user.email).toBe('test@example.com')
      expect(result.user.role).toBe('admin')
    })

    test('should handle authentication error', async () => {
      mockClient.setMockGet(async () => {
        throw new CopperxAuthenticationError('Invalid API key')
      })

      await expect(authResource.me()).rejects.toThrow(CopperxAuthenticationError)
      await expect(authResource.me()).rejects.toThrow('Invalid API key')
    })

    test('should handle API error', async () => {
      mockClient.setMockGet(async () => {
        throw new CopperxAPIError('Internal server error', 500, 'SERVER_ERROR')
      })

      await expect(authResource.me()).rejects.toThrow(CopperxAPIError)
      try {
        await authResource.me()
      } catch (error) {
        expect(error).toBeInstanceOf(CopperxAPIError)
        if (error instanceof CopperxAPIError) {
          expect(error.statusCode).toBe(500)
          expect(error.code).toBe('SERVER_ERROR')
        }
      }
    })

    test('should handle network error', async () => {
      mockClient.setMockGet(async () => {
        throw new CopperxNetworkError('Network error')
      })

      await expect(authResource.me()).rejects.toThrow(CopperxNetworkError)
    })

    test('should handle user without optional fields', async () => {
      const mockUser: User = {
        id: 'user_456',
        email: 'minimal@example.com',
        role: 'user',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }

      const mockResponse: AuthMeResponse = {
        user: mockUser
      }

      mockClient.setMockGet(async () => mockResponse)

      const result = await authResource.me()

      expect(result.user).toEqual(mockUser)
      expect(result.user.name).toBeUndefined()
      expect(result.user.avatar).toBeUndefined()
    })
  })

  describe('getPointsToken()', () => {
    test('should return points token successfully', async () => {
      const mockResponse: PointsTokenResponse = {
        token: 'points_token_abc123'
      }

      mockClient.setMockPost(async (url: string, data: unknown) => {
        expect(url).toBe('/api/v1/auth/points-token')
        expect(data).toEqual({ points: 100 })
        return mockResponse
      })

      const result = await authResource.getPointsToken({ points: 100 })

      expect(result).toEqual(mockResponse)
      expect(result.token).toBe('points_token_abc123')
    })

    test('should handle different point values', async () => {
      const mockResponse: PointsTokenResponse = {
        token: 'points_token_xyz789'
      }

      mockClient.setMockPost(async (url: string, data: unknown) => {
        expect(url).toBe('/api/v1/auth/points-token')
        expect(data).toEqual({ points: 500 })
        return mockResponse
      })

      const result = await authResource.getPointsToken({ points: 500 })

      expect(result.token).toBe('points_token_xyz789')
    })

    test('should handle authentication error', async () => {
      mockClient.setMockPost(async () => {
        throw new CopperxAuthenticationError('Unauthorized')
      })

      await expect(authResource.getPointsToken({ points: 100 })).rejects.toThrow(CopperxAuthenticationError)
    })

    test('should handle validation error for invalid points', async () => {
      mockClient.setMockPost(async () => {
        throw new CopperxAPIError('Invalid points value', 400, 'VALIDATION_ERROR')
      })

      await expect(authResource.getPointsToken({ points: -10 })).rejects.toThrow(CopperxAPIError)
    })

    test('should handle network error', async () => {
      mockClient.setMockPost(async () => {
        throw new CopperxNetworkError('Connection timeout')
      })

      await expect(authResource.getPointsToken({ points: 100 })).rejects.toThrow(CopperxNetworkError)
    })
  })

  describe('Integration scenarios', () => {
    test('should handle sequential calls', async () => {
      const mockUser: User = {
        id: 'user_789',
        email: 'sequential@example.com',
        role: 'user',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }

      const mockAuthResponse: AuthMeResponse = {
        user: mockUser
      }

      const mockTokenResponse: PointsTokenResponse = {
        token: 'sequential_token'
      }

      let callCount = 0
      mockClient.setMockGet(async () => {
        callCount++
        return mockAuthResponse
      })

      mockClient.setMockPost(async () => {
        callCount++
        return mockTokenResponse
      })

      const userResult = await authResource.me()
      const tokenResult = await authResource.getPointsToken({ points: 200 })

      expect(userResult.user.email).toBe('sequential@example.com')
      expect(tokenResult.token).toBe('sequential_token')
      expect(callCount).toBe(2)
    })
  })
})

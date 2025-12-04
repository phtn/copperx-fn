import { beforeEach, describe, expect, test } from 'bun:test'
import { createWebhooksResource } from '../src/resources/webhooks'
import type {
  CreateWebhookEndpointResponse,
  ListWebhookEndpointsResponse,
  RegenerateWebhookSecretResponse,
  TestWebhookResponse,
  UpdateWebhookEndpointResponse,
  WebhookEndpointResponse,
} from '../src/types/webhooks'
import {
  CopperxAPIError,
  CopperxAuthenticationError,
  CopperxNetworkError,
} from '../src/utils/errors'
import { asHTTPClient, MockHTTPClient } from './utils/mock-http-client'

describe('Webhooks Resource', () => {
  let mockClient: MockHTTPClient
  let webhooksResource: ReturnType<typeof createWebhooksResource>

  beforeEach(() => {
    mockClient = new MockHTTPClient()
    webhooksResource = createWebhooksResource(asHTTPClient(mockClient))
  })

  describe('list()', () => {
    test('should list webhook endpoints successfully', async () => {
      const mockResponse: ListWebhookEndpointsResponse = {
        data: [
          {
            id: 'wh_123',
            url: 'https://example.com/webhook',
            events: ['payment.completed'],
            isActive: true,
            secret: 'whsec_secret_123',
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
        expect(url).toBe('/webhook-endpoints')
        return mockResponse
      })

      const result = await webhooksResource.list()

      expect(result).toEqual(mockResponse)
      expect(result.data).toHaveLength(1)
    })

    test('should handle error', async () => {
      mockClient.setMockGet(async () => {
        throw new CopperxAPIError('Server error', 500, 'SERVER_ERROR')
      })

      await expect(webhooksResource.list()).rejects.toThrow(CopperxAPIError)
    })
  })

  describe('create()', () => {
    test('should create webhook endpoint successfully', async () => {
      const mockResponse: CreateWebhookEndpointResponse = {
        webhookEndpoint: {
          id: 'wh_123',
          url: 'https://example.com/webhook',
          events: ['payment.completed'],
          isActive: true,
          secret: 'whsec_secret_123',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      }

      mockClient.setMockPost(async (url: string, data: unknown) => {
        expect(url).toBe('/webhook-endpoints')
        expect(data).toBeDefined()
        return mockResponse
      })

      const result = await webhooksResource.create({
        url: 'https://example.com/webhook',
        events: ['payment.completed'],
      })

      expect(result).toEqual(mockResponse)
      expect(result.webhookEndpoint.url).toBe('https://example.com/webhook')
    })

    test('should handle authentication error', async () => {
      mockClient.setMockPost(async () => {
        throw new CopperxAuthenticationError('Invalid API key')
      })

      await expect(
        webhooksResource.create({
          url: 'https://example.com/webhook',
          events: ['payment.completed'],
        })
      ).rejects.toThrow(CopperxAuthenticationError)
    })
  })

  describe('get()', () => {
    test('should get webhook endpoint successfully', async () => {
      const mockResponse: WebhookEndpointResponse = {
        webhookEndpoint: {
          id: 'wh_123',
          url: 'https://example.com/webhook',
          events: ['payment.completed'],
          isActive: true,
          secret: 'whsec_secret_123',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      }

      mockClient.setMockGet(async (url: string) => {
        expect(url).toBe('/webhook-endpoints/wh_123')
        return mockResponse
      })

      const result = await webhooksResource.get('wh_123')

      expect(result).toEqual(mockResponse)
    })
  })

  describe('update()', () => {
    test('should update webhook endpoint successfully', async () => {
      const mockResponse: UpdateWebhookEndpointResponse = {
        webhookEndpoint: {
          id: 'wh_123',
          url: 'https://example.com/webhook-updated',
          events: ['payment.completed'],
          isActive: true,
          secret: 'whsec_secret_123',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
        },
      }

      mockClient.setMockPut(async (url: string, data: unknown) => {
        expect(url).toBe('/webhook-endpoints/wh_123')
        expect(data).toBeDefined()
        return mockResponse
      })

      const result = await webhooksResource.update('wh_123', {
        url: 'https://example.com/webhook-updated',
      })

      expect(result).toEqual(mockResponse)
    })
  })

  describe('delete()', () => {
    test('should delete webhook endpoint successfully', async () => {
      mockClient.setMockDelete(async (url: string) => {
        expect(url).toBe('/webhook-endpoints/wh_123')
        return undefined
      })

      await expect(webhooksResource.delete('wh_123')).resolves.toBeUndefined()
    })
  })

  describe('regenerateSecret()', () => {
    test('should regenerate webhook secret successfully', async () => {
      const mockResponse: RegenerateWebhookSecretResponse = {
        webhookEndpoint: {
          id: 'wh_123',
          url: 'https://example.com/webhook',
          events: ['payment.completed'],
          isActive: true,
          secret: 'whsec_new_secret_123',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      }

      mockClient.setMockPost(async (url: string) => {
        expect(url).toBe('/webhook-endpoints/wh_123/regenerate')
        return mockResponse
      })

      const result = await webhooksResource.regenerateSecret('wh_123')

      expect(result).toEqual(mockResponse)
      expect(result.webhookEndpoint.secret).toBe('whsec_new_secret_123')
    })
  })

  describe('test()', () => {
    test('should test webhook successfully', async () => {
      const mockResponse: TestWebhookResponse = {
        success: true,
      }

      mockClient.setMockPost(async (url: string, data: unknown) => {
        expect(url).toBe('/webhook-endpoints/wh_123/test')
        expect(data).toBeDefined()
        return mockResponse
      })

      const result = await webhooksResource.test('wh_123', {
        event: 'payment.completed',
      })

      expect(result).toEqual(mockResponse)
      expect(result.success).toBe(true)
    })

    test('should handle network error', async () => {
      mockClient.setMockPost(async () => {
        throw new CopperxNetworkError('Network error')
      })

      await expect(
        webhooksResource.test('wh_123', { event: 'payment.completed' })
      ).rejects.toThrow(CopperxNetworkError)
    })
  })
})


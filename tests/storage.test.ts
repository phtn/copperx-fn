import { beforeEach, describe, expect, test } from 'bun:test'
import { createStorageResource } from '../src/resources/storage'
import type { UploadFileResponse } from '../src/types/storage'
import {
  CopperxAPIError,
  CopperxAuthenticationError,
  CopperxNetworkError,
} from '../src/utils/errors'
import { asHTTPClient, MockHTTPClient } from './utils/mock-http-client'

describe('Storage Resource', () => {
  let mockClient: MockHTTPClient
  let storageResource: ReturnType<typeof createStorageResource>

  beforeEach(() => {
    mockClient = new MockHTTPClient()
    storageResource = createStorageResource(asHTTPClient(mockClient))
  })

  describe('uploadFile()', () => {
    test('should upload file successfully', async () => {
      const mockResponse: UploadFileResponse = {
        url: 'https://example.com/file.png',
        key: 'file-key-123',
      }

      const file = new Blob(['test content'], { type: 'text/plain' })

      mockClient.setMockPost(async (url: string, data: unknown) => {
        expect(url).toBe('/api/v1/storage/files/brand-logo')
        expect(data).toBeInstanceOf(FormData)
        return mockResponse
      })

      const result = await storageResource.uploadFile('brand-logo', {
        file,
      })

      expect(result).toEqual(mockResponse)
      expect(result.url).toBe('https://example.com/file.png')
    })

    test('should upload file with filename', async () => {
      const mockResponse: UploadFileResponse = {
        url: 'https://example.com/custom-name.png',
        key: 'file-key-456',
      }

      const file = new Blob(['test content'], { type: 'text/plain' })

      mockClient.setMockPost(async (url: string, data: unknown) => {
        expect(url).toBe('/api/v1/storage/files/brand-logo')
        return mockResponse
      })

      const result = await storageResource.uploadFile('brand-logo', {
        file,
        filename: 'custom-name.png',
      })

      expect(result).toEqual(mockResponse)
    })

    test('should handle authentication error', async () => {
      mockClient.setMockPost(async () => {
        throw new CopperxAuthenticationError('Invalid API key')
      })

      const file = new Blob(['test content'])

      await expect(
        storageResource.uploadFile('brand-logo', { file })
      ).rejects.toThrow(CopperxAuthenticationError)
    })

    test('should handle API error', async () => {
      mockClient.setMockPost(async () => {
        throw new CopperxAPIError('File too large', 400, 'VALIDATION_ERROR')
      })

      const file = new Blob(['test content'])

      await expect(
        storageResource.uploadFile('brand-logo', { file })
      ).rejects.toThrow(CopperxAPIError)
    })

    test('should handle network error', async () => {
      mockClient.setMockPost(async () => {
        throw new CopperxNetworkError('Network error')
      })

      const file = new Blob(['test content'])

      await expect(
        storageResource.uploadFile('brand-logo', { file })
      ).rejects.toThrow(CopperxNetworkError)
    })
  })
})


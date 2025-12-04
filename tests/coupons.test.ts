import { beforeEach, describe, expect, test } from 'bun:test'
import { createCouponsResource } from '../src/resources/coupons'
import type {
  CouponResponse,
  CreateCouponResponse,
  ListCouponsResponse,
  UpdateCouponResponse,
} from '../src/types/coupons'
import {
  CopperxAPIError,
  CopperxAuthenticationError,
  CopperxNetworkError,
} from '../src/utils/errors'
import { asHTTPClient, MockHTTPClient } from './utils/mock-http-client'

describe('Coupons Resource', () => {
  let mockClient: MockHTTPClient
  let couponsResource: ReturnType<typeof createCouponsResource>

  beforeEach(() => {
    mockClient = new MockHTTPClient()
    couponsResource = createCouponsResource(asHTTPClient(mockClient))
  })

  describe('list()', () => {
    test('should list coupons successfully', async () => {
      const mockResponse: ListCouponsResponse = {
        data: [
          {
            id: 'coupon_123',
            code: 'SAVE10',
            name: 'Save 10%',
            type: 'percentage',
            value: 10,
            status: 'active',
            timesRedeemed: 0,
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
        expect(url).toBe('/coupons')
        return mockResponse
      })

      const result = await couponsResource.list()

      expect(result).toEqual(mockResponse)
      expect(result.data).toHaveLength(1)
    })

    test('should handle error', async () => {
      mockClient.setMockGet(async () => {
        throw new CopperxAPIError('Server error', 500, 'SERVER_ERROR')
      })

      await expect(couponsResource.list()).rejects.toThrow(CopperxAPIError)
    })
  })

  describe('create()', () => {
    test('should create coupon successfully', async () => {
      const mockResponse: CreateCouponResponse = {
        coupon: {
          id: 'coupon_123',
          code: 'SAVE10',
          name: 'Save 10%',
          type: 'percentage',
          value: 10,
          status: 'active',
          timesRedeemed: 0,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      }

      mockClient.setMockPost(async (url: string, data: unknown) => {
        expect(url).toBe('/coupons')
        expect(data).toBeDefined()
        return mockResponse
      })

      const result = await couponsResource.create({
        code: 'SAVE10',
        name: 'Save 10%',
        type: 'percentage',
        value: 10,
      })

      expect(result).toEqual(mockResponse)
      expect(result.coupon.code).toBe('SAVE10')
    })

    test('should handle authentication error', async () => {
      mockClient.setMockPost(async () => {
        throw new CopperxAuthenticationError('Invalid API key')
      })

      await expect(
        couponsResource.create({
          code: 'SAVE10',
          name: 'Save 10%',
          type: 'percentage',
          value: 10,
        })
      ).rejects.toThrow(CopperxAuthenticationError)
    })
  })

  describe('get()', () => {
    test('should get coupon successfully', async () => {
      const mockResponse: CouponResponse = {
        coupon: {
          id: 'coupon_123',
          code: 'SAVE10',
          name: 'Save 10%',
          type: 'percentage',
          value: 10,
          status: 'active',
          timesRedeemed: 0,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      }

      mockClient.setMockGet(async (url: string) => {
        expect(url).toBe('/coupons/coupon_123')
        return mockResponse
      })

      const result = await couponsResource.get('coupon_123')

      expect(result).toEqual(mockResponse)
    })
  })

  describe('update()', () => {
    test('should update coupon successfully', async () => {
      const mockResponse: UpdateCouponResponse = {
        coupon: {
          id: 'coupon_123',
          code: 'SAVE10',
          name: 'Save 20%',
          type: 'percentage',
          value: 10,
          status: 'active',
          timesRedeemed: 0,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
        },
      }

      mockClient.setMockPut(async (url: string, data: unknown) => {
        expect(url).toBe('/coupons/coupon_123')
        expect(data).toBeDefined()
        return mockResponse
      })

      const result = await couponsResource.update('coupon_123', {
        name: 'Save 20%',
      })

      expect(result).toEqual(mockResponse)
    })
  })

  describe('enable()', () => {
    test('should enable coupon successfully', async () => {
      const mockResponse: CouponResponse = {
        coupon: {
          id: 'coupon_123',
          code: 'SAVE10',
          name: 'Save 10%',
          type: 'percentage',
          value: 10,
          status: 'active',
          timesRedeemed: 0,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      }

      mockClient.setMockPost(async (url: string) => {
        expect(url).toBe('/coupons/coupon_123/enable')
        return mockResponse
      })

      const result = await couponsResource.enable('coupon_123')

      expect(result).toEqual(mockResponse)
      expect(result.coupon.status).toBe('active')
    })
  })

  describe('disable()', () => {
    test('should disable coupon successfully', async () => {
      const mockResponse: CouponResponse = {
        coupon: {
          id: 'coupon_123',
          code: 'SAVE10',
          name: 'Save 10%',
          type: 'percentage',
          value: 10,
          status: 'inactive',
          timesRedeemed: 0,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      }

      mockClient.setMockPost(async (url: string) => {
        expect(url).toBe('/coupons/coupon_123/disable')
        return mockResponse
      })

      const result = await couponsResource.disable('coupon_123')

      expect(result).toEqual(mockResponse)
      expect(result.coupon.status).toBe('inactive')
    })
  })

  describe('archive()', () => {
    test('should archive coupon successfully', async () => {
      const mockResponse: CouponResponse = {
        coupon: {
          id: 'coupon_123',
          code: 'SAVE10',
          name: 'Save 10%',
          type: 'percentage',
          value: 10,
          status: 'archived',
          timesRedeemed: 0,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      }

      mockClient.setMockPost(async (url: string) => {
        expect(url).toBe('/coupons/coupon_123/archive')
        return mockResponse
      })

      const result = await couponsResource.archive('coupon_123')

      expect(result).toEqual(mockResponse)
    })

    test('should handle network error', async () => {
      mockClient.setMockPost(async () => {
        throw new CopperxNetworkError('Network error')
      })

      await expect(couponsResource.archive('coupon_123')).rejects.toThrow(
        CopperxNetworkError
      )
    })
  })
})


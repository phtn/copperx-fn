import type { AxiosRequestConfig } from 'axios';
import type { HTTPClient } from '../../src/utils/http';

export class MockHTTPClient {
  private mockGet?: (url: string, config?: AxiosRequestConfig) => Promise<unknown>;
  private mockPost?: (
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ) => Promise<unknown>;
  private mockPut?: (
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ) => Promise<unknown>;
  private mockDelete?: (url: string, config?: AxiosRequestConfig) => Promise<unknown>;
  private mockPatch?: (
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ) => Promise<unknown>;
  private mockRequest?: (
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ) => Promise<unknown>;

  setMockGet<T>(mockFn: (url: string, config?: AxiosRequestConfig) => Promise<T>): void {
    this.mockGet = mockFn as (url: string, config?: AxiosRequestConfig) => Promise<unknown>;
  }

  setMockPost<T>(
    mockFn: (url: string, data?: unknown, config?: AxiosRequestConfig) => Promise<T>
  ): void {
    this.mockPost = mockFn as (url: string, data?: unknown, config?: AxiosRequestConfig) => Promise<unknown>;
  }

  setMockPut<T>(
    mockFn: (url: string, data?: unknown, config?: AxiosRequestConfig) => Promise<T>
  ): void {
    this.mockPut = mockFn as (url: string, data?: unknown, config?: AxiosRequestConfig) => Promise<unknown>;
  }

  setMockDelete<T>(
    mockFn: (url: string, config?: AxiosRequestConfig) => Promise<T>
  ): void {
    this.mockDelete = mockFn as (url: string, config?: AxiosRequestConfig) => Promise<unknown>;
  }

  setMockPatch<T>(
    mockFn: (url: string, data?: unknown, config?: AxiosRequestConfig) => Promise<T>
  ): void {
    this.mockPatch = mockFn as (url: string, data?: unknown, config?: AxiosRequestConfig) => Promise<unknown>;
  }

  setMockRequest<T>(
    mockFn: (
      method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
      url: string,
      data?: unknown,
      config?: AxiosRequestConfig
    ) => Promise<T>
  ): void {
    this.mockRequest = mockFn as (
      method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
      url: string,
      data?: unknown,
      config?: AxiosRequestConfig
    ) => Promise<unknown>;
  }

  async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    if (this.mockRequest) {
      return this.mockRequest(method, url, data, config) as Promise<T>;
    }
    // Fallback to specific method mocks
    switch (method) {
      case 'GET':
        if (this.mockGet) return this.mockGet(url, config) as Promise<T>;
        break;
      case 'POST':
        if (this.mockPost) return this.mockPost(url, data, config) as Promise<T>;
        break;
      case 'PUT':
        if (this.mockPut) return this.mockPut(url, data, config) as Promise<T>;
        break;
      case 'DELETE':
        if (this.mockDelete) return this.mockDelete(url, config) as Promise<T>;
        break;
      case 'PATCH':
        if (this.mockPatch) return this.mockPatch(url, data, config) as Promise<T>;
        break;
    }
    throw new Error(`Mock ${method} not set for URL: ${url}`);
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    if (this.mockGet) {
      return this.mockGet(url, config) as Promise<T>;
    }
    throw new Error(`Mock GET not set for URL: ${url}`);
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    if (this.mockPost) {
      return this.mockPost(url, data, config) as Promise<T>;
    }
    throw new Error(`Mock POST not set for URL: ${url}`);
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    if (this.mockPut) {
      return this.mockPut(url, data, config) as Promise<T>;
    }
    throw new Error(`Mock PUT not set for URL: ${url}`);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    if (this.mockDelete) {
      return this.mockDelete(url, config) as Promise<T>;
    }
    throw new Error(`Mock DELETE not set for URL: ${url}`);
  }

  async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    if (this.mockPatch) {
      return this.mockPatch(url, data, config) as Promise<T>;
    }
    throw new Error(`Mock PATCH not set for URL: ${url}`);
  }
}

// Type assertion helper to use MockHTTPClient as HTTPClient
export function asHTTPClient(mock: MockHTTPClient): HTTPClient {
  return mock as unknown as HTTPClient;
}


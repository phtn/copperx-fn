import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios';
import {
  CopperxAPIError,
  CopperxAuthenticationError,
  CopperxNetworkError,
  CopperxValidationError,
} from './errors';

export interface HTTPClientConfig {
  apiKey: string;
  baseURL?: string;
  timeout?: number;
}

export class HTTPClient {
  private readonly client: AxiosInstance;
  private readonly apiKey: string;

  constructor(config: HTTPClientConfig) {
    this.apiKey = config.apiKey;
    this.client = axios.create({
      baseURL: config.baseURL || 'https://api.copperx.dev/api/v1',
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
    });
  }

  async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.request({
        method,
        url,
        data,
        ...config,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const statusCode = error.response.status;
          const errorData = error.response.data as
            | { message?: string; error?: string; code?: string }
            | undefined;

          const message =
            errorData?.message ||
            errorData?.error ||
            error.message ||
            'An error occurred';

          if (statusCode === 401) {
            throw new CopperxAuthenticationError(message);
          }

          if (statusCode === 400) {
            throw new CopperxValidationError(message, errorData);
          }

          throw new CopperxAPIError(
            message,
            statusCode,
            errorData?.code,
            errorData
          );
        }

        if (error.request) {
          throw new CopperxNetworkError(
            'Network error: No response received from server',
            error
          );
        }
      }

      throw new CopperxNetworkError(
        'An unexpected error occurred',
        error
      );
    }
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>('GET', url, undefined, config);
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request<T>('POST', url, data, config);
  }

  async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request<T>('PUT', url, data, config);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>('DELETE', url, config);
  }

  async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request<T>('PATCH', url, data, config);
  }
}


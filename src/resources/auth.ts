import { HTTPClient } from '../utils/http';
import type {
  AuthMeResponse,
  PointsTokenParams,
  PointsTokenResponse,
} from '../types/auth';

export function createAuthResource(client: HTTPClient) {
  return {
    async me(): Promise<AuthMeResponse> {
      return client.get<AuthMeResponse>('/api/v1/auth/me');
    },

    async getPointsToken(
      params: PointsTokenParams
    ): Promise<PointsTokenResponse> {
      return client.post<PointsTokenResponse>('/api/v1/auth/points-token', params);
    },
  };
}


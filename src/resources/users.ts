import { HTTPClient } from '../utils/http';
import type {
  ListUsersParams,
  ListUsersResponse,
  UpdateUserRoleParams,
  UpdateUserRoleResponse,
} from '../types/users';

export function createUsersResource(client: HTTPClient) {
  return {
    async list(params?: ListUsersParams): Promise<ListUsersResponse> {
      return client.get<ListUsersResponse>('/users', {
        params,
      });
    },

    async delete(userId: string): Promise<void> {
      return client.delete<void>(`/users/${userId}`);
    },

    async updateRole(
      userId: string,
      params: UpdateUserRoleParams
    ): Promise<UpdateUserRoleResponse> {
      return client.put<UpdateUserRoleResponse>(
        `/users/${userId}/role`,
        params
      );
    },
  };
}


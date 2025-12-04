import type { PaginationParams, PaginatedResponse, Timestamps } from './index';

export interface User extends Timestamps {
  id: string;
  email: string;
  name?: string;
  role: string;
  avatar?: string;
}

export interface ListUsersParams extends PaginationParams {
  role?: string;
  search?: string;
}

export interface ListUsersResponse extends PaginatedResponse<User> {}

export interface UpdateUserRoleParams {
  role: string;
}

export interface UpdateUserRoleResponse {
  user: User;
}


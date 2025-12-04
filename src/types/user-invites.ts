import type { PaginationParams, PaginatedResponse, Timestamps } from './index';

export interface UserInvite extends Timestamps {
  id: string;
  email: string;
  role: string;
  status: 'pending' | 'accepted' | 'expired';
  expiresAt: string;
}

export interface ListUserInvitesParams extends PaginationParams {
  status?: 'pending' | 'accepted' | 'expired';
}

export interface ListUserInvitesResponse
  extends PaginatedResponse<UserInvite> {}

export interface InviteUserParams {
  email: string;
  role: string;
}

export interface InviteUserResponse {
  invite: UserInvite;
}

export interface UserInviteResponse {
  invite: UserInvite;
}


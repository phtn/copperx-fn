import { HTTPClient } from '../utils/http';
import type {
  ListUserInvitesParams,
  ListUserInvitesResponse,
  InviteUserParams,
  InviteUserResponse,
  UserInviteResponse,
} from '../types/user-invites';

export function createUserInvitesResource(client: HTTPClient) {
  return {
    async list(params?: ListUserInvitesParams): Promise<ListUserInvitesResponse> {
      return client.get<ListUserInvitesResponse>('/user-invites', {
        params,
      });
    },

    async invite(params: InviteUserParams): Promise<InviteUserResponse> {
      return client.post<InviteUserResponse>('/user-invites', params);
    },

    async remove(inviteId: string): Promise<void> {
      return client.delete<void>(`/user-invites/${inviteId}`);
    },

    async resend(inviteId: string): Promise<UserInviteResponse> {
      return client.post<UserInviteResponse>(
        `/user-invites/${inviteId}/resend`
      );
    },
  };
}


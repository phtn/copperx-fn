import type { User } from './users'

export interface AuthMeResponse {
  user: User
}

export interface PointsTokenParams {
  points: number
}

export interface PointsTokenResponse {
  token: string
}

export interface UserAuth {
  email: string
  pwd: string
}

export interface UserProfile {
  nickname: string
  avatarUrl: string
}

export interface User extends UserAuth, UserProfile {}

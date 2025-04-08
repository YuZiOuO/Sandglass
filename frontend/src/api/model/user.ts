interface UserAuth {
  email: string
  pwd: string
}

interface UserProfile {
  nickname: string
  avatarUrl: string
}

interface User extends UserAuth, UserProfile {}

export type { User, UserAuth, UserProfile }

import { useMutation } from '@tanstack/vue-query'
import { authCli } from './common'
import router from '@/router'

export type SignUpForm = {
  name: string
  email: string
  password: string
}
export function useSignUpMutate() {
  return useMutation({
    mutationFn: async (form: SignUpForm) => {
      const createdUser = await authCli.signUp.email({
        email: form.email,
        password: form.password,
        name: form.name,
      })
      return createdUser
    },
  })
}

export type SignInForm = {
  email: string
  password: string
}
export function useSignInMutate() {
  return useMutation({
    mutationFn: async (form: SignInForm) => {
      const createdSession = await authCli.signIn.email({
        email: form.email,
        password: form.password,
      })
      return createdSession
    },
  })
}

export type socialProviders = Parameters<typeof authCli.signIn.social>[0]['provider']
export function useSocialSignInMutate(provider: socialProviders) {
  return useMutation({
    mutationFn: async () => {
      const callbackRoute = router.resolve({ name: 'OAuthSuccess' })
      const callbackURL = new URL(callbackRoute.href, window.location.origin).href

      const createdSession = await authCli.signIn.social({
        provider: provider,
        callbackURL: callbackURL,
      })
      return createdSession
    },
  })
}

export function usePasskeySignInMutate() {
  return useMutation({
    mutationFn: async () => {
      const createdSession = await authCli.signIn.passkey()
      return createdSession
    },
  })
}

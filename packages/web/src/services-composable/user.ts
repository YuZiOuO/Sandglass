import { useMutation } from '@tanstack/vue-query'
import { authCli } from './common'

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

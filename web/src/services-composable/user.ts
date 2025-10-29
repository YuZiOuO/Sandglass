import { useFirebase } from '@/services-composable/firebase'
import * as authSdk from 'firebase/auth'
import { useMutation } from '@tanstack/vue-query'

export function useSignup() {
  return useMutation({
    mutationFn: async (params: { email: string; password: string }) => {
      const fbService = useFirebase()
      try {
        authSdk.createUserWithEmailAndPassword(fbService.auth, params.email, params.password)
      } catch (e) {
        throw e
      }
    },
  })
}

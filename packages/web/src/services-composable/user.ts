import { useFirebase } from '@/services-composable/firebase'
import { useMutation } from '@tanstack/vue-query'
import { createUserWithEmailAndPassword } from 'firebase/auth'

export function useSignup() {
  return useMutation({
    mutationFn: async (params: { email: string; password: string }) => {
      const fbService = useFirebase()
      try {
        await createUserWithEmailAndPassword(fbService.auth, params.email, params.password)
      } catch (e) {
        throw e
      }
    },
  })
}

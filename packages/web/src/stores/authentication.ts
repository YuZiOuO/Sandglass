import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useFirebase } from '@/services-composable/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'

export const useAuthenticationStore = defineStore('authentication', () => {
  const currentUid = ref<string | null>(null)
  const uid = computed(() => currentUid.value)

  async function login(email: string, password: string) {
    if (currentUid.value) {
      return
    }

    const fbService = useFirebase()
    try {
      await signInWithEmailAndPassword(fbService.auth, email, password)
      currentUid.value = fbService.auth.currentUser!.uid
    } catch (e) {
      throw e
    }
  }

  async function logout() {
    if (!currentUid.value) {
      return
    }

    const fbService = useFirebase()
    await fbService.auth.signOut()

    currentUid.value = null
  }

  return { login, logout, uid }
})

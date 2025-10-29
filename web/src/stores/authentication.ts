import { defineStore } from 'pinia'
import * as authSdk from 'firebase/auth'
import { computed, ref } from 'vue'
import { useFirebase } from '@/services-composable/firebase'

export const useAuthenticationStore = defineStore('authentication', () => {
  const currentUid = ref<string | null>(null)
  const uid = computed(() => currentUid.value)

  async function login(email: string, password: string) {
    if (currentUid.value) {
      return
    }

    const fbService = await useFirebase()
    try {
      await authSdk.signInWithEmailAndPassword(fbService.auth, email, password)
      currentUid.value = fbService.auth.currentUser!.uid
    } catch (e) {
      throw e
    }
  }

  async function logout() {
    if (!currentUid.value) {
      return
    }

    const fbService = await useFirebase()
    await fbService.auth.signOut()

    currentUid.value = null
  }

  return { login, logout, uid }
})

import { defineStore } from 'pinia'
import * as authSdk from 'firebase/auth'
import { computed, ref } from 'vue'
import { useFirebase } from '@/services-composable/firebase'

export const useAuthenticationStore = defineStore('authentication', () => {
  const fbService = useFirebase()

  const currentUser = ref<authSdk.User | null>(null)
  const uid = computed(() => (currentUser.value ? currentUser.value.uid : null))

  fbService.auth.onAuthStateChanged((user) => {
    currentUser.value = user
  })

  async function login(email: string, password: string) {
    if (currentUser.value) {
      return
    }

    try {
      await authSdk.signInWithEmailAndPassword(fbService.auth, email, password)
    } catch (e) {
      throw e
    }
  }

  async function logout() {
    await fbService.auth.signOut()
  }

  return { login, logout, uid }
})

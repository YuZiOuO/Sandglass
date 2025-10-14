import { useFirebase } from '@/hooks/firebase'
import { defineStore } from 'pinia'

import * as authSdk from 'firebase/auth'

export const useAuthenticationStore = defineStore('authentication', () => {
  async function login(email: string, password: string) {
    if (await isLogined()) {
      return
    }

    const fbService = await useFirebase()
    try {
      await authSdk.signInWithEmailAndPassword(fbService.auth, email, password)
    } catch (e) {
      throw e
    }
  }

  async function isLogined() {
    const fbService = await useFirebase()
    return fbService.auth.currentUser !== null
  }

  async function logout() {
    if (!(await isLogined())) {
      return
    }
    const fbService = await useFirebase()
    await fbService.auth.signOut()
  }

  async function getAccessToken() {
    if (!(await isLogined())) {
      return
    }
    const fbService = await useFirebase()
    return await fbService.auth.currentUser?.getIdToken()
  }

  async function getUid() {
    if (!(await isLogined())) {
      return
    }
    const fbService = await useFirebase()
    return await fbService.auth.currentUser?.uid
  }

  return { login, logout, isLogined, getAccessToken, getUid }
})

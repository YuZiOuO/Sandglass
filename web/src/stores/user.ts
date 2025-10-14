import { useFirebase } from '@/hooks/firebase'
import { defineStore } from 'pinia'
import * as authSdk from 'firebase/auth'

export const useUserStore = defineStore('user', () => {
  async function create(email: string, password: string) {
    const fbService = await useFirebase()
    try {
      authSdk.createUserWithEmailAndPassword(fbService.auth, email, password)
    } catch (e) {
      throw e
    }
  }

  return { create }
})

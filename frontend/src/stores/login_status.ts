import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLoginStatus = defineStore('loginStatus', () => {
  const loginStatus = ref(true)
  const reverseLoginStatus = () => {
    loginStatus.value = !loginStatus.value
  }
  return { loginStatus, reverseLoginStatus }
})

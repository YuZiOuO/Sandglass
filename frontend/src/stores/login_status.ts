import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useLoginStatus = defineStore('loginStatus', () => {
  const status = ref(true)
  const getStatus = computed(() => status)
  const reverseStatus = () => {
    status.value = !status.value
  }
  return { status, getStatus, reverseStatus }
})

import { QueryClient } from '@tanstack/vue-query'
import { useAuthStatus } from './firebase'

export const globalQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      enabled: () => useAuthStatus(),
    },
    mutations: {},
  },
})

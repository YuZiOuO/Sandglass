import { GithubApi } from '@/api'
import { defineStore } from 'pinia'
import { useAuthenticationStore } from './authentication'

export const useGithub = defineStore('github', () => {
  const api = new GithubApi()
})

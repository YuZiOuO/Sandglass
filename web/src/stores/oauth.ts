import { GithubAuthApi, GoogleAuthApi } from '@/api'
import { defineStore } from 'pinia'
import { useAuthenticationStore } from './authentication'

export const useOAuthStore = defineStore('OAuth', () => {
  const authenticationStore = useAuthenticationStore()
  const googleOAuthApi = new GoogleAuthApi(undefined, import.meta.env.SG_WEB_API_BASEURL)
  const githubOAuthApi = new GithubAuthApi(undefined, import.meta.env.SG_WEB_API_BASEURL)

  async function getGoogleAuthUrl() {
    return (
      await googleOAuthApi.getGoogleAuthUrl(
        await authenticationStore.constructDefaultAxiosAuthHeader(),
      )
    ).data
  }

  async function getGoogleAuthStatus() {
    return (
      await googleOAuthApi.getGoogleAuthStatus(
        await authenticationStore.constructDefaultAxiosAuthHeader(),
      )
    ).data
  }

  async function getGoogleAccessToken() {
    return (
      await googleOAuthApi.getGoogleAccessToken(
        await authenticationStore.constructDefaultAxiosAuthHeader(),
      )
    ).data
  }

  async function getGithubAuthUrl() {
    return (
      await githubOAuthApi.getGithubAuthUrl(
        await authenticationStore.constructDefaultAxiosAuthHeader(),
      )
    ).data
  }

  async function getGithubAuthStatus() {
    return (
      await githubOAuthApi.getGithubAuthStatus(
        await authenticationStore.constructDefaultAxiosAuthHeader(),
      )
    ).data
  }

  return {
    getGithubAuthUrl,
    getGithubAuthStatus,
    getGoogleAuthStatus,
    getGoogleAuthUrl,
    getGoogleAccessToken,
  }
})

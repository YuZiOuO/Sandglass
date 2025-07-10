import axios, { type CreateAxiosDefaults } from 'axios'
import { login } from './user_api'

const githubApiConfig: CreateAxiosDefaults = {
  baseURL: 'https://github.com',
  timeout: 10000,
  responseEncoding: 'utf-8',
}

const api_for_github = axios.create({ ...githubApiConfig })

const client_id = 'Ov23liFDvAR2k8Ae01tE'

export function requestAuthorization() {
  const config = {
    url: '/login/oauth/authorize',
    params: {
      client_id: client_id,
      redirect_uri: '',
      scope: 'repo:status notifications read:user',
      state: '',
      prompt: 'test',
    },
  }
  window.open(api_for_github.getUri(config), '', 'popup')
}

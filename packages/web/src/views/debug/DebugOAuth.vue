<template>
  <NButton
    @click="
      async () => {
        await googleAuthUrl.refetch()
      }
    "
    :loading="googleAuthUrl.isFetching.value"
  >
    GoogleAuthUrl
  </NButton>
  <NText>{{ googleAuthUrl.data }}</NText>

  <NButton
    @click="
      async () => {
        await googleAccessToken.refetch()
      }
    "
    :loading="googleAccessToken.isFetching.value"
  >
    getGoogleAccessToken
  </NButton>
  <NText>{{ googleAccessToken.data }}</NText>

  <NButton
    @click="
      async () => {
        await googleAuthStatus.refetch()
      }
    "
    :loading="googleAuthStatus.isFetching.value"
  >
    getGoogleAuthStatus
  </NButton>
  <NText>{{ googleAuthStatus.data }}</NText>

  <NButton
    @click="
      async () => {
        await githubAuthUrl.refetch()
      }
    "
    :loading="githubAuthUrl.isFetching.value"
  >
    getGithubAuthUrl
  </NButton>
  <NText>{{ githubAuthUrl.data }}</NText>

  <NButton
    @click="
      async () => {
        await githubAuthStatus.refetch()
      }
    "
    :loading="githubAuthStatus.isFetching.value"
  >
    getGithubAuthStatus
  </NButton>
  <NText>{{ githubAuthStatus.data }}</NText>
</template>

<script setup lang="ts">
import { useGithubAuthStatusQuery, useGithubAuthUrlQuery } from '@/services-composable/github-oauth'
import {
  useGoogleAccessTokenQuery,
  useGoogleAuthStatusQuery,
  useGoogleAuthUrlQuery,
} from '@/services-composable/google-oauth'
import { NButton, NText } from 'naive-ui'

const googleAuthUrl = useGoogleAuthUrlQuery()
const googleAccessToken = useGoogleAccessTokenQuery()
const googleAuthStatus = useGoogleAuthStatusQuery()
const githubAuthUrl = useGithubAuthUrlQuery()
const githubAuthStatus = useGithubAuthStatusQuery()
</script>

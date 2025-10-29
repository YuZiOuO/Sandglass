<template>
  <NButton
    @click="
      async () => {
        googleAuthUrl = await oauthStore.getGoogleAuthUrl()
      }
    "
    >getGoogleAuthUrl</NButton
  >
  <NText>{{ googleAuthUrl }}</NText>
  <div></div>
  <NButton
    @click="
      async () => {
        googleAccessToken = await oauthStore.getGoogleAccessToken()
      }
    "
    >getGoogleAccessToken</NButton
  >
  <NText>{{ googleAccessToken }}</NText>
  <NButton
    @click="
      async () => {
        googleAuthStatus = await oauthStore.getGoogleAuthStatus()
      }
    "
    >getGoogleAuthStatus</NButton
  >
  <NText>{{ googleAuthStatus }}</NText>

  <NButton
    @click="
      async () => {
        githubAuthUrl = await oauthStore.getGithubAuthUrl()
      }
    "
    >getGithubAuthUrl</NButton
  >
  <NText>{{ githubAuthUrl }}</NText>
  <NButton
    @click="
      async () => {
        githubAuthStatus = await oauthStore.getGithubAuthStatus()
      }
    "
    >getGithubAuthStatus</NButton
  >
  <NText>{{ githubAuthStatus }}</NText>
</template>

<script setup lang="ts">
import { useOAuthStore } from '@/stores/oauth'
import { NButton, NText } from 'naive-ui'
import { ref } from 'vue'

const oauthStore = useOAuthStore()
const googleAuthUrl = ref<string>()
const googleAccessToken = ref<string>()
const googleAuthStatus = ref<boolean>()
const githubAuthUrl = ref<string>()
const githubAuthStatus = ref<boolean>()
</script>

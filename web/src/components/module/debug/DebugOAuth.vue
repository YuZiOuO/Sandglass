<template>
  <NButton @click="googleOAuthAPI.useUrl('').refetch">GoogleAuthUrl</NButton>
  <NText>{{ googleOAuthAPI.useUrl('').data }}</NText>
  <NButton @click="googleOAuthAPI.useToken('').refetch">GoogleAccessToken</NButton>
  <NText>{{ googleOAuthAPI.useToken('').data }}</NText>
  <NButton @click="googleOAuthAPI.useStatus('').refetch">GoogleAuthStatus</NButton>
  <NText>{{ googleOAuthAPI.useStatus('').data }}</NText>

  <NButton @click="githubOAuthAPI.useUrl('').refetch">getGithubAuthUrl</NButton>
  <NText>{{ githubOAuthAPI.useUrl('').data }}</NText>
  <NButton @click="githubOAuthAPI.useStatus('').refetch">getGithubAuthStatus</NButton>
  <NText>{{ githubOAuthAPI.useStatus('').data }}</NText>
</template>

<script setup lang="ts">
import { useGithubOAuthAPI } from '@/query/github-oauth'
import { useGoogleOAuthAPI } from '@/query/google-oauth'
import { NButton, NText } from 'naive-ui'

const googleOAuthAPI = useGoogleOAuthAPI()
const githubOAuthAPI = useGithubOAuthAPI()
</script>

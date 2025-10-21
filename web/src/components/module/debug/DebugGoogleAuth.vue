<template>
  <NButton
    @click="
      async () => {
        authUrl = (
          await googleApi.getGoogleAuthUrl({ headers: { Authorization: 'Bearer ' + token } })
        ).data
      }
    "
    >getAuthUrl</NButton
  >
  <NText>{{ authUrl }}</NText>
  <div></div>
  <NButton
    @click="
      async () => {
        accessToken = (
          await googleApi.getGoogleAccessToken({ headers: { Authorization: 'Bearer ' + token } })
        ).data
      }
    "
    >getAccessToken</NButton
  >
  <NText>{{ accessToken }}</NText>
</template>

<script setup lang="ts">
import { GoogleAuthApi } from '@/api'
import { useFirebase } from '@/hooks/firebase'
import { NButton, NText } from 'naive-ui'
import { ref } from 'vue'

const fbService = await useFirebase()
const token = await fbService.auth.currentUser?.getIdToken()
const googleApi = new GoogleAuthApi({ accessToken: token, isJsonMime: () => true })

const authUrl = ref<string>()
const accessToken = ref<string>()
</script>

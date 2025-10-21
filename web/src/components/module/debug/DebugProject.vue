<template>
  <NButton
    @click="
      async () => {
        projectList = (await api.listProject({ headers: { Authorization: 'Bearer ' + token } }))
          .data
      }
    "
  >
    listProject
  </NButton>
  <NText> </NText>
</template>
<script setup lang="ts">
import { ProjectApi, type ProjectDTO } from '@/api'
import { useFirebase } from '@/hooks/firebase'
import { NButton, NText } from 'naive-ui'
import { ref } from 'vue'

const fbService = await useFirebase()
const token = await fbService.auth.currentUser?.getIdToken()
const api = new ProjectApi()
const projectList = ref<ProjectDTO[]>()
</script>

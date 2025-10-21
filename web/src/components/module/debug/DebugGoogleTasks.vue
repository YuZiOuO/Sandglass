<template>
  <NButton
    @click="
      async () => {
        cachedTasklists = await googleTasksStore.listTaskLists()
      }
    "
    >listTaskLists</NButton
  >
  <NText>{{ cachedTasklists?.items }}</NText>
</template>

<script setup lang="ts">
import { useGoogleTasksStore } from '@/stores/google-tasks'
import { NButton, NText } from 'naive-ui'
import { ref } from 'vue'

const googleTasksStore = useGoogleTasksStore()

const cachedTasklists = ref<gapi.client.tasks.TaskLists>()
</script>

<template>
  <NButton
    @click="
      async () => {
        await tasklists.refetch()
      }
    "
    :loading="tasklists.isFetching.value"
  >
    listTaskLists
  </NButton>
  <NText>{{ tasklists.data }}</NText>
</template>

<script setup lang="ts">
import { useTaskListsQuery } from '@/services-composable/google-tasks'
import { NButton, NText } from 'naive-ui'

const tasklists = useTaskListsQuery()
</script>

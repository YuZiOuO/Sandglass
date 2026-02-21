<template>
  <NCard title="Project List">
    {{ projectList.data }}
  </NCard>
</template>

<script setup lang="ts">
import { NCard} from 'naive-ui'
import { useProjectsQuery } from '@/services-composable/project'

const projectList = useProjectsQuery()
</script>

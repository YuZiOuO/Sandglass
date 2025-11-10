<template>
  <NPageHeader title="项目" :subtitle="proj?._id" @back="() => {}">
    <div v-if="proj">开始于: 结束于: 当前进度: 当前预期进度: 代办:</div>
    <template #extra>
      <n-button :bordered="false" style="padding: 0 4px"> ··· </n-button>
    </template>
  </NPageHeader>
</template>

<script setup lang="ts">
import type { ProjectDTO } from '@/api'
import { NPageHeader, NButton } from 'naive-ui'
defineProps<{ proj: ProjectDTO | undefined }>()
</script>

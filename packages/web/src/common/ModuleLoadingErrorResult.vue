<template>
  <div v-if="!queryHook.data.value && queryHook.error.value">
    <NResult
      v-if="queryHook.error.value"
      status="error"
      :title="queryHook.error.value.name"
      :description="queryHook.error.value.message"
    >
      <template #footer>
        <NButton @click="() => queryHook.refetch()"> 重试 </NButton>
      </template>
    </NResult>
  </div>
</template>

<script setup lang="ts" generic="TData">
import type { UseQueryReturnType } from '@tanstack/vue-query'
import { NResult, NButton } from 'naive-ui'
defineProps<{ queryHook: UseQueryReturnType<TData, Error> }>()
</script>

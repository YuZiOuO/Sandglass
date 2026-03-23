<template>
  <NPopconfirmWithHook :loading="loading" @positive-click="$emit('positive-click')">
    <template #trigger>
      <NButton secondary circle>
        <template #icon>
          <slot name="icon"></slot>
        </template>
      </NButton>
    </template>
    <template #description>
      <slot name="description"></slot>
    </template>
    <template #form>
      <slot name="form"></slot>
    </template>
  </NPopconfirmWithHook>
</template>
<script setup lang="ts">
import { NButton } from 'naive-ui'
import NPopconfirmWithHook from '@/views/common/NPopconfirmWithHook.vue'

defineEmits<{
  (e: 'positive-click'): void
}>()

defineProps<{
  loading?: boolean
}>()
</script>

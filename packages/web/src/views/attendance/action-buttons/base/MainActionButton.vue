<template>
  <NButton
    size="large"
    type="primary"
    :ghost="disabled"
    :disabled="disabled"
    :loading="loading"
    @click="$emit('click')"
  >
    <template #icon>
      <slot name="icon"></slot>
    </template>
    <slot></slot>
  </NButton>
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui'

defineEmits(['click'])

defineProps<{
  disabled?: boolean
  loading?: boolean
}>()
</script>

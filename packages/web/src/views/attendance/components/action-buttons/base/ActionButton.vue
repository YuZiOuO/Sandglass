<template>
  <NPopconfirm
    :show="loading || undefined"
    @positive-click="$emit('positive-click')"
    :positive-button-props="{ loading: loading }"
  >
    <template #trigger>
      <NPopover :delay="200">
        <template #trigger>
          <NButton secondary circle>
            <template #icon>
              <slot name="icon"> </slot>
            </template>
          </NButton>
        </template>
        <slot name="description"></slot>
      </NPopover>
    </template>
    <slot name="form"></slot>
  </NPopconfirm>
</template>
<script setup lang="ts">
import { NPopconfirm, NPopover, NButton } from 'naive-ui'

defineEmits<{
  (e: 'positive-click'): void
}>()

defineProps<{
  loading?: boolean
}>()
</script>

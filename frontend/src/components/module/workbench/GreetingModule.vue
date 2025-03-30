<template>
  <n-h1 prefix="bar">
    <n-text type="primary">
      早上好，{{ props.name }}。
    </n-text>
  </n-h1>
</template>

<script setup lang="ts">
import { NH1, NText } from 'naive-ui';

const props = defineProps({
  name: {
    type: String,
    required: true
  }
})
</script>

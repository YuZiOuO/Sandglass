<template>
  <n-flex class="login-view" justify="center">
    <LoginModule class="login-module" />
  </n-flex>
</template>

<script setup lang="ts">
import LoginModule from '@/views/LoginModule.vue'
import { NFlex } from 'naive-ui'
</script>

<style scoped>
.login-view {
  display: flex;
  padding-top: 8%;
}
.login-module {
  max-width: 50%;
}
</style>

<template>
  <n-flex class="login-view" justify="center">
    <LoginModule class="login-module" @login-success="loginSuccessCallback" />
  </n-flex>
</template>

<script setup lang="ts">
import LoginModule from '@/components/module/LoginModule.vue'
import { NFlex } from 'naive-ui'
import { useRouter } from 'vue-router'

const router = useRouter()

function loginSuccessCallback() {
  router.push('/')
}
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

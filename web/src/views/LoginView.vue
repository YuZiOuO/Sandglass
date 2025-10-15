<template>
  <n-flex justify="center">
    <LoginModule @login-success="loginSuccessCallback" />
  </n-flex>
</template>

<script setup lang="ts">
import LoginModule from '@/components/module/LoginModule.vue';
import { NFlex } from 'naive-ui';
import { useRouter } from 'vue-router';

const router = useRouter();

function loginSuccessCallback(){
  router.push('/')
}
</script>
<template>
  <n-flex justify="center">
    <LoginModule />
  </n-flex>
</template>

<script lang="ts">
import LoginModule from '@/components/module/LoginModule.vue';
import { NFlex } from 'naive-ui';

export default {
  components: {
    NFlex,
    LoginModule,
  }
}
</script>

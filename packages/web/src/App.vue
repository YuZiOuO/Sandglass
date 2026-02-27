<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN" :theme="null">
    <n-loading-bar-provider>
      <LoadingBarController />
      <n-message-provider>
        <RootLayout />
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
  <VueQueryDevtools :initial-is-open="false" button-position="bottom-right" />
</template>

<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import {
  NConfigProvider,
  zhCN,
  dateZhCN,
  NLoadingBarProvider,
  NMessageProvider,
} from 'naive-ui'
import LoadingBarController from './common/LoadingBarController.vue';
import RootLayout from './views/layout/RootLayout.vue';
import { process } from 'better-auth';
</script>

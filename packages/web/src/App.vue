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
  // createTheme,
  // datePickerDark,
  // inputDark,
  NConfigProvider,
  zhCN,
  dateZhCN,
  NLoadingBarProvider,
  NMessageProvider,
} from 'naive-ui'
import LoadingBarController from './common/LoadingBarController.vue';

// import { ref } from 'vue'
import RootLayout from './views/layout/RootLayout.vue';

// const darkTheme = ref(createTheme([inputDark, datePickerDark]))
</script>

<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN" :theme="null">
    <n-loading-bar-provider>
      <LoadingBarController />
      <n-message-provider>
        <RootLayout />
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import {
  createTheme,
  datePickerDark,
  inputDark,
  NConfigProvider,
  zhCN,
  dateZhCN,
  NLoadingBarProvider,
  NMessageProvider,
} from 'naive-ui'
import LoadingBarController from './components/common/LoadingBarController.vue'

import { ref } from 'vue'
import RootLayout from './components/layout/RootLayout.vue'

const darkTheme = ref(createTheme([inputDark, datePickerDark]))
</script>

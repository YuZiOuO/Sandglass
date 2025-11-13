<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN" :theme="null" class="full-screen">
    <n-loading-bar-provider class="full-screen">
      <LoadingBarController />
      <n-message-provider class="full-screen">
        <RootLayout class="full-screen" />
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
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
import LoadingBarController from './components/common/LoadingBarController.vue'

// import { ref } from 'vue'
import RootLayout from './components/layout/RootLayout.vue'

// const darkTheme = ref(createTheme([inputDark, datePickerDark]))
</script>

<style scoped>
.full-screen {
  height: 100%;
  width: 100%;
}
</style>

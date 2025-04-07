<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN" :theme="null">
    <n-loading-bar-provider>
      <n-message-provider>
        <Layout />
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import {
  createTheme, datePickerDark, inputDark, NConfigProvider,
  zhCN, dateZhCN,
  NLoadingBarProvider, NMessageProvider
} from "naive-ui"

import { ref } from "vue";
import Layout from "./components/layout/Layout.vue";

const darkTheme = ref(createTheme([inputDark, datePickerDark]))
</script>

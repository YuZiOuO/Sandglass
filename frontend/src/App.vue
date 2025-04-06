<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
    <n-layout>
      <n-layout-header bordered class="header">
        <NavBarLayout :login="false" />
      </n-layout-header>
      <n-layout-content class="content">
        <RouterView />
      </n-layout-content>
      <n-layout-footer bordered>
        <GeneralFooter />
      </n-layout-footer>
    </n-layout>
  </n-config-provider>
</template>

<script setup lang="ts">
import {
  createTheme, datePickerDark, inputDark, NConfigProvider,
  zhCN,
  dateZhCN,
  NLayout, NLayoutHeader, NLayoutFooter, NLayoutContent,
} from "naive-ui"
import NavBarLayout from "./components/layout/NavBarLayout.vue";
import { RouterView } from "vue-router";
import GeneralFooter from "./components/layout/FooterLayout.vue";
import { ref } from "vue";

const darkTheme = ref(createTheme([inputDark, datePickerDark]))
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  padding: 8px;
  line-height: 1.0;
}

.content {
  /* 内容居中 */
  display: flex;
  justify-content: center;

  /* 最多占用整个容器85% */
  max-width: 95%;
  margin: 12px auto;
}
</style>

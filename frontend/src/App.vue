<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
    <n-flex vertical class="full-screen-space">
      <n-layout>
        <n-layout-header bordered class="header">
          <NavBar />
        </n-layout-header>
        <n-layout>
          <RouterView class="u-with-padding" />
        </n-layout>
        <n-layout-footer bordered>
          <GeneralFooter />
        </n-layout-footer>
      </n-layout>
    </n-flex>
  </n-config-provider>
</template>

<script setup lang="ts">
import {
  createTheme, datePickerDark, inputDark, NConfigProvider,
  zhCN,
  dateZhCN,
  NLayout,
  NLayoutHeader,
  NLayoutFooter,
  NFlex,
} from "naive-ui"
import NavBar from "./components/layout/NavBarLayout.vue";
import { RouterView } from "vue-router";
import GeneralFooter from "./components/layout/FooterLayout.vue";
import { ref } from "vue";

const darkTheme = ref(createTheme([inputDark, datePickerDark]))
</script>

<style scoped>
html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: v-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}

.full-screen-space {
  height: 100vh;
  width: 100vw;
  display: flex;
}

.header {
  display: flex;
  align-items: center;
  padding: 8px;
  line-height: 1.0;
}

.u-with-padding {
  padding: 16px;
}
</style>

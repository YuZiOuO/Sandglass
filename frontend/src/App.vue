<script lang="ts">
import {
  createTheme, datePickerDark, inputDark, NConfigProvider,
  zhCN as NzhCN,
  dateZhCN as NdateZhCN,
  NLayout,
  NLayoutHeader,
  NLayoutFooter,
  NFlex,
} from "naive-ui"
import NavBar from "./components/layout/NavBar.vue";
import { RouterView } from "vue-router";
import GeneralFooter from "./components/layout/GeneralFooter.vue";

export default {
  components: {
    RouterView,
    NConfigProvider,
    NFlex,
    NLayout,
    NLayoutHeader,
    NLayoutFooter,
    NavBar,
    GeneralFooter
  },
  data() {
    return {
      darkTheme: createTheme([inputDark, datePickerDark]),
      NzhCN,
      NdateZhCN
    }
  }
}
</script>

<template>
  <n-config-provider :locale="NzhCN" :date-locale="NdateZhCN">
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
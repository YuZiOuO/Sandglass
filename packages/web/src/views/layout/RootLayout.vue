<template>
  <div class="root-shell">
    <n-layout-header bordered style="flex-shrink: 0;">
      <NavBarLayout />
    </n-layout-header>

    <n-layout-content
      class="root-content"
      content-style="padding: 16px 24px; display: flex; flex-direction: column; height: 100%; box-sizing: border-box; overflow: hidden;"
    >
      <RouterView />
    </n-layout-content>

    <n-layout-footer bordered style="flex-shrink: 0;">
      <FooterLayout />
    </n-layout-footer>
  </div>
</template>

<script setup lang="ts">
import { NLayoutHeader, NLayoutFooter, NLayoutContent } from 'naive-ui'
import { RouterView } from 'vue-router'

import NavBarLayout from './NavBarLayout.vue'
import FooterLayout from './FooterLayout.vue'
</script>

<style scoped>
.root-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.root-content {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
</style>

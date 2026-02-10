<template>
  <n-layout>
    <n-layout-header bordered>
      <NavBarLayout />
    </n-layout-header>
    <n-layout-content content-style="padding: 1% 2.5%; display: flex;flex-direction: column;">
      <RouterView />
    </n-layout-content>
    <n-layout-footer bordered>
      <FooterLayout />
    </n-layout-footer>
  </n-layout>
</template>

<script setup lang="ts">
import { NLayout, NLayoutHeader, NLayoutFooter, NLayoutContent } from 'naive-ui'
import { RouterView } from 'vue-router'

import NavBarLayout from './NavBarLayout.vue'
import FooterLayout from './FooterLayout.vue'
</script>

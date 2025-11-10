<template>
  <n-grid :cols="10">
    <n-gi>
      <n-icon> </n-icon>
    </n-gi>
    <n-gi :offset="1" :span="6">
      <NavBarMenu />
    </n-gi>
    <n-gi :offset="1">
      <n-flex justify="center" align="center" style="width: 100%; height: 100%">
        <NavBarDropdown />
      </n-flex>
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { NGrid, NGi, NIcon, NFlex } from 'naive-ui'
import NavBarDropdown from './layout-module/NavBarDropdown.vue'
import NavBarMenu from './layout-module/NavBarMenu.vue'
</script>

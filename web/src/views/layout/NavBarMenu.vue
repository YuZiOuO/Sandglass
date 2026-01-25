<template>
  <n-menu
    :value="null"
    mode="horizontal"
    :options="menuOptions"
    style="width: 100%; height: 100%"
  />
</template>

<script setup lang="ts">
import type { MenuOption } from 'naive-ui'
import { h } from 'vue'
import { RouterLink } from 'vue-router'
import { NMenu } from 'naive-ui'

const menuOptions: MenuOption[] = [
  {
    label: () => h(RouterLink, { to: { path: '/' } }, { default: () => '主页' }),
    key: '主页', // fixme:要有key才能被点击,原因未知
  },
  {
    label: () => h(RouterLink, { to: { path: '/project' } }, { default: () => '项目' }),
    key: '项目',
  },
]
</script>

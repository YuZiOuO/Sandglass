<template>
  <n-menu :options="menuOptions" mode="horizontal" :value="activeKey" />
</template>

<script setup lang="ts">
import type { MenuOption } from 'naive-ui'
import { computed, h } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { NMenu } from 'naive-ui'

const route = useRoute()

// Map routes to menu keys for highlighting
const activeKey = computed(() => {
  if (route.path === '/') return 'home'
  if (route.path.startsWith('/project')) return 'project'
  if (route.path.startsWith('/attendance')) return 'attendance'
  return null
})

const renderLabel = (label: string, to: string) => {
  return () => h(RouterLink, { to }, { default: () => label })
}

const menuOptions: MenuOption[] = [
  {
    label: renderLabel('主页', '/'),
    key: 'home',
  },
  {
    label: renderLabel('项目', '/project'),
    key: 'project',
  },
  {
    label: renderLabel('考勤', '/attendance'),
    key: 'attendance',
  },
]
</script>

<template>
  <NMenu
    :options="menuOptions"
    @update:value="
      (_, item) => {
        if (item.key === '_create') {
          $emit('create')
        } else {
          selected = item.key as string | undefined
        }
      }
    "
  >
  </NMenu>
</template>

<script setup lang="ts">
import type { ProjectDTO } from '@/api'
import { NMenu, type MenuOption } from 'naive-ui'
import { computed } from 'vue'

const props = defineProps<{
  projectList: ProjectDTO[] | undefined
}>()

const selected = defineModel<string | undefined>('selected', { default: undefined })
defineEmits(['create'])

const projectMenuOptions = computed<MenuOption[] | undefined>(() => {
  return props.projectList?.map((proj) => {
    return { key: proj._id, label: proj.calendarId }
  })
})

const menuOptions = computed<MenuOption[] | undefined>(() => {
  if (!projectMenuOptions.value) {
    return undefined
  }
  return [...projectMenuOptions.value, { key: '_create', label: '添加一个' }]
})
</script>

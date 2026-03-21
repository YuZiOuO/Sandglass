<template>
  <NCard title="Project List">
    <NSpin :show="projectList.isFetching.value">
      <NMenu v-if="projectListMenuOptions" :options="projectListMenuOptions" />
      <NEmpty v-if="projectList.isSuccess.value && projectListMenuOptions?.length === 0" />
      <ModuleLoadingErrorResult :query-hook="projectList" />
    </NSpin>
  </NCard>
</template>

<script setup lang="ts">
import { NMenu, NSpin, NEmpty, NCard, type MenuOption } from 'naive-ui'
import ModuleLoadingErrorResult from '@/views/common/ModuleLoadingErrorResult.vue'
import { useProjectListQuery } from '@/services-composable/project'
import { computed, h } from 'vue'
import { RouterLink } from 'vue-router'

const projectList = useProjectListQuery()

const projectListMenuOptions = computed<MenuOption[] | undefined>(() => {
  return projectList.data.value?.map((item) => {
    return {
      label: () =>
        h(
          RouterLink,
          { to: { name: 'Project', params: { id: item.id } } },
          { default: () => item.name + ' # ' + item.id },
        ),
      key: item.id,
    }
  })
})
</script>

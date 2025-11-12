<template>
  <NLayout has-sider>
    <NLayoutSider
      collapse-mode="width"
      :collapsed-width="120"
      :width="240"
      show-trigger="arrow-circle"
      content-style="padding: 24px;"
      bordered
    >
      <ProjectSummaryListModule
        v-model:selected="selectedProjectId"
        :project-list="projectList.data.value"
        @create="
          () => {
            console.log('aaa')
          }
        "
      />
    </NLayoutSider>
    <NLayoutContent> <ProjectDetailModule :project-id="selectedProjectId" /></NLayoutContent>
  </NLayout>
</template>

<script setup lang="ts">
import ProjectDetailModule from '@/components/module/project/ProjectDetailModule.vue'
import ProjectSummaryListModule from '@/components/module/projectlist/projectSummaryListModule.vue'
import { useProjectsQuery } from '@/services-composable/project'
import { NLayout, NLayoutContent, NLayoutSider } from 'naive-ui'
import { ref } from 'vue'

const projectList = useProjectsQuery()
const selectedProjectId = ref<string | undefined>()
</script>

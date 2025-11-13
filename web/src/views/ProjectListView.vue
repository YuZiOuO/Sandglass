<template>
  <NLayout has-sider>
    <NLayoutSider
      collapse-mode="width"
      :collapsed-width="0"
      :width="240"
      show-trigger="arrow-circle"
      content-style="padding: 12px;"
      bordered
    >
      <NScrollbar>
        <ProjectSummaryListModule
          v-model:selected="selectedProjectId"
          :project-list="projectList.data.value"
          @create="
            () => {
              console.log('aaa')
            }
          "
        />
      </NScrollbar>
    </NLayoutSider>
    <NLayoutContent> <ProjectDetailModule :project-id="selectedProjectId" /></NLayoutContent>
  </NLayout>
</template>

<script setup lang="ts">
import ProjectDetailModule from '@/components/module/project/ProjectDetailModule.vue'
import ProjectSummaryListModule from '@/components/module/projectlist/projectSummaryListModule.vue'
import { useProjectsQuery } from '@/services-composable/project'
import { NLayout, NLayoutContent, NLayoutSider, NScrollbar } from 'naive-ui'
import { ref } from 'vue'

const projectList = useProjectsQuery()
const selectedProjectId = ref<string | undefined>()
</script>

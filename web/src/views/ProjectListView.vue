<template>
  <NLayout has-sider class="full-screen" :native-scrollbar="false">
    <NLayoutSider
      :collapse-mode="'width'"
      :collapsed-width="0"
      :native-scrollbar="false"
      width="15%"
      style="height: 100%"
      bordered
      show-trigger
      trigger-style="top: 150px"
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

<style scoped>
.full-screen {
  height: 100%;
  width: 100%;
}
</style>

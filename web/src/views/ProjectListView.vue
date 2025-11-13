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
      <ProjectSummaryListModule
        v-model:selected="selectedProjectId"
        @create="
          () => {
            showProjectEditModal = true
          }
        "
      />
    </NLayoutSider>
    <NLayoutContent> <ProjectDetailModule :project-id="selectedProjectId" /></NLayoutContent>
  </NLayout>

  <NModal v-model:show="showProjectEditModal" preset="card" title="添加项目">
    <ProjectEditModule />
  </NModal>
</template>

<script setup lang="ts">
import ProjectDetailModule from '@/components/module/project/ProjectDetailModule.vue'
import ProjectEditModule from '@/components/module/project/ProjectEditModule.vue'
import ProjectSummaryListModule from '@/components/module/projectlist/projectSummaryListModule.vue'
import { NLayout, NLayoutContent, NLayoutSider, NModal } from 'naive-ui'
import { ref } from 'vue'

const selectedProjectId = ref<string | undefined>()

const showProjectEditModal = ref(false)
</script>

<style scoped>
.full-screen {
  height: 100%;
  width: 100%;
}
</style>

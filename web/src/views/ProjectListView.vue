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

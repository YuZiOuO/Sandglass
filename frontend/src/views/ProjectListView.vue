<template>
  <ProjectListModule v-if="projs.length" :projs="projs" />
  <n-empty v-else size="huge" description="你什么也找不到">
    <template #extra>
      <n-button size="medium" @click="() => { show_create_drawer = true }">
        创建一个
      </n-button>
    </template>
  </n-empty>
  <n-drawer v-model:show="show_create_drawer" :width="502">
    <n-drawer-content v-if="show_create_drawer" title="创建项目" closable>
      <ProjectCreateModule @created="() => { update(); show_create_drawer = !show_create_drawer }" />
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { parseProject, type Project, type ProjectBSON } from '@/api/model/proj';
import ProjectListModule from '@/components/module/project-list/ProjectListModule.vue';
import { computed, ref } from 'vue';
import { NEmpty, NButton, NDrawer, NDrawerContent } from 'naive-ui';
import ProjectCreateModule from '@/components/module/ProjectCreateModule.vue';
import { get_projs } from '@/api/proj_api';

const projs = ref<Project[]>([])
const length = computed(() => projs.value.length)

const show_create_drawer = ref(false)

const update = () => {
  get_projs(true, (res) => {
    projs.value = (res.data as ProjectBSON[]).map(parseProject)
  })
}

update()
</script>

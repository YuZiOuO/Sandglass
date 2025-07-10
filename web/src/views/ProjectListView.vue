<template>
  <ProjectListModule v-if="projs.length" :projs="projs" />
  <n-empty v-else size="huge" description="你什么也找不到">
    <template #extra>
      <n-button size="medium" @click="() => { show_create_drawer = true }">
        创建一个
      </n-button>
    </template>
  </n-empty>

  <n-float-button v-if="projs.length" :right="60" :bottom="60" type="primary" position="fixed" menu-trigger="click"
    @update:show-menu="() => show_create_drawer = true" :show-menu="false">
    <n-icon :size="30">
      <AddOutline />
    </n-icon>
  </n-float-button>

  <ProjectCreateModule v-model:show="show_create_drawer"
    @created="() => { update(); show_create_drawer = !show_create_drawer }" />
</template>

<script setup lang="ts">
import { parseProject, type Project, type ProjectBSON } from '@/api/model/proj';
import ProjectListModule from '@/components/module/project-list/ProjectListModule.vue';
import { computed, ref } from 'vue';
import { NEmpty, NButton, NFloatButton, NIcon } from 'naive-ui';
import ProjectCreateModule from '@/components/module/ProjectCreateModule.vue';
import { get_projs } from '@/api/proj_api';
import { AddOutline } from '@vicons/ionicons5'

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

<template>
  <ProjectDetailModule v-if="proj" :proj="proj" />
  <n-spin v-else />
</template>

<script lang="ts" setup>
import ProjectDetailModule from '@/components/module/project-page/ProjectDetailModule.vue';
import { ref } from 'vue';
import { NSpin } from 'naive-ui';
import { get_proj } from '@/api/proj_api';
import { parseProject, type Project } from '@/api/model/proj';

const props = defineProps({
  proj_id: {
    required: true,
    type: String
  }
})

const proj = ref<Project | null>(null)

get_proj(props.proj_id, (res) => { proj.value = parseProject(res.data) })
</script>

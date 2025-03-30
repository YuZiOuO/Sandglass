<template>
  <n-layout has-sider :native-scrollbar="false">
    <n-layout-sider>
      <n-flex>
        <PageHeader :proj="props.proj" />
      </n-flex>
      <n-hr />
      <TimeLineModule :nodes="props.proj.nodes" :tasks="props.proj.tasks" type="all" />
    </n-layout-sider>
    <n-layout-content>
      <n-button @click="() => { addNodeDrawerActive = !addNodeDrawerActive }">
        添加节点
      </n-button>
      <n-card bordered>
        <CalendarModule :nodes="props.proj.nodes" :tasks="props.proj.tasks" />
      </n-card>
    </n-layout-content>
    <AddNodeModule v-model:active="addNodeDrawerActive" />
  </n-layout>
</template>

<script setup lang="ts">
import TimeLineModule from '../project-info-general/TimeLineModule.vue';
import type { Project } from '@/api/proj_api';
import {
  NCard, NLayout, NLayoutContent, NLayoutSider,
  NFlex, NHr, NButton
} from 'naive-ui';
import { ref, type PropType } from 'vue';
import CalendarModule from './CalendarModule.vue';
import PageHeader from './PageHeader.vue';
import AddNodeModule from './AddNodeModule.vue';

const props = defineProps({
  proj: {
    type: Object as PropType<Project>,
    required: true
  }
})

const addNodeDrawerActive = ref(false)
</script>

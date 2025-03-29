<template>
  <n-page-header :subtitle="'#' + props.proj.id">
    <template #header>
      <n-breadcrumb>
        <n-breadcrumb-item>项目</n-breadcrumb-item>
        <n-breadcrumb-item>详情</n-breadcrumb-item>
        <n-breadcrumb-item>TODO:不知道这里放啥</n-breadcrumb-item>
      </n-breadcrumb>
    </template>
    <template #title>
      {{ props.proj.name }}
    </template>
    <template #extra>
      <n-space>
        <n-button>更改</n-button>
        <n-dropdown :options="options" placement="bottom-start">
          <n-button :bordered="false" style="padding: 0 4px">
            ···
          </n-button>
        </n-dropdown>
      </n-space>
    </template>
    <n-text>
      {{ proj.description }}
    </n-text>
    <n-hr />
    <n-grid :cols="2">
      <n-gi>
        <n-statistic label="截止于" :value="formatTimestampString(props.proj.end_timestamp)" />
      </n-gi>
      <n-gi>
        <n-statistic label="开始于" :value="formatTimestampString(props.proj.start_timestamp)" />
      </n-gi>
      <n-gi>
        <n-statistic label="未完成节点" :value="unfinished_nodes + ' 个'" />
      </n-gi>
      <n-gi>
        <n-statistic label="未完成任务" :value="unfinished_tasks + ' 个'" />
      </n-gi>
    </n-grid>
    <n-hr />
    <template #footer>
      <!-- TODO:footer,也不知道放啥，可以不放。 -->
    </template>
  </n-page-header>
</template>

<script setup lang="ts">
import type { Project } from '@/api/proj_api';
import {
  NBreadcrumb, NBreadcrumbItem,
  NButton, NDropdown, NGi, NGrid,
  NHr, NPageHeader, NSpace, NStatistic, NText
} from 'naive-ui';
import { computed, ref, type PropType } from 'vue';
import { formatTimestampString } from '@/util';

const props = defineProps({
  proj: {
    type: Object as PropType<Project>,
    required: true
  }
})

// 缓存未完成的节点和任务的数量
const unfinished_tasks = computed(() => props.proj.tasks.filter(task => !task.finished).length)
const unfinished_nodes = computed(() => props.proj.nodes.filter(node => !node.finished).length)

// 选项菜单
const options = ref([
  {
    label: '归档',
    key: '1'
  },
])
</script>

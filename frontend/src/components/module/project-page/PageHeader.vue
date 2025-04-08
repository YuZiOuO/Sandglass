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
        <n-button>进入网站</n-button>
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
        <n-statistic label="节点" :value="unfinished_nodes + ' 个'" />
      </n-gi>
      <n-gi>
        <n-statistic label="任务" :value="unfinished_tasks + ' 个'" />
      </n-gi>
    </n-grid>
    <template #footer>
      <n-progress type="line" status="success"
        :percentage="100 * (unfinished_nodes + unfinished_tasks) / all_tasks_and_nodes" indicator-placement="inside" />
    </template>
  </n-page-header>
</template>

<script setup lang="ts">
import type { Project } from '@/api/model/proj';
import {
  NBreadcrumb, NBreadcrumbItem,
  NButton, NDropdown, NGi, NGrid,
  NHr, NPageHeader, NSpace, NStatistic, NText, NProgress
} from 'naive-ui';
import { computed, type PropType } from 'vue';

const props = defineProps({
  proj: {
    type: Object as PropType<Project>,
    required: true
  }
})

// 缓存总节点数和任务数
const all_tasks_and_nodes = computed(() => props.proj.nodes.length + props.proj.tasks.length)

// 缓存未完成的节点和任务的数量
const unfinished_tasks = computed(
  () => props.proj.tasks.filter(task => !task.finished).length
)
const unfinished_nodes = computed(
  () => props.proj.nodes.filter(node => !node.finished).length
)

// 选项菜单
const options = [
  {
    label: '更改',
    key: '1'
  },
  {
    label: '归档',
    key: '2'
  },
]
</script>

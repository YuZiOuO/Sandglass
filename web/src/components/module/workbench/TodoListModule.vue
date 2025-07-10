<template>
  <n-card title="待办">
    <template #header-extra>
      <n-button>
        新增
      </n-button>
    </template>
    <n-grid :cols="2">
      <n-gi>
        <n-statistic label="节点">
          {{ props.unfinished_nodes }} / {{ 30 }}
        </n-statistic>
      </n-gi>
      <n-gi>
        <n-statistic label="事项">
          {{ props.unfinished_tasks }} / {{ 4 }}
        </n-statistic>
      </n-gi>
    </n-grid>
    <n-hr />
    <n-tree :show-line="true" :default-expand-all="true" :data="props.todo_data" checkable expand-on-click selectable />
  </n-card>
</template>

<script setup lang="ts">
import { NCard, NStatistic, NGi, NGrid, NTree, NButton, NHr } from 'naive-ui';
import type { TreeOptions } from 'naive-ui/es/tree/src/interface';
import type { PropType } from 'vue';
const props = defineProps({
  unfinished_nodes: {
    type: Number,
    required: true
  },
  unfinished_tasks: {
    type: Number,
    required: true
  },
  todo_data: {
    type: Object as PropType<TreeOptions>
  }
})
</script>

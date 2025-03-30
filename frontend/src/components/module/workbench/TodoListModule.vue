<template>
  <n-card>
    <n-grid x-gap="12" :cols="2">
      <n-gi>
        <n-statistic label="待办节点">
          {{ props.unfinished_nodes }}
        </n-statistic>
      </n-gi>
      <n-gi>
        <n-statistic label="待办事项">
          {{ props.unfinished_tasks }}
        </n-statistic>
      </n-gi>
    </n-grid>
    <n-divider />
    <n-button>
      新增
    </n-button>
    <n-tree :show-line="true" :default-expand-all="true" :data="props.todo_data" checkable expand-on-click selectable />
  </n-card>
</template>

<script setup lang="ts">
import { NCard, NStatistic, NGi, NGrid, NTree, NDivider, NButton } from 'naive-ui';
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

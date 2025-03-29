<template>
  <n-calendar #="{ year, month, date }">
    <div>
      <n-tag v-for="n in nodesInGivenDate(year, month, date)" :key="n.timestamp" round :bordered="false" type="success">
        {{ n.name }}
        <template #icon>
          <n-icon :component="CheckmarkCircle" />
        </template>
      </n-tag>
    </div>
  </n-calendar>
</template>

<script setup lang="ts">
import type { Task, Node } from '@/api/proj_api';
import { inGivenDate } from '@/util';
import { CheckmarkCircle } from '@vicons/ionicons5'
import { NCalendar, NTag, NIcon } from 'naive-ui';
import type { PropType } from 'vue';

const props = defineProps({
  nodes: {
    type: Object as PropType<Array<Node>>,
    required: true
  },
  tasks: {
    type: Object as PropType<Array<Task>>,
    required: true
  }
})

// 计算给定日期的所有节点
function nodesInGivenDate(year: number, month: number, date: number) {
  return props.nodes.filter(n => inGivenDate(n.timestamp, year, month, date))
}
</script>

<style scoped>
/* .n-calendar {
  max-width: 960px;
  max-height: 640px;
} */
</style>

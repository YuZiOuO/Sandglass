<template>
  <n-calendar #="{ year, month, date }">
    <n-dropdown v-for="n in nodesInGivenDate(year, month, date)" :key="n.timestamp" trigger="hover" :options="options"
      @select="handleSelect">
      <n-tag :bordered="false" type="success">
        {{ n.name }}
        <template #icon>
          <n-icon :component="CheckmarkCircle" />
        </template>
      </n-tag>
    </n-dropdown>
  </n-calendar>
</template>

<script setup lang="ts">
import type { Task, Node } from '@/api/proj_api';
import { inGivenDate } from '@/util';
import { CheckmarkCircle } from '@vicons/ionicons5'
import { NCalendar, NTag, NIcon, NDropdown } from 'naive-ui';
import { type PropType } from 'vue';

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


const handleSelect = () => { }
// 选项菜单
const options = [
  {
    label: '详情',
    key: 'detail'
  },
  {
    label: '修改',
    key: 'modify'
  },
  {
    type: 'divider',
  },
  {
    label: '附件',
    key: 'attachment',
    children: [
      {
        label: '新增',
        key: 'append'
      },
      {
        type: 'divider',
      },
      {
        label: 'v-for 附件列表 here',
        key: 'attachment_detail'
      },
    ]
  }
]
</script>

<style scoped>
/* .n-calendar {
  max-width: 960px;
  max-height: 640px;
} */
</style>

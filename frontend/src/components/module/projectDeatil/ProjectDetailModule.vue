<template>
  <n-layout has-sider>
    <n-layout-sider>
      <PageHeader :proj="props.proj" />
      <n-timeline>
        <n-timeline-item v-for="n in props.proj.nodes" :key="n.timestamp" :type="statusOfNode(n)" :title="n.name"
          :content="n.description" :time="formatTimestampString(n.timestamp)" />
        <!-- TODO:sidebar的行为:高度与右边内容对齐，如果长度高于右边，则加载滚动条 -->
        <!-- TODO:根据task的状态改变左边圆圈和线段的样式-->
      </n-timeline>
      <!-- <n-scrollbar style="max-height: 100%">
      </n-scrollbar> -->
    </n-layout-sider>
    <n-layout-content>
      <n-card bordered>
        <CalendarModule :nodes="props.proj.nodes" :tasks="props.proj.tasks" />
      </n-card>
    </n-layout-content>
  </n-layout>
</template>

<script setup lang="ts">

import { formatTimestampString } from '@/util';
import type { Project, Node } from '@/api/proj_api';
import {
  NCard, NLayout, NLayoutContent, NLayoutSider,
  NTimeline, NTimelineItem
} from 'naive-ui';
import { type PropType } from 'vue';
import CalendarModule from './CalendarModule.vue';
import PageHeader from './PageHeader.vue';

const props = defineProps({
  proj: {
    type: Object as PropType<Project>,
    required: true
  }
})

// 辅助函数,计算节点对应的Timeline Item的状态
function statusOfNode(n: Node) {
  if (n.finished) {
    return 'success'
  }
  if (n.timestamp > Date.now()) {
    return 'info'
  }
  return 'error'
}
</script>

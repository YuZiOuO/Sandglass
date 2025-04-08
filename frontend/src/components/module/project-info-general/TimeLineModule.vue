<template>
  <n-timeline>
    <n-timeline-item>
      展开已完成节点
      <template #icon>
        <n-button quaternary circle>
          <template #icon>
            <n-icon>
              <arrow-up />
            </n-icon>
          </template>
        </n-button>
      </template>
      <template #footer>
        单击左侧按钮
      </template>
    </n-timeline-item>
    <n-timeline-item v-for="n in sorted_unfinished_nodes" :key="n.timestamp" :type="statusOfNode(n)">
      <template #header>
        {{ n.name }}
      </template>
      {{ n.description }}
      <template #footer>
        截止于 {{ timestamp2String(n.timestamp) }}
      </template>
    </n-timeline-item>
    <n-timeline-item line-type="dashed">
      展开更远的节点
      <template #icon>
        <n-button quaternary circle>
          <template #icon>
            <n-icon>
              <arrow-down />
            </n-icon>
          </template>
        </n-button>
      </template>
      <template #footer>
        单击左侧按钮
      </template>
    </n-timeline-item>
    <n-timeline-item>
      新增节点
      <template #icon>
        <n-button quaternary circle>
          <template #icon>
            <n-icon>
              <add-outline />
            </n-icon>
          </template>
        </n-button>
      </template>
      <template #footer>
        单击左侧按钮
      </template>
    </n-timeline-item>
  </n-timeline>
</template>

<script setup lang="ts">
import type { Node } from '@/api/model/node';
import { timestamp2String } from '@/util';
import { NTimeline, NTimelineItem, NButton, NIcon } from 'naive-ui';
import { computed, type PropType } from 'vue';
import { ArrowUp, AddOutline, ArrowDown } from '@vicons/ionicons5'

const props = defineProps({
  nodes: {
    type: Object as PropType<Array<Node>>,
    required: true
  },
  type: {
    type: Object as PropType<'all' | 'unfinished'>,
    require: true
  }
})

const ms_in_a_day = 24 * 60 * 60 * 1000

const sorted_unfinished_nodes = computed(
  () => {
    return props.nodes.filter(
      n => !n.finished &&
        n.timestamp < Date.now() + 30 * ms_in_a_day
    ).sort((n1, n2) => n1.timestamp - n2.timestamp)
  }
)

// 辅助函数,计算节点对应的Timeline Item的状态
function statusOfNode(n: Node) {
  if (n.finished) {
    return 'success'
  }
  else {
    if (n.timestamp < Date.now()) {
      return 'warning'
    }
    else if (n.timestamp < Date.now() + 7 * ms_in_a_day) {
      return 'info'
    }
    else {
      return 'default'
    }
  }
}
</script>

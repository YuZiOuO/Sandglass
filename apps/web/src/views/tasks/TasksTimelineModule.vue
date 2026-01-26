<template>
  <NTimeline v-if="!props.loading">
    <NTimelineItem v-for="t in props.tasks" :key="t.id" :type="computeTimelineItemType(t)">
      <NThing>
        <template #header>
          {{ t.title }}
        </template>
        <template #header-extra>
          <NDropdown trigger="hover" :options="taskOptions"
            ><NButton size="tiny">...</NButton></NDropdown
          >
        </template>

        <template #description>
          <NText v-if="t.completed">
            {{ '完成于' + new Date(t.completed).toLocaleString('zh-cn') }}
          </NText>
          <NText v-if="!t.completed && t.due" strong italic>
            {{ '截止:' + new Date(t.due).toLocaleString('zh-cn') }}
          </NText>
        </template>

        <div v-if="!t.completed">
          {{ t.notes }}
        </div>

        <template #action v-if="!t.completed">
          <NButton size="small">标记为完成</NButton>
        </template>
      </NThing>
    </NTimelineItem>
  </NTimeline>
  <n-empty description="你什么也找不到" v-else>
    <template #extra>
      <n-button size="small"> 看看别的 </n-button>
    </template>
  </n-empty>
</template>
<script setup lang="ts">
import { NButton, NDropdown, NText, NThing, NTimeline, NTimelineItem, NEmpty } from 'naive-ui'
import type { DropdownMixedOption } from 'naive-ui/es/dropdown/src/interface'

const props = defineProps<{
  tasks: gapi.client.tasks.Task[]
  loading: boolean
}>()

const taskOptions: DropdownMixedOption[] = [
  {
    label: '标记为未完成',
    key: '标记为未完成',
  },
  { type: 'divider', key: '分割线' },
  {
    label: '其他操作',
    key: '其他操作',
  },
]

const currentTime = new Date()
function computeTimelineItemType(task: gapi.client.tasks.Task) {
  const completed = task.completed ? new Date(task.completed) : null
  const due = task.due ? new Date(task.due) : null

  if (completed) {
    return 'success'
  } else {
    if (!due) {
      return 'info'
    } else {
      if (due < currentTime) {
        return 'error'
      } else {
        return 'warning'
      }
    }
  }
}
</script>

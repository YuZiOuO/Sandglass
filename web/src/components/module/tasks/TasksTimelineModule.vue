<template>
  <NTimeline v-if="props.tasks" :icon-size="20">
    <NTimelineItem>
      <n-button size="small" @click="showTaskEdit"> + </n-button>
    </NTimelineItem>
    <NTimelineItem v-for="t in props.tasks" :key="t.id" :type="computeTimelineItemType(t)">
      <NThing>
        <template #header>
          {{ t.title }}
        </template>
        <template #header-extra>
          <TaskTimelineItemDropdown
            :tasklist-id="props.tasklistId!"
            :task="t"
            @edit="
              (taskId: string) => {
                taskEditModalInitialData = tasks!.filter((t) => t.id === taskId)[0]
                showTaskEdit()
              }
            "
          />
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
    <template #icon v-if="props.loading">
      <n-spin size="large" />
    </template>
    <template #extra>
      <n-button size="small" @click="showTaskEdit"> 添加一个 </n-button>
    </template>
  </n-empty>

  <NModal v-model:show="taskEditModalDisplayStatus" preset="card">
    <TaskEditModule
      :tasklist-id="tasklistId"
      :initial-data="taskEditModalInitialData"
      @submit="
        () => {
          taskEditModalInitialData = undefined
          taskEditModalDisplayStatus = false
        }
      "
    />
  </NModal>
</template>
<script setup lang="ts">
import { NButton, NText, NThing, NTimeline, NTimelineItem, NEmpty, NModal, NSpin } from 'naive-ui'
import { ref } from 'vue'
import TaskTimelineItemDropdown from './TaskTimelineItemDropdown.vue'
import TaskEditModule from './TaskEditModule.vue'

const taskEditModalDisplayStatus = ref(false)
const showTaskEdit = () => {
  taskEditModalDisplayStatus.value = !taskEditModalDisplayStatus.value
}

// Should be reset every time you closes the modal
const taskEditModalInitialData = ref<gapi.client.tasks.Task | undefined>(undefined)

const props = defineProps<{
  tasklistId: string | undefined
  tasks: gapi.client.tasks.Task[] | undefined
  loading: boolean
}>()

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

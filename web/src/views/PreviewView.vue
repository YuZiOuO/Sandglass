<template>
  <TasksTimelineModule :tasks="tasks" />
</template>
<script setup lang="ts">
import TasksTimelineModule from '@/components/module/tasks/TasksTimelineModule.vue'
import { useGoogleTasksStore } from '@/stores/google-tasks'
import { onMounted, ref } from 'vue'

const tasks = ref<gapi.client.tasks.Task[]>([])

const gTasksStore = useGoogleTasksStore()

onMounted(async () => {
  const apiData = (await gTasksStore.listTasks('MDA0MTg1NjY4NTc0NTAwMzAxMTc6MDow')).items
  tasks.value = apiData ? apiData : []
})
</script>

<!-- const dataNotScheduled: gapi.client.tasks.Task = {
  title: '任务',
  notes: '这是任务描述。很长很长很长很长很长很长很长很长很长很长很长很长',
  completed: undefined,
  due: undefined,
}
const dataCompleted: gapi.client.tasks.Task = {
  title: '任务',
  notes: '这是任务描述。很长很长很长很长很长很长很长很长很长很长很长很长',
  completed: '2025-10-22T04:00:00Z',
  due: undefined,
}
const dataDued: gapi.client.tasks.Task = {
  title: '任务',
  notes: '这是任务描述。很长很长很长很长很长很长很长很长很长很长很长很长',
  completed: undefined,
  due: '2024-10-22T03:00:00Z',
}
const dataApproching: gapi.client.tasks.Task = {
  title: '任务',
  notes: '这是任务描述。很长很长很长很长很长很长很长很长很长很长很长很长',
  completed: undefined,
  due: '2025-10-25T03:00:00Z',
} -->

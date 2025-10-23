<template>
  <div class="root">
    <ProjectDetailModule
      :project-data="{ uid: 'id here', calendarId: 'id here', tasklistId: 'id here' }"
      :tasks-data="tasks"
    />
  </div>
</template>
<script setup lang="ts">
import ProjectDetailModule from '@/components/module/project/ProjectDetailModule.vue'
import { useGoogleTasksStore } from '@/stores/google-tasks'
import { onMounted, ref } from 'vue'

const tasks = ref<gapi.client.tasks.Task[]>([])

const gTasksStore = useGoogleTasksStore()

onMounted(async () => {
  const apiData = (await gTasksStore.listTasks('MDA0MTg1NjY4NTc0NTAwMzAxMTc6MDow')).items
  tasks.value = apiData ? apiData : []
})
</script>

<style lang="css" scoped>
.root {
  display: flex;
}
</style>

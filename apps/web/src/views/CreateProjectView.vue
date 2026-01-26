<template>
  <Suspense>
    <CreateProjectModule
      :calendars="calendars"
      :tasklists="tasklists"
      :loading="loading"
      @submit="
        (data) => {
          console.log(data)
        }
      "
    ></CreateProjectModule>
  </Suspense>
</template>

<script setup lang="ts">
import CreateProjectModule from '@/components/module/project/CreateProjectModule.vue'
import { onMounted, ref } from 'vue'

// const gCalStore = useGoogleCalendarStore()
// const gTasksStore = useGoogleTasksStore()

const loading = ref<boolean>(true)
const calendars = ref<gapi.client.calendar.CalendarListEntry[]>([])
const tasklists = ref<gapi.client.tasks.TaskList[]>([])
onMounted(async () => {
  // calendars.value = (await gCalStore.listCalendar()).items!
  // tasklists.value = (await gTasksStore.listTaskLists()).items!
  loading.value = false
})
</script>

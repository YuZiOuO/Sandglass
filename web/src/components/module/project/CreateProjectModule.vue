<template>
  <NSpace vertical>
    <NInput :type="'text'" :placeholder="'项目名称'" v-model:value="inputProjectName" />
    <NInput :type="'textarea'" :placeholder="'项目描述'" v-model:value="inputProjectDescription" />
    <NSelect
      :options="convertCalenderArrayToOptions(props.calendars)"
      :placeholder="'要绑定的日历'"
      v-model:value="inputCalendarId"
    ></NSelect>
    <NSelect
      :options="convertTasklistsToOptions(props.tasklists)"
      :placeholder="'要绑定的任务列表'"
      v-model:value="inputTasklistId"
    ></NSelect>
    <!-- <NSelect :options="" :placeholder="'要绑定的仓库'" v-model:value=""></NSelect> -->
    <NButton
      @click="
        () => {
          emits('submit', {
            calendar: inputCalendarId,
            projectDescription: inputProjectDescription,
            projectName: inputProjectName,
            tasklist: inputTasklistId,
          })
        }
      "
    >
      创建
    </NButton>
  </NSpace>
</template>

<script setup lang="ts">
import { NButton, NInput, NSelect, NSpace } from 'naive-ui'
import type { SelectOption } from 'naive-ui/es/select/src/interface'
import { ref } from 'vue'

const props = defineProps<{
  calendars: gapi.client.calendar.CalendarListEntry[]
  tasklists: gapi.client.tasks.TaskList[]
}>()

const emits = defineEmits<{
  submit: [
    {
      projectName: string
      projectDescription: string
      calendar: string
      tasklist: string
      repo?: string
    },
  ]
}>()

const inputProjectName = ref<string>()
const inputProjectDescription = ref<string>()
const inputCalendarId = ref<string>()
const inputTasklistId = ref<string>()

function convertCalenderArrayToOptions(
  calendars: gapi.client.calendar.CalendarListEntry[],
): SelectOption[] {
  return calendars.map((e) => {
    return { label: e.summary + ' #' + e.id, value: e.id }
  })
}
function convertTasklistsToOptions(tasklists: gapi.client.tasks.TaskList[]): SelectOption[] {
  if (!tasklists) {
    return []
  }

  return tasklists.map((e) => {
    return { label: e.title + ' #' + e.id, value: e.id }
  })
}
</script>

<template>
  <!-- TODO: refactor to form, add validation -->
  <NSpace vertical>
    <NInput :type="'text'" :placeholder="'项目名称'" v-model:value="inputProjectName" />
    <NInput :type="'textarea'" :placeholder="'项目描述'" v-model:value="inputProjectDescription" />
    <NSelect
      :options="convertCalenderArrayToOptions(calendar.data.value?.items ?? [])"
      :placeholder="'要绑定的日历'"
      :loading="calendar.isFetching.value"
      v-model:value="formModel.calendarId"
    ></NSelect>
    <NSelect
      :options="convertTasklistsToOptions(tasklists.data.value?.items ?? [])"
      :placeholder="'要绑定的任务列表'"
      :loading="calendar.isFetching.value"
      v-model:value="formModel.tasklistId"
    ></NSelect>
    <!-- <NSelect :options="" :placeholder="'要绑定的仓库'" v-model:value=""></NSelect> -->
    <NButton
      @click="
        async () => {
          projectAddMutation.mutateAsync(formModel)
        }
      "
    >
      创建
    </NButton>
  </NSpace>
</template>

<script setup lang="ts">
import type { ProjectCreateDTO } from '@/api'
import { useCalendarListQuery } from '@/services-composable/google-calendar'
import { useTaskListsQuery } from '@/services-composable/google-tasks'
import { useCreateProject } from '@/services-composable/project'
import { useAuthenticationStore } from '@/stores/authentication'
import { NButton, NInput, NSelect, NSpace } from 'naive-ui'
import type { SelectOption } from 'naive-ui/es/select/src/interface'
import { ref } from 'vue'

const calendar = useCalendarListQuery()
const tasklists = useTaskListsQuery()

if (useAuthenticationStore().uid === null) {
  console.log('assertion error')
}
const formModel = ref<ProjectCreateDTO>({
  uid: useAuthenticationStore().uid!,
  calendarId: '',
  tasklistId: '',
})

const projectAddMutation = useCreateProject()

const inputProjectName = ref<string>()
const inputProjectDescription = ref<string>()

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

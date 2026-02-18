<script setup lang="ts">
import { computed } from 'vue'
import { NCard, NTag, NCheckbox, NCheckboxGroup } from 'naive-ui'
import { useGoogleTasksQuery } from '@/services-composable/google-tasks'

const props = defineProps<{
  tasklistId?: string
}>()

const { data: tasks } = useGoogleTasksQuery(computed(() => props.tasklistId || ''))

</script>

<template>
  <n-card size="small" title="1. 任务进度 (Tasks)" class="flex-1">
    <template #header-extra>
      <n-tag type="success" size="small">{{ tasks?.items?.filter((t: any) => t.status === 'completed').length || 0 }} / {{ tasks?.items?.length || 0 }}</n-tag>
    </template>
    <div v-if="tasks?.items?.length">
      <n-checkbox-group class="flex flex-col gap-2">
        <div v-for="task in tasks.items" :key="task.id" class="flex items-center gap-2">
          <n-checkbox :checked="task.status === 'completed'" :label="task.title" />
        </div>
      </n-checkbox-group>
    </div>
    <div v-else class="text-gray-400 text-sm py-4 text-center">
      暂无任务 (Mocked)
      <div class="mt-2 text-xs">
        [ ] Lab 2 截止 <br/>
        [x] 完成预习
      </div>
    </div>
  </n-card>
</template>

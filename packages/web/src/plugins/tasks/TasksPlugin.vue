<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  NAlert,
  NButton,
  NCard,
  NEmpty,
  NList,
  NListItem,
  NSelect,
  NSpace,
  NSpin,
  NTag,
  NThing,
} from 'naive-ui'

import type { Task, TaskCapability } from '@/capability/task'
import type { Scope, Scoped } from '@/interfaces'

const { capabilities } = defineProps<{
  capabilities: readonly [Scoped<TaskCapability>]
}>()
const capability = capabilities[0]

const scopes = ref<readonly Scope[]>([])
const selectedScope = ref<string>()
const tasks = ref<readonly Task[]>([])
const loading = ref(false)
const error = ref('')

const scopeOptions = computed(() =>
  scopes.value.map((scope) => ({ label: scope.name, value: scope.id })),
)

async function loadScopes() {
  if (!capability) {
    scopes.value = []
    selectedScope.value = undefined
    tasks.value = []
    return
  }

  loading.value = true
  error.value = ''

  try {
    scopes.value = await capability.listScopes()
    selectedScope.value = scopes.value[0]?.id
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Failed to load task lists.'
  } finally {
    loading.value = false
  }
}

async function loadTasks() {
  if (!capability || !selectedScope.value) {
    tasks.value = []
    return
  }

  loading.value = true
  error.value = ''

  try {
    tasks.value = await capability.forScope(selectedScope.value).list()
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Failed to load tasks.'
  } finally {
    loading.value = false
  }
}

function formatDueDate(task: Task) {
  return task.dueDate ? `Due ${task.dueDate}` : 'No due date'
}

watch(
  () => capability,
  () => void loadScopes(),
  { immediate: true },
)
watch(selectedScope, () => void loadTasks())
</script>

<template>
  <n-card title="Tasks">
    <template #header-extra>
      <n-button size="small" :loading="loading" @click="loadScopes">Refresh</n-button>
    </template>

    <n-space vertical>
      <n-alert v-if="error" type="error" :title="error" />
      <n-empty v-if="!capability" description="Connect Google to view tasks." />
      <n-spin v-else :show="loading">
        <n-space vertical>
          <n-select
            v-if="scopeOptions.length"
            v-model:value="selectedScope"
            :options="scopeOptions"
            placeholder="Select a task list"
          />
          <n-empty v-if="!scopes.length" description="No task lists available." />
          <n-empty v-else-if="!tasks.length" description="No tasks in this list." />
          <n-list v-else bordered>
            <n-list-item v-for="task in tasks" :key="task.id">
              <n-thing :title="task.title" :description="formatDueDate(task)">
                <template #avatar>
                  <n-tag :type="task.completed ? 'success' : 'warning'" size="small">
                    {{ task.completed ? 'Done' : 'Open' }}
                  </n-tag>
                </template>
                <template v-if="task.notes" #footer>{{ task.notes }}</template>
              </n-thing>
            </n-list-item>
          </n-list>
        </n-space>
      </n-spin>
    </n-space>
  </n-card>
</template>

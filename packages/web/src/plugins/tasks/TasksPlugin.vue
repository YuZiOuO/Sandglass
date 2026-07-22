<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  NAlert,
  NButton,
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
    error.value = cause instanceof Error ? cause.message : '加载任务列表失败。'
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
    error.value = cause instanceof Error ? cause.message : '加载任务失败。'
  } finally {
    loading.value = false
  }
}

function formatDueDate(task: Task) {
  return task.dueDate ? `截止于 ${task.dueDate}` : '无截止日期'
}

watch(
  () => capability,
  () => void loadScopes(),
  { immediate: true },
)
watch(selectedScope, () => void loadTasks())
</script>

<template>
  <n-space vertical>
    <n-space justify="end">
      <n-button size="small" :loading="loading" @click="loadScopes">刷新</n-button>
    </n-space>
    <n-alert v-if="error" type="error" :title="error" />
    <n-empty v-if="!capability" description="连接 Google 后查看任务。" />
    <n-spin v-else :show="loading">
      <n-space vertical>
        <n-select
          v-if="scopeOptions.length"
          v-model:value="selectedScope"
          :options="scopeOptions"
          placeholder="选择任务列表"
        />
        <n-empty v-if="!scopes.length" description="暂无可用任务列表。" />
        <n-empty v-else-if="!tasks.length" description="此列表中没有任务。" />
        <n-list v-else bordered>
          <n-list-item v-for="task in tasks" :key="task.id">
            <n-thing :title="task.title" :description="formatDueDate(task)">
              <template #avatar>
                <n-tag :type="task.completed ? 'success' : 'warning'" size="small">
                  {{ task.completed ? '已完成' : '待处理' }}
                </n-tag>
              </template>
              <template v-if="task.notes" #footer>{{ task.notes }}</template>
            </n-thing>
          </n-list-item>
        </n-list>
      </n-space>
    </n-spin>
  </n-space>
</template>

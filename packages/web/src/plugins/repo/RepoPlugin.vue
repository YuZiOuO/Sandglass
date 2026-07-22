<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import {
  NAlert,
  NButton,
  NEmpty,
  NIcon,
  NSelect,
  NSpace,
  NSpin,
  NTimeline,
  NTimelineItem,
} from 'naive-ui'
import { AlertCircleOutline, GitCommit, GitPullRequest, RefreshOutline } from '@vicons/ionicons5'

import type { Activity, RepoCapability } from '@/capability/repo'
import type { Scope, Scoped } from '@/interfaces'

const { capabilities } = defineProps<{
  capabilities: readonly [RepoCapability, Scoped<RepoCapability>]
}>()

const repoCapability = capabilities[0]
const repositoryCapability = capabilities[1]
const scopes = ref<readonly Scope[]>([])
const selectedScope = ref('')
const activities = ref<readonly Activity[]>([])
const loadingScopes = ref(false)
const loadingActivities = ref(false)
const error = ref('')

const scopeOptions = computed(() => [
  { label: '所有仓库', value: '' },
  ...scopes.value.map((scope) => ({ label: scope.name, value: scope.id })),
])

const displayedActivities = computed(() => [...activities.value].reverse())
const loading = computed(() => loadingScopes.value || loadingActivities.value)

const activityMeta = {
  commit: { label: '提交', color: '#3b82f6', icon: GitCommit },
  issue: { label: '议题', color: '#f59e0b', icon: AlertCircleOutline },
  'pull-request': { label: '拉取请求', color: '#10b981', icon: GitPullRequest },
} as const

async function loadScopes() {
  loadingScopes.value = true
  error.value = ''

  try {
    scopes.value = await repositoryCapability.listScopes()
    if (selectedScope.value && !scopes.value.some(({ id }) => id === selectedScope.value)) {
      selectedScope.value = ''
    }
    await loadActivities()
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : '加载 GitHub 仓库失败。'
  } finally {
    loadingScopes.value = false
  }
}

async function loadActivities() {
  loadingActivities.value = true
  error.value = ''

  try {
    const to = new Date()
    const from = new Date(to)
    from.setDate(from.getDate() - 7)

    const capability = selectedScope.value
      ? repositoryCapability.forScope(selectedScope.value)
      : repoCapability
    activities.value = await capability.list({ from, to })
  } catch (cause) {
    activities.value = []
    error.value = cause instanceof Error ? cause.message : '加载 GitHub 动态失败。'
  } finally {
    loadingActivities.value = false
  }
}

function formatTime(time: Date) {
  return `${time.toLocaleDateString()} ${time.toLocaleTimeString()}`
}

watch(selectedScope, () => void loadActivities())
onMounted(() => void loadScopes())
</script>

<template>
  <n-space vertical>
    <n-space justify="end">
      <n-button
        size="small"
        :loading="loading"
        aria-label="刷新 GitHub 动态"
        title="刷新 GitHub 动态"
        @click="loadScopes"
      >
        <template #icon>
          <n-icon><RefreshOutline /></n-icon>
        </template>
        刷新
      </n-button>
    </n-space>
    <n-alert v-if="error" type="error" :title="error" />
    <n-select
      v-model:value="selectedScope"
      :options="scopeOptions"
      :loading="loadingScopes"
      :disabled="loadingScopes"
      aria-label="仓库"
    />

    <n-spin :show="loadingActivities">
      <n-empty v-if="!displayedActivities.length" description="最近 7 天没有动态。" />
      <n-timeline v-else>
        <n-timeline-item
          v-for="(activity, index) in displayedActivities"
          :key="`${activity.kind}-${activity.time.getTime()}-${index}`"
          :time="formatTime(activity.time)"
          :title="activityMeta[activity.kind].label"
        >
          <template #icon>
            <n-icon :color="activityMeta[activity.kind].color" :size="18">
              <component :is="activityMeta[activity.kind].icon" />
            </n-icon>
          </template>
          {{ activity.description }}
        </n-timeline-item>
      </n-timeline>
    </n-spin>
  </n-space>
</template>

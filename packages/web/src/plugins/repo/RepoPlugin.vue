<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import {
  NAlert,
  NButton,
  NCard,
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
  { label: 'All repositories', value: '' },
  ...scopes.value.map((scope) => ({ label: scope.name, value: scope.id })),
])

const displayedActivities = computed(() => [...activities.value].reverse())
const loading = computed(() => loadingScopes.value || loadingActivities.value)

const activityMeta = {
  commit: { label: 'Commit', color: '#3b82f6', icon: GitCommit },
  issue: { label: 'Issue', color: '#f59e0b', icon: AlertCircleOutline },
  'pull-request': { label: 'Pull request', color: '#10b981', icon: GitPullRequest },
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
    error.value = cause instanceof Error ? cause.message : 'Failed to load GitHub repositories.'
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
    error.value = cause instanceof Error ? cause.message : 'Failed to load GitHub activity.'
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
  <n-card title="GitHub activity">
    <template #header-extra>
      <n-button
        size="small"
        :loading="loading"
        aria-label="Refresh GitHub activity"
        title="Refresh GitHub activity"
        @click="loadScopes"
      >
        <template #icon>
          <n-icon><RefreshOutline /></n-icon>
        </template>
        Refresh
      </n-button>
    </template>

    <n-space vertical>
      <n-alert v-if="error" type="error" :title="error" />
      <n-select
        v-model:value="selectedScope"
        :options="scopeOptions"
        :loading="loadingScopes"
        :disabled="loadingScopes"
        aria-label="Repository"
      />

      <n-spin :show="loadingActivities">
        <n-empty v-if="!displayedActivities.length" description="No activity in the last 7 days." />
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
  </n-card>
</template>

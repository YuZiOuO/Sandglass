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

import type { CalendarCapability, CalendarEvent } from '@/capability/calendar'
import type { Scope, Scoped } from '@/interfaces'

const { capabilities } = defineProps<{
  capabilities: readonly [Scoped<CalendarCapability>]
}>()
const capability = capabilities[0]

const scopes = ref<readonly Scope[]>([])
const selectedScope = ref<string>()
const events = ref<readonly CalendarEvent[]>([])
const loading = ref(false)
const error = ref('')

const scopeOptions = computed(() =>
  scopes.value.map((scope) => ({ label: scope.name, value: scope.id })),
)

async function loadScopes() {
  if (!capability) {
    scopes.value = []
    selectedScope.value = undefined
    events.value = []
    return
  }

  loading.value = true
  error.value = ''

  try {
    scopes.value = await capability.listScopes()
    selectedScope.value = scopes.value[0]?.id
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Failed to load calendars.'
  } finally {
    loading.value = false
  }
}

async function loadEvents() {
  if (!capability || !selectedScope.value) {
    events.value = []
    return
  }

  loading.value = true
  error.value = ''

  try {
    const from = new Date()
    from.setHours(0, 0, 0, 0)
    const to = new Date(from)
    to.setDate(to.getDate() + 14)
    events.value = await capability.forScope(selectedScope.value).list({ from, to })
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Failed to load calendar events.'
  } finally {
    loading.value = false
  }
}

function formatEventTime(event: CalendarEvent) {
  if ('startDate' in event.time) {
    return `${event.time.startDate} - ${event.time.endDate}`
  }

  return `${event.time.startAt.toLocaleString()} - ${event.time.endAt.toLocaleTimeString()}`
}

watch(
  () => capability,
  () => void loadScopes(),
  { immediate: true },
)
watch(selectedScope, () => void loadEvents())
</script>

<template>
  <n-card title="Calendar">
    <template #header-extra>
      <n-button size="small" :loading="loading" @click="loadScopes">Refresh</n-button>
    </template>

    <n-space vertical>
      <n-alert v-if="error" type="error" :title="error" />
      <n-empty v-if="!capability" description="Connect Google to view calendars." />
      <n-spin v-else :show="loading">
        <n-space vertical>
          <n-select
            v-if="scopeOptions.length"
            v-model:value="selectedScope"
            :options="scopeOptions"
            placeholder="Select a calendar"
          />
          <n-empty v-if="!scopes.length" description="No calendars available." />
          <n-empty v-else-if="!events.length" description="No events in the next 14 days." />
          <n-list v-else bordered>
            <n-list-item v-for="event in events" :key="event.id">
              <n-thing :title="event.title" :description="formatEventTime(event)">
                <template v-if="event.description" #footer>
                  {{ event.description }}
                </template>
                <template #avatar>
                  <n-tag type="success" size="small">Event</n-tag>
                </template>
              </n-thing>
            </n-list-item>
          </n-list>
        </n-space>
      </n-spin>
    </n-space>
  </n-card>
</template>

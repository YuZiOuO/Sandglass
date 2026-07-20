<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  NAlert,
  NButton,
  NCard,
  NDivider,
  NEmpty,
  NFlex,
  NGrid,
  NGi,
  NH1,
  NIcon,
  NPopconfirm,
  NStatistic,
  NTag,
  NTime,
  NProgress,
} from 'naive-ui'
import { CafeOutline, MoonOutline, PlayOutline, SunnyOutline } from '@vicons/ionicons5'

import type { AttendanceCapability, AttendanceRecord } from '@/capability/attendance'
import AttendanceTimeline from './AttendanceTimeline.vue'

const { capabilities } = defineProps<{
  capabilities: readonly [AttendanceCapability]
}>()
const capability = capabilities[0]

const records = ref<readonly AttendanceRecord[]>([])
const now = ref(new Date())
const loading = ref(true)
const saving = ref<AttendanceRecord['type']>()
const error = ref('')
let timer: number | undefined

const status = computed(() => records.value.at(-1)?.type ?? 'OUT')
const statusLabel = computed(() =>
  records.value.length === 0
    ? '未签到'
    : { IN: '工作中', PAUSE: '休息中', OUT: '空闲中' }[status.value],
)
const statusType = computed(
  () => (({ IN: 'success', PAUSE: 'warning', OUT: 'info' }) as const)[status.value],
)
const todayWorkTime = computed(() => {
  const start = new Date(now.value)
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(end.getDate() + 1)
  return calculateWorkTime(records.value, start, end, now.value)
})
const canRecordIn = computed(() => status.value !== 'IN')
const canPause = computed(() => status.value === 'IN')
const canRecordOut = computed(() => status.value === 'IN' || status.value === 'PAUSE')

function calculateWorkTime(
  allRecords: readonly AttendanceRecord[],
  from: Date,
  to: Date,
  current: Date,
) {
  let startedAt: number | undefined
  let total = 0

  for (const record of allRecords) {
    const time = record.time.getTime()
    if (record.type === 'IN' && startedAt === undefined) {
      startedAt = Math.max(time, from.getTime())
    } else if (startedAt !== undefined) {
      total += Math.max(0, Math.min(time, to.getTime()) - startedAt)
      startedAt = undefined
    }
  }

  if (startedAt !== undefined) {
    total += Math.max(0, Math.min(current.getTime(), to.getTime()) - startedAt)
  }
  return total
}

function formatHours(milliseconds: number) {
  return (milliseconds / 3_600_000).toFixed(1)
}

async function load() {
  error.value = ''
  try {
    records.value = await capability.list()
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : '加载考勤记录失败。'
  } finally {
    loading.value = false
  }
}

async function record(type: AttendanceRecord['type']) {
  saving.value = type
  error.value = ''
  try {
    await capability.record({ time: new Date(), type })
    await load()
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : '保存考勤记录失败。'
  } finally {
    saving.value = undefined
  }
}

async function remove(id: string) {
  error.value = ''
  try {
    await capability.remove(id)
    await load()
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : '删除考勤记录失败。'
  }
}

onMounted(() => {
  timer = window.setInterval(() => {
    now.value = new Date()
  }, 1000)
  void load()
})

onBeforeUnmount(() => {
  if (timer !== undefined) {
    window.clearInterval(timer)
  }
})
</script>

<template>
  <n-card title="考勤">
    <n-empty v-if="loading" description="正在加载考勤记录。" />
    <template v-else>
      <n-alert v-if="error" type="error" :title="error" />

      <n-h1 style="width: 100%; margin: 0; text-align: center">
        <n-time :time="now.getTime()" format="HH:mm:ss" />
      </n-h1>
      <n-divider />

      <n-flex align="center">
        <Transition name="status" mode="out-in">
          <n-tag :key="status" :type="statusType" :bordered="false">{{ statusLabel }}</n-tag>
        </Transition>
        <n-progress
          :percentage="status === 'IN' ? 100 : 0"
          :processing="status === 'IN'"
          :status="status === 'IN' ? 'success' : undefined"
          indicator-placement="inside"
        />
      </n-flex>

      <n-divider />
      <n-grid :cols="2">
        <n-gi>
          <n-statistic label="今日累计" :value="formatHours(todayWorkTime)">
            <template #suffix>h</template>
          </n-statistic>
        </n-gi>
        <n-gi>
          <n-statistic label="记录数" :value="records.length" />
        </n-gi>
      </n-grid>

      <n-divider />
      <n-grid cols="s:1 m:3" responsive="screen" x-gap="12">
        <n-gi>
          <n-button
            block
            type="primary"
            size="large"
            :disabled="!canRecordIn"
            :loading="saving === 'IN'"
            @click="record('IN')"
          >
            <template #icon>
              <n-icon><component :is="status === 'PAUSE' ? PlayOutline : SunnyOutline" /></n-icon>
            </template>
            {{ status === 'PAUSE' ? '恢复' : '签到' }}
          </n-button>
        </n-gi>
        <n-gi>
          <n-button
            block
            type="warning"
            size="large"
            :disabled="!canPause"
            :loading="saving === 'PAUSE'"
            @click="record('PAUSE')"
          >
            <template #icon>
              <n-icon><CafeOutline /></n-icon>
            </template>
            暂停
          </n-button>
        </n-gi>
        <n-gi>
          <n-popconfirm @positive-click="record('OUT')">
            <template #trigger>
              <n-button
                block
                type="error"
                size="large"
                :disabled="!canRecordOut"
                :loading="saving === 'OUT'"
              >
                <template #icon>
                  <n-icon><MoonOutline /></n-icon>
                </template>
                签退
              </n-button>
            </template>
            您将签退。当前时间：{{ now.toLocaleTimeString() }}
          </n-popconfirm>
        </n-gi>
      </n-grid>

      <n-divider />
      <attendance-timeline :records="records" :on-remove="remove" />
    </template>
  </n-card>
</template>

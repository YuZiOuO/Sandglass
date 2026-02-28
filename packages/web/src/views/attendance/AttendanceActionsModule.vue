<template>
  <NSpace vertical size="large">
    <!-- Clock Area -->
    <NH1
      style="width: 100%; margin: 0; display: flex; align-items: center; justify-content: center"
    >
      <NTime :time="now.getTime()" format="HH:mm:ss"> </NTime>
    </NH1>

    <!-- Main Button Area -->
    <NSpace :wrap="false" justify="center" size="large">
      <NButton
        size="large"
        type="primary"
        :ghost="cannotCheckIn"
        :disabled="cannotCheckIn"
        :loading="whichTypeIsBeingCreated === 'IN'"
        @click="handleRecordCreate('IN')"
      >
        <template #icon>
          <component :is="displayResume ? iconMap.RESUME : iconMap.IN" />
        </template>
        {{ displayResume ? '恢复' : '打上班卡' }}
      </NButton>
      <NButton
        size="large"
        type="warning"
        :ghost="cannotPause"
        :disabled="cannotPause"
        :loading="whichTypeIsBeingCreated === 'PAUSE'"
        @click="handleRecordCreate('PAUSE')"
      >
        <template #icon>
          <component :is="iconMap.PAUSE"></component>
        </template>
        暂停
      </NButton>
      <NPopconfirm @positive-click="handleRecordCreate('OUT')">
        <template #trigger>
          <NButton
            size="large"
            type="error"
            :ghost="cannotCheckOut"
            :disabled="cannotCheckOut"
            :loading="whichTypeIsBeingCreated === 'OUT'"
          >
            <template #icon>
              <component :is="iconMap.OUT"></component>
            </template>
            打下班卡
          </NButton>
        </template>
        您将签出。当前时间:{{ now.toLocaleTimeString() }}
      </NPopconfirm>
    </NSpace>

    <!-- Sub Button Area -->
    <NFlex :align="'center'" :wrap="false">
      <NInput placeholder="事由(选填)" style="flex: 1"> </NInput>
      <NSpace size="small" :wrap="false">
        <!-- 补卡按钮 -->
        <FixActionButton :project-id="projectId"/>

        <!-- 请假按钮 -->
        <LeaveActionButton />

        <!-- 修改目标按钮 -->
        <TargetUpdateActionButton />
      </NSpace>
    </NFlex>
  </NSpace>
</template>

<script setup lang="ts">
import {
  useAttendanceRecordCreateMutate,
  useAttendanceLatestStatus,
  type AttendanceRecordType,
} from '@/services-composable/attendance-record'
import { computed } from 'vue'
import { NButton, NInput, NPopconfirm, NSpace, NFlex, NH1, NTime } from 'naive-ui'
import { useNow } from '@vueuse/core'
import { attendanceModuleIconMap as iconMap } from './icon'
import TargetUpdateActionButton from './action-buttons/TargetActionButton.vue'
import FixActionButton from './action-buttons/FixActionButton.vue'
import LeaveActionButton from './action-buttons/LeaveActionButton.vue'

const props = defineProps<{ projectId?: string }>()

const now = useNow()

const attendanceStatus = useAttendanceLatestStatus()

const recordCreateHook = useAttendanceRecordCreateMutate()
function handleRecordCreate(type: AttendanceRecordType) {
  recordCreateHook.mutate({
    time: new Date(),
    type: type,
    projectId: props.projectId,
  })
}

// UI display Login
const whichTypeIsBeingCreated = computed(() => {
  const recordMutateHook = recordCreateHook
  return recordMutateHook.isPending.value ? recordMutateHook.variables.value?.type : undefined
})

const cannotCheckIn = computed(() => ['IN', undefined].includes(attendanceStatus.data.value))
const cannotPause = computed(() => attendanceStatus.data.value !== 'IN')
const cannotCheckOut = computed(() => ['OUT', undefined].includes(attendanceStatus.data.value))
const displayResume = computed(() => attendanceStatus.data.value === 'PAUSE')
</script>

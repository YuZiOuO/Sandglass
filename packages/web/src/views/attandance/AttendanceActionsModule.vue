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
        :ghost="['IN', undefined].includes(attendanceStatus)"
        :disabled="['IN', undefined].includes(attendanceStatus)"
        :loading="attendanceRecordIsCreating === 'IN'"
        @click="
          async () => {
            attendanceRecordCreateRef.json.time = new Date()
            attendanceRecordCreateRef.json.type = 'IN'
            attendanceRecordCreate.mutate(attendanceRecordCreateRef)
          }
        "
      >
        <template #icon>
          <component
            :is="
              attendanceStatus === 'PAUSE'
                ? attendanceModuleIconMap.RESUME
                : attendanceModuleIconMap.IN
            "
          />
        </template>
        {{ attendanceStatus === 'PAUSE' ? '恢复' : '打上班卡' }}
      </NButton>
      <NButton
        size="large"
        type="warning"
        :ghost="attendanceStatus !== 'IN'"
        :disabled="attendanceStatus !== 'IN'"
        :loading="attendanceRecordIsCreating === 'PAUSE'"
        @click="
          async () => {
            attendanceRecordCreateRef.json.time = new Date()
            attendanceRecordCreateRef.json.type = 'PAUSE'
            attendanceRecordCreate.mutate(attendanceRecordCreateRef)
          }
        "
      >
        <template #icon>
          <component :is="attendanceModuleIconMap.PAUSE"></component>
        </template>
        暂停
      </NButton>
      <NPopconfirm
        @positive-click="
          async () => {
            attendanceRecordCreateRef.json.time = new Date()
            attendanceRecordCreateRef.json.type = 'OUT'
            attendanceRecordCreate.mutate(attendanceRecordCreateRef)
          }
        "
      >
        <template #trigger>
          <NButton
            size="large"
            type="error"
            :ghost="['OUT', undefined].includes(attendanceStatus)"
            :disabled="['OUT', undefined].includes(attendanceStatus)"
            :loading="attendanceRecordIsCreating === 'OUT'"
          >
            <template #icon>
              <component :is="attendanceModuleIconMap.OUT"></component>
            </template>
            打下班卡
          </NButton>
        </template>
        您将签出。当前时间:{{ useNow() }}
      </NPopconfirm>
    </NSpace>

    <!-- Sub Button Area -->
    <NFlex :align="'center'" :wrap="false">
      <NInput placeholder="事由(选填)" style="flex: 1"> </NInput>
      <NSpace size="small" :wrap="false">
        <!-- 补卡按钮 -->
        <NPopover :delay="200">
          <template #trigger>
            <NButton secondary circle>
              <template #icon>
                <component :is="attendanceModuleIconMap.FIX"></component>
              </template>
            </NButton>
          </template>
          补卡
        </NPopover>

        <!-- 请假按钮 -->
        <NPopover :delay="200">
          <template #trigger>
            <NButton secondary circle>
              <template #icon>
                <component :is="attendanceModuleIconMap.LEAVE"></component>
              </template>
            </NButton>
          </template>
          请假
        </NPopover>

        <!-- 修改目标按钮 -->
        <NPopconfirm
          :show="attendanceTargetUpdate.isPending.value || undefined"
          @positive-click="
            async () => {
              attendanceTargetUpdate.mutate(attendanceTargetUpdateRef)
            }
          "
          :positive-button-props="{ loading: attendanceTargetUpdate.isPending.value }"
        >
          <template #trigger>
            <NPopover :delay="200">
              <template #trigger>
                <NButton secondary circle>
                  <template #icon>
                    <component :is="attendanceModuleIconMap.TARGET"></component>
                  </template>
                </NButton>
              </template>
              修改目标
            </NPopover>
          </template>
          修改目标
          <NInputNumber
            placeholder="新目标值"
            v-model:value="attendanceTargetUpdateRef.json.timeMs"
          />
        </NPopconfirm>
      </NSpace>
    </NFlex>
  </NSpace>
</template>

<script setup lang="ts">
import {
  useAttendaceRecordCreateMutate,
  useAttendanceLatestStatus,
  type AttendanceRecordCreateDTO,
} from '@/services-composable/attendance-record'
import {
  useAttendanceTargetUpdateMutate,
  type AttendanceTargetUpdateDTO,
} from '@/services-composable/attendance-target'
import { computed, ref } from 'vue'
import {
  NButton,
  NInput,
  NPopconfirm,
  NSpace,
  NFlex,
  NPopover,
  NH1,
  NTime,
  NInputNumber,
} from 'naive-ui'
import { useNow } from '@vueuse/core'
import { attendanceModuleIconMap } from './icon'

const now = useNow()

const attendanceStatus = useAttendanceLatestStatus()

const attendanceRecordCreate = useAttendaceRecordCreateMutate()
const attendanceRecordCreateRef = ref<AttendanceRecordCreateDTO>({
  json: {
    time: new Date(),
    type: 'IN',
  },
})
const attendanceRecordIsCreating = computed(() => {
  const recordMutateHook = attendanceRecordCreate
  return recordMutateHook.isPending.value ? recordMutateHook.variables.value?.json.type : undefined
})

const attendanceTargetUpdate = useAttendanceTargetUpdateMutate()
const attendanceTargetUpdateRef = ref<AttendanceTargetUpdateDTO>({ json: { timeMs: 0 } })
</script>

<style scoped></style>

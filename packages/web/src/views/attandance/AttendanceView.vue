<template>
  <!-- 大致布局: 左侧66%为内容 右侧33%为操作 
   左侧从上到下：基础状态、统计、时间线 
   右侧为按钮组、请假 -->
  <n-grid :cols="3" x-gap="12">
    <n-gi :span="2">
      <NFlex vertical>
        <NCard>
          <AttendanceStatusModule />
        </NCard>

        <NCard>
          <AttendanceStatisticsModule />
        </NCard>
      </NFlex>
    </n-gi>
    <n-gi>
      <NFlex vertical>
        <NCard>
          <AttendanceActionsModule />
        </NCard>

        <NCard title="今日打卡记录">
          <AttendanceTimelineModule />
        </NCard>
      </NFlex>
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { NCard, NGrid, NGi, NFlex } from 'naive-ui'
import AttendanceStatisticsModule from './AttendanceStatisticsModule.vue'
import AttendanceActionsModule from './AttendanceActionsModule.vue'
import AttendanceStatusModule from './AttendanceStatusModule.vue'
import AttendanceTimelineModule from './AttendanceTimelineModule.vue'
</script>

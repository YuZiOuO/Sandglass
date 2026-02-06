<template>
  <!-- 大致布局: 左侧66%为内容 右侧33%为操作 
   左侧从上到下：基础状态、统计、时间线 
   右侧为按钮组、请假 -->
   <div>
    <NCard>
      <AttendanceStatusModule />
    </NCard>

    <NCard>
      <AttendanceStatisticsModule />
    </NCard>

    <NCard>
      <AttendanceTimelineModule />
    </NCard>

   </div>
   <div>
    <NCard>
      <AttendanceActionsModule />
    </NCard>

    <NCard>
      <AttendanceLeaveActionsModule />
    </NCard>
    </div>
</template>

<script setup lang="ts">
import { NCard } from 'naive-ui';
import AttendanceStatisticsModule from './AttendanceStatisticsModule.vue';
import AttendanceActionsModule from './AttendanceActionsModule.vue';
import AttendanceLeaveActionsModule from './AttendanceLeaveActionsModule.vue';
import AttendanceStatusModule from './AttendanceStatusModule.vue';
import AttendanceTimelineModule from './AttendanceTimelineModule.vue';
</script>

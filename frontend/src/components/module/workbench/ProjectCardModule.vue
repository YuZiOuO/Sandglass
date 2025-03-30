<template>
  <n-card bordered>
    <n-h5 prefix="bar">
      课程名称
    </n-h5>
    <n-progress type="line" :percentage="95" indicator-placement="inside" />
    <n-hr />
    <n-timeline>
      <n-timeline-item type="success" title="成功" content="哪里成功" time="2018-04-03 20:46" />
      <n-timeline-item type="error" content="哪里错误" time="2018-04-03 20:46" />
      <n-timeline-item type="warning" title="警告" content="哪里警告" time="2018-04-03 20:46" />
      <n-timeline-item type="info" title="信息" content="是的" time="2018-04-03 20:46" line-type="dashed" />
    </n-timeline>
  </n-card>
</template>

<script setup lang="ts">
import { NCard, NH5, NHr, NProgress, NTimeline, NTimelineItem } from 'naive-ui';
</script>

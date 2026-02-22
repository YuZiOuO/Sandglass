<script setup lang="ts">
import { NCard, NHeatmap } from 'naive-ui'
import { heatmapMockData } from 'naive-ui'
</script>

<template>
  <n-card size="small">
    <n-heatmap style="min-width: 0;" :data="heatmapMockData()"/>
  </n-card>
</template>

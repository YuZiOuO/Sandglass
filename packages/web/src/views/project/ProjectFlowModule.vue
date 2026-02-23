<script setup lang="ts">
import { NCard } from 'naive-ui'
import EventsTimeline from '../common/EventsTimeline.vue'
</script>

<template>
  <n-card size="small" title="Flow">
    <events-timeline
      :attendance="{ preset: 'today' }"
      :github="{
        owner: 'YuZiOuO',
        repo: 'Sandglass',
        since: new Date(new Date().setHours(0, 0, 0, 0)), // start of today
      }"
    />
    
  </n-card>
</template>

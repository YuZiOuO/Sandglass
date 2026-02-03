<template>
  <NFlex class="flex" :justify="'start'" :align="'start'">
    <suspense>
      <NCard class="flex-item" title="Firebase"><DebugFirebase /></NCard>
    </suspense>
    <suspense>
      <NCard class="flex-item" title="OAuth"><DebugOAuth /></NCard>
    </suspense>
    <suspense>
      <NCard class="flex-item" title="Project"><DebugProject /></NCard>
    </suspense>
    <suspense>
      <NCard class="flex-item" title="GoogleCalendar"><DebugGoogleCalendar /></NCard>
    </suspense>
    <Suspense>
      <NCard class="flex-item" title="GoogleTasks"><DebugGoogleTasks /></NCard>
    </Suspense>

    <NCard title="meta">
      <NCard title="API_BASEURL">
        {{ url }}
      </NCard>
    </NCard>
  </NFlex>
</template>

<script setup lang="ts">
import { NCard, NFlex } from 'naive-ui'
import DebugFirebase from './debug/DebugFirebase.vue'
import DebugOAuth from './debug/DebugOAuth.vue'
import DebugProject from './debug/DebugProject.vue'
import DebugGoogleTasks from './debug/DebugGoogleTasks.vue'
import DebugGoogleCalendar from './debug/DebugGoogleCalendar.vue'

const url = import.meta.env.SG_WEB_API_BASEURL
</script>

<style>
.flex {
  display: flex;
  flex-direction: row;
  justify-content: start;
  flex-wrap: wrap;
}
.flex-item {
  width: 30%;
}
</style>

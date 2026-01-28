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
import DebugFirebase from './DebugFirebase.vue'
import { NCard, NFlex } from 'naive-ui'
import DebugProject from './DebugProject.vue'
import DebugOAuth from './DebugOAuth.vue'
import DebugGoogleCalendar from './DebugGoogleCalendar.vue'
import DebugGoogleTasks from './DebugGoogleTasks.vue'

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

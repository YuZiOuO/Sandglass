<template>
  <NFlex class="flex" :justify="'start'" :align="'start'">
    <suspense>
      <NCard class="flex-item" title="User"><DebugUser /></NCard>
    </suspense>
    <suspense>
      <NCard class="flex-item" title="GoogleAuth"><DebugGoogleAuth /></NCard>
    </suspense>
    <suspense>
      <NCard class="flex-item" title="Project"><DebugProject /></NCard>
    </suspense>
  </NFlex>
</template>

<script setup lang="ts">
import DebugGoogleAuth from '@/components/module/debug/DebugGoogleAuth.vue'
import DebugUser from '@/components/module/debug/DebugFirebase.vue'
import { NCard, NFlex } from 'naive-ui'
import DebugProject from '@/components/module/debug/DebugProject.vue'
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

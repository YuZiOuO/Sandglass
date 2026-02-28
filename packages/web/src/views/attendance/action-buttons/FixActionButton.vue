<template>
  <NPopConfirmWithHook>
    <template #description> 补卡 </template>
    <template #icon>
      <component :is="attendanceModuleIconMap.FIX"></component>
    </template>
    <template #form> </template>
  </NPopConfirmWithHook>
</template>
<script setup lang="ts">
import { attendanceModuleIconMap } from '../icon'
import NPopConfirmWithHook from './base/ActionButton.vue'
</script>

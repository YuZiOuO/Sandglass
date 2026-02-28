<template>
  <NPopConfirmWithHook>
    <template #description> 请假 </template>
    <template #icon>
      <component :is="attendanceModuleIconMap.LEAVE"></component>
    </template>
    <template #form> </template>
  </NPopConfirmWithHook>
</template>
<script setup lang="ts">
import { attendanceModuleIconMap } from '../icon'
import NPopConfirmWithHook from './base/ActionButton.vue'
</script>

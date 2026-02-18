<script setup lang="ts">
import { NCard, NCalendar } from 'naive-ui'
</script>

<template>
  <n-card size="small" title="4. 沉淀历 (Calendar)">
    <n-calendar #="{ year, month, date }" :actions="[]">
        <!-- Minimal implementations -->
    </n-calendar>
  </n-card>
</template>

<script setup lang="ts">
import type { Plugin } from './core/plugin'
import ConnectionManager from './components/ConnectionManager.vue'
import MailPanel from './plugins/mail/MailPanel.vue'

const plugins: Plugin[] = [MailPanel]
</script>

<template>
  <ConnectionManager v-slot="{ capabilities }">
    <template v-for="plugin in plugins" :key="plugin">
      <component :is="plugin" :capabilities="capabilities" />
    </template>
  </ConnectionManager>
</template>

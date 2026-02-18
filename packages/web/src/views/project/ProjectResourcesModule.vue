<script setup lang="ts">
import { computed } from 'vue'
import { NCard, NList, NListItem } from 'naive-ui'
import { useProjectResourcesQuery } from '@/services-composable/project'

const props = defineProps<{
  projectId: string
}>()

const { data: resources } = useProjectResourcesQuery(computed(() => props.projectId).value)
</script>

<template>
  <n-card size="small" title="5. 资源库 (Resources)">
    <n-list hoverable map clickable>
      <n-list-item v-for="res in resources" :key="res.id">
        <a :href="res.url" target="_blank" class="no-underline text-current flex items-center gap-2">
          <span v-if="res.url.includes('pdf')">📄</span>
          <span v-else>🔗</span>
          {{ res.title }}
        </a>
      </n-list-item>
      <!-- Mock items if empty -->
      <template v-if="!resources?.length">
        <n-list-item>
          <div class="flex items-center gap-2">📄 Lab_Guide.pdf</div>
        </n-list-item>
        <n-list-item>
          <div class="flex items-center gap-2">🔗 GitHub Repo</div>
        </n-list-item>
      </template>
    </n-list>
  </n-card>
</template>

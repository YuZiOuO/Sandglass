<template>
  <ProjectListModule :projs="mockProj" />
</template>

<script setup lang="ts">
import { proj } from '@/api/example_proj';
import ProjectListModule from '@/components/module/project-list/ProjectListModule.vue';
const mockProj = [proj, proj, proj]
</script>

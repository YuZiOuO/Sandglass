<template>
  <ProjectDetailModule :proj="proj" />
</template>

<script lang="ts" setup>
import ProjectDetailModule from '@/components/module/project-page/ProjectDetailModule.vue';
import { proj } from '@/api/example_proj';
//TODO: fetch proj obj from api

</script>

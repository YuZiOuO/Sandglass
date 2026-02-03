<template>
  <div class="root">
    <ProjectDetailModule
      :project-data="{
        id: 'id here',
        uid: 'id here',
        calendarId: 'id here',
        tasklistId: 'id here',
      }"
      :tasks-data="[]"
    />
  </div>
</template>
<script setup lang="ts">
import ProjectDetailModule from './project/ProjectDetailModule.vue'
</script>

<style lang="css" scoped>
.root {
  display: flex;
}
</style>

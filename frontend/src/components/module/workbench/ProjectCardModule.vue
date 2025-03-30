<template>
  <div class="container">
    <n-card bordered>
      <n-h5 prefix="bar">
        {{ props.proj.name }}
      </n-h5>
      <n-progress type="line" :percentage="95" indicator-placement="inside" />
      <n-hr />
      <TimeLineModule :nodes="props.proj.nodes" />
    </n-card>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import TimeLineModule from '../project-info-general/TimeLineModule.vue';
import { NCard, NH5, NHr, NProgress } from 'naive-ui';
import type { Project } from '@/api/proj_api';


const props = defineProps({
  proj: {
    type: Object as PropType<Project>,
    required: true
  }
})
</script>

<style scoped>
.container {
  min-width: 32%;
}
</style>

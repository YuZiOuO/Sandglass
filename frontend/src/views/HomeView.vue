<template>
  <!-- TODO:最近活动 -->
  <n-layout has-sider class="content">
    <n-layout-sider style="margin: 0 24px 0 0">
      <!-- sider与content间隔24px -->
      <n-flex>
        <GreetingModule :name="'test'" />
        <TodoListModule :unfinished_nodes="15" :unfinished_tasks="2" />
      </n-flex>
    </n-layout-sider>
    <n-layout-content>
      <n-flex vertical>
        <n-flex :wrap="false">
          <HeatmapModule :values="[{ date: '2025-3-20', count: 2 }]" />
          <HeatmapModule :values="[{ date: '2025-3-20', count: 2 }]" />
        </n-flex>
        <n-flex justify="flex-start">
          <ProjectCardModule :proj="proj" />
        </n-flex>
      </n-flex>
    </n-layout-content>
  </n-layout>
</template>

<script setup lang="ts">
import {
  NFlex,
  NLayout,
  NLayoutContent,
  NLayoutSider,
} from 'naive-ui'

import { proj } from '@/api/example_proj'
import GreetingModule from '@/components/module/workbench/GreetingModule.vue'
import HeatmapModule from '@/components/module/workbench/HeatmapModule.vue'
import ProjectCardModule from '@/components/module/workbench/ProjectCardModule.vue'
import TodoListModule from '@/components/module/workbench/TodoListModule.vue'
</script>

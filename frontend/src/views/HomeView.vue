<template>
  <div>
    <!-- TODO:最近活动 -->
    <n-layout has-sider>
      <n-layout-sider>
        <GreetingModule :name="'test'" />
        <TodoListModule :unfinished_nodes="15" :unfinished_tasks="2" />
      </n-layout-sider>
      <n-layout-content>
        <n-grid :cols="2">
          <n-gi>
            <HeatmapModule :values="[{ date: '2025-3-20', count: 2 }]" />
          </n-gi>
          <n-gi>
            <HeatmapModule :values="[{ date: '2025-3-20', count: 2 }]" />
          </n-gi>
        </n-grid>
        <ProjectCardModule />
      </n-layout-content>
    </n-layout>
  </div>
</template>

<script setup lang="ts">
import { NLayout, NLayoutSider, NLayoutContent, NGi, NGrid } from 'naive-ui';
import ProjectCardModule from '@/components/module/workbench/ProjectCardModule.vue';
import HeatmapModule from '@/components/module/workbench/HeatmapModule.vue';
import TodoListModule from '@/components/module/workbench/TodoListModule.vue';
import GreetingModule from '@/components/module/workbench/GreetingModule.vue';
</script>

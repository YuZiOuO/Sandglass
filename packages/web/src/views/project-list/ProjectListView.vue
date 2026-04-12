<template>
  <!-- 使用 NGrid 实现响应式布局：在移动端由于可用空间少，默认堆叠成一列（并排铺满向下）；在屏幕宽度够用时（m 以上），左右两列分治 -->
  <NGrid :x-gap="24" :y-gap="24" cols="1 m:2" responsive="screen">
    <!-- 列表展示分配更多的空间或者和创建分庭抗礼均可，为了阅读体验，这里左右平分 -->
    <NGi>
      <ProjectListDisplayModule />
    </NGi>
    
    <NGi>
      <ProjectListCreateModule />
    </NGi>
  </NGrid>
</template>

<script setup lang="ts">
import { NGrid, NGi } from 'naive-ui'
import ProjectListCreateModule from './modules/ProjectListCreateModule.vue'
import ProjectListDisplayModule from './modules/ProjectListDisplayModule.vue'
</script>

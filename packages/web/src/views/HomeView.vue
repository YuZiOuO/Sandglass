<template>
  <n-space vertical :size="24">
    <n-card class="hero-card" :bordered="false">
      <n-space vertical :size="20">
        <n-tag type="success" round>Alpha</n-tag>
        <n-h1 style="margin: 0">Sandglass</n-h1>
        <n-text depth="3">
          把一门课程当作一个项目，统一管理考勤、日程、任务与代码进度。
        </n-text>
        <n-space>
          <n-button type="primary" @click="router.push('/project')">开始使用</n-button>
          <n-button secondary @click="router.push('/login')">登录</n-button>
        </n-space>
      </n-space>
    </n-card>

    <n-grid responsive="screen" cols="1 s:2 m:3" :x-gap="16" :y-gap="16">
      <n-grid-item v-for="feature in features" :key="feature.title">
        <n-card size="small" :title="feature.title">
          <n-text depth="3">{{ feature.description }}</n-text>
        </n-card>
      </n-grid-item>
    </n-grid>
  </n-space>
</template>

<script setup lang="ts">
import {
  NSpace,
  NCard,
  NTag,
  NH1,
  NText,
  NButton,
  NGrid,
  NGridItem,
} from 'naive-ui'
import { useRouter } from 'vue-router'

const router = useRouter()

const features = [
  {
    title: '考勤追踪',
    description: '通过打卡与统计图，查看你在课程上的真实投入。',
  },
  {
    title: '日历与任务同步',
    description: '整合课程安排、DDL 与提醒，减少信息分散。',
  },
  {
    title: '代码进度可视化',
    description: '关联仓库提交活动，持续观察项目推进节奏。',
  },
]
</script>

<style scoped>
.hero-card {
  background: linear-gradient(120deg, #eef8f2 0%, #e6f0ff 100%);
}
</style>

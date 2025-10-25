<template>
  <!-- TODO:最近活动 -->
  <n-layout has-sider class="content">
    <n-layout-sider style="margin: 0 24px 0 0">
      <!-- sider与content间隔24px -->
      <n-flex>
        <GreetingModule :name="'test'" />
        <!-- <TodoListModule :unfinished_nodes="15" :unfinished_tasks="2" /> -->
      </n-flex>
    </n-layout-sider>
    <n-layout-content>
      <n-flex vertical>
        <n-flex :wrap="false">
          <HeatmapModule :data="data" :loading="loading" />
        </n-flex>
        <n-flex justify="flex-start">
          <!-- <ProjectCardModule :proj="proj" /> -->
        </n-flex>
      </n-flex>
    </n-layout-content>
  </n-layout>
</template>

<script setup lang="ts">
import { NFlex, NLayout, NLayoutContent, NLayoutSider } from 'naive-ui'

import GreetingModule from '@/components/module/workbench/GreetingModule.vue'
import HeatmapModule from '@/components/common/HeatmapModule.vue'
import { GithubApi, type GithubContributionDTO } from '@/api'
import { onMounted, ref } from 'vue'

const data = ref<GithubContributionDTO[]>([])
const loading = ref<boolean>(true)

onMounted(async () => {
  data.value = (
    await new GithubApi(undefined, import.meta.env.VITE_API_BASEURL).getGithubActivities(
      '6ziRUSavItalErW0uDQyk5qS5Ts1',
    )
  ).data
  loading.value = false
})
</script>

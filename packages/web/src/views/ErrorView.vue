<template>
  <n-result status="404" title="404 Not Found" description="生活总归带点荒谬">
    <template #footer>
      <n-button @click="() => router.replace('/')">返回首页</n-button>
    </template>
  </n-result>
</template>

<script setup lang="ts">
import { NResult, NButton } from 'naive-ui'
import { useRouter } from 'vue-router';
const router = useRouter()
</script>

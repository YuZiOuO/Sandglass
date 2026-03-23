<template>
  <div class="center-container">
    <NResult
      status="success"
      :title="'认证成功'"
      :description="`${countdown.remaining.value}秒后自动跳转...`"
    >
      <template #footer>
        <NButton @click="() => router.push('/')">跳转</NButton>
      </template>
    </NResult>
  </div>
</template>

<script setup lang="ts">
import { useCountdown } from '@vueuse/core'
import { NResult, NButton } from 'naive-ui'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const countdown = useCountdown(10, {
  onComplete: () => {
    router.push('/')
  },
})

onMounted(() => countdown.start())
</script>

<style scoped>
.center-container {
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
}
</style>

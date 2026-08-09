<script setup lang="ts">
import {
  NAlert,
  NButton,
  NDescriptions,
  NDescriptionsItem,
  NDivider,
  NFlex,
  NSpin,
  NTag,
} from 'naive-ui'
import type { ConnectionItem, Provider } from '../composables/useConnection'

defineProps<{
  items: ConnectionItem[]
}>()

const emit = defineEmits<{
  authorize: [provider: Provider]
}>()
</script>

<template>
  <div>
    <section v-for="(item, index) in items" :key="item.name">
      <n-divider v-if="index" />
      <n-flex align="center" justify="space-between">
        <strong>{{ item.name }}</strong>
        <n-button
          v-if="!item.loading"
          size="small"
          type="primary"
          @click="emit('authorize', item.provider)"
        >
          {{ item.connected ? '重新连接' : '连接' }}
        </n-button>
      </n-flex>

      <n-spin :show="item.loading">
        <n-descriptions label-placement="left" :column="1" size="small" style="margin-top: 12px">
          <n-descriptions-item label="状态">
            <n-tag
              size="small"
              :bordered="false"
              :type="item.connected ? 'success' : item.error ? 'error' : 'default'"
            >
              {{
                item.loading
                  ? '检查中'
                  : item.connected
                    ? '已连接'
                    : item.error
                      ? '连接失败'
                      : '未连接'
              }}
            </n-tag>
          </n-descriptions-item>
          <n-descriptions-item v-if="item.connected" label="可用能力">
            {{ item.capabilityCount }} 项
          </n-descriptions-item>
        </n-descriptions>
        <n-alert v-if="item.error" type="error" :title="item.error" />
      </n-spin>
    </section>
  </div>
</template>

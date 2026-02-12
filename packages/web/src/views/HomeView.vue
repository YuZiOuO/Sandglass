<template>
  <n-layout has-sider class="content">
    <n-layout-sider style="margin: 0 24px 0 0">
      <NButton @click="authCli.linkSocial({ provider: 'google' })"> 链接到Google </NButton>
      <NButton @click="authCli.linkSocial({ provider: 'github' })"> 链接到Github </NButton>
    </n-layout-sider>
    <n-layout-content>
      <n-flex vertical>
        <n-flex :wrap="false">
        </n-flex>
      </n-flex>
    </n-layout-content>
  </n-layout>
</template>

<script setup lang="ts">
import { NFlex, NLayout, NLayoutContent, NLayoutSider, NButton } from 'naive-ui'
import { authCli } from '@/services-composable/common'
</script>

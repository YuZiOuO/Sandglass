<template>
  <n-drawer v-model:show="active" :width="502" placement="right">
    <n-drawer-content title="添加节点" closable>
      <n-switch v-model:value="addMultipleItem" />
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { NDrawer, NDrawerContent, NSwitch } from 'naive-ui';
import { ref } from 'vue';
const active = defineModel<boolean>('active', { required: true })

const addMultipleItem = ref(false)
</script>

<script setup lang="ts">
import { ref } from 'vue'
import { NCard, NInput, NDivider, NButton, NSpace, useMessage } from 'naive-ui'

const editorContent = ref('# 学习笔记\n\n- [ ] 预习课件\n- [ ] 整理思路\n')
const message = useMessage()
const isSaving = ref(false)

const handleSave = () => {
  isSaving.value = true
  setTimeout(() => {
    isSaving.value = false
    message.success('保存成功')
  }, 800)
}
</script>

<template>
  <n-card size="small" title="2. 核心工作区 (Editor)" class="h-full flex flex-col" content-style="display: flex; flex-direction: column; height: 100%;">
    <n-input
      v-model:value="editorContent"
      type="textarea"
      placeholder="开始你的沉淀..."
      :autosize="{ minRows: 20 }"
      class="flex-1 font-mono text-sm bg-gray-50 dark:bg-gray-900 border-none rounded-md p-4"
      style="height: 100%; border: none; outline: none;" 
    />
    
    <n-divider />
    
    <div class="flex justify-between items-center px-2">
      <span class="text-xs text-gray-400">Markdown supported</span>
      <n-space>
        <n-button size="small" secondary>分享</n-button>
        <n-button size="small" secondary>导出</n-button>
        <n-button type="primary" size="small" :loading="isSaving" @click="handleSave">保存</n-button>
      </n-space>
    </div>
  </n-card>
</template>

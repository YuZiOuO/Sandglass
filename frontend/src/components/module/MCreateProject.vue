<template>
  <div>
    <n-breadcrumb>
      <n-breadcrumb-item>
        项目
      </n-breadcrumb-item>
      <n-breadcrumb-item>
        新建项目
      </n-breadcrumb-item>
    </n-breadcrumb>
    <n-h1>
      新建项目
    </n-h1>
    <n-form ref="formRef" :model="model" label-placement="left" label-width="auto"
      require-mark-placement="right-hanging" size="medium" :style="{
        maxWidth: '640px',
      }">
      <n-form-item label="名称" path="name" :rule="{ required: true, message: '请输入一个名称', trigger: ['blur'] }">
        <n-input v-model:value="model.name" placeholder="请输入名称" />
      </n-form-item>
      <n-form-item label="开始于" path="startTimestamp">
        <n-date-picker type="date" v-model:value="model.startTimestamp" />
      </n-form-item>
      <n-form-item label="截止于" path="endTimestamp">
        <n-date-picker type="date" v-model:value="model.endTimestamp" />
      </n-form-item>
      <n-form-item>
        <n-button @click="submit">
          确定
        </n-button>
      </n-form-item>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import type { NewProject } from '@/api/model/proj_model';
import { create_proj } from '@/api/proj_api';
import { NBreadcrumb, NBreadcrumbItem, NFormItem, NForm, NInput, NDatePicker, NButton, NH1, type FormInst } from 'naive-ui';
import { ref } from 'vue';
const formRef = ref<FormInst | null>(null)
const model = ref({
  name: null,
  startTimestamp: null,
  endTimestamp: null
})

async function new_proj(model: NewProject) {
  const proj = { ...model, avatarUrl: "", description: "", task: [], status: "NOT_STARTED" };
  const id = await create_proj(proj);
  console.log(id);
}

const submit = ref(async () => { new_proj(model.value as unknown as NewProject) });
</script>

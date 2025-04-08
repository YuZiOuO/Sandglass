<template>
  <div>
    <!-- <n-breadcrumb>
      <n-breadcrumb-item>
        项目
      </n-breadcrumb-item>
      <n-breadcrumb-item>
        新建项目
      </n-breadcrumb-item>
    </n-breadcrumb>
    <n-h1>
      新建项目
    </n-h1> -->
    <n-form :model="model" label-placement="left" label-width="auto" require-mark-placement="right-hanging"
      size="medium" :style="{
        maxWidth: '640px',
      }">
      <n-form-item label="名称" path="name" :rule="{ required: true, message: '请输入一个名称', trigger: ['blur'] }">
        <n-input v-model:value="model.name" placeholder="请输入名称" />
      </n-form-item>
      <n-form-item label="开始于" path="startTimestamp">
        <n-date-picker type="date" v-model:formatted-value="model.start_timestamp" value-format="t" />
      </n-form-item>
      <n-form-item label="截止于" path="endTimestamp">
        <n-date-picker type="date" v-model:formatted-value="model.end_timestamp" value-format="t" />
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
import { api, notifyApiError } from '@/api/api';
import { NBreadcrumb, NBreadcrumbItem, NFormItem, NForm, NInput, NDatePicker, NButton, NH1, type FormInst } from 'naive-ui';
import { ref } from 'vue';
const model = ref({
  //FIXME:不够优雅
  name: null,
  start_timestamp: null,
  end_timestamp: null
})

const submit = () => {
  api().post('/proj',
    {
      name: model.value.name,
      start_timestamp: model.value.start_timestamp,
      end_timestamp: model.value.end_timestamp
    })
    .then((res) => {
      if (res.status === 201) {
        emit('created', null)
      }
    })
    .catch(notifyApiError)
}
const emit = defineEmits<{ created: [null] }>()
</script>

<template>
  <div>
    <n-drawer :show="show" :width="502" @update-show="() => show = false">
      <n-drawer-content title="创建项目" closable>
        <n-form ref="formRef" :model="input" label-placement="left" label-width="auto"
          require-mark-placement="right-hanging" size="medium" :style="{
            maxWidth: '640px',
          }">
          <n-form-item label="名称" path="name" :rule="{ required: true, message: '项目必须有个名！', trigger: ['blur'] }">
            <n-input v-model:value="input.name" placeholder="起个名" />
          </n-form-item>
          <n-form-item label="url" path="url">
            <n-input v-model:value="input.url" placeholder="https://example.com" />
          </n-form-item>
          <n-form-item label="描述" path="description">
            <n-input v-model:value="input.description" placeholder="简单地描述一下这个项目" />
          </n-form-item>
          <n-form-item label="开始于" path="startTimestamp">
            <n-date-picker type="date" v-model:formatted-value="input.start_timestamp" value-format="t" />
          </n-form-item>
          <n-form-item label="截止于" path="endTimestamp">
            <n-date-picker type="date" v-model:formatted-value="input.end_timestamp" value-format="t" />
          </n-form-item>
          <n-form-item label="附件" path="attachments">
            <n-upload multiple directory-dnd action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f" :max="5">
              <n-upload-dragger>
                <div style="margin-bottom: 12px">
                  <n-icon size="48" :depth="3">
                    <ArchiveIcon />
                  </n-icon>
                </div>
                <n-text style="font-size: 16px">
                  点击或者拖动文件到该区域来上传
                </n-text>
                <n-p depth="3" style="margin: 8px 0 0 0">
                  请不要上传敏感数据，比如你的银行卡号和密码，信用卡号有效期和安全码
                </n-p>
              </n-upload-dragger>
            </n-upload>
          </n-form-item>
        </n-form>
        <template #footer>
          <n-button :disabled="input.name == ''" type="primary" @click="submit">
            确定
          </n-button>
        </template>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup lang="ts">
import { api, notifyApiError } from '@/api/api';
import { NFormItem, NForm, NInput, NDatePicker, NButton, NDrawer, NDrawerContent, NUpload, NUploadDragger, NIcon, NText, NP, type FormInst } from 'naive-ui';
import { ref } from 'vue';
import { ArchiveOutline as ArchiveIcon } from '@vicons/ionicons5';
import type { minimumProject, optionalProject } from '@/api/model/proj';

const formRef = ref<FormInst | null>(null)
const input = ref<minimumProject & Partial<optionalProject>>({
  name: '',
})

async function submit() {
  api().post('/proj',
    input.value)
    .then((res) => {
      if (res.status === 201) {
        emit('created', null)
      }
    })
    .catch(notifyApiError)
}

const emit = defineEmits<{ created: [null] }>()

const show = defineModel("show", { type: Boolean, default: false })
</script>

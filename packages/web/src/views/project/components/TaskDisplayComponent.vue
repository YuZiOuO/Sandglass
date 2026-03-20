<template>
  <div v-if="item">
    <NSpin :show="updating">
      <NDropdown trigger="click" :options="dropdownOptions" @select="handleDropdownSelect">
        <NCard :size="'small'" hoverable>
          <n-thing>
            <template #header>
              <NH5
                style="margin: 0; margin-right: 5px"
                prefix="bar"
                :type="completed ? 'success' : 'info'"
              >
                <NText :delete="completed">
                  {{ item.title }}
                </NText>
              </NH5>
            </template>
            <template #header-extra>
              <NSpace>
                <n-checkbox
                  :checked="updating ? !completed : completed"
                  :indeterminate="false"
                  :disabled="updating"
                  @update:checked="
                    (checked: boolean) => {
                      const patchedTask: googleTask = {
                        id: item?.id,
                        status: checked ? 'completed' : 'needsAction',
                      }
                      patchHook.mutate({ data: patchedTask, tasklistId: tasklistId! })
                    }
                  "
                ></n-checkbox>
              </NSpace>
            </template>
            <template #description v-if="item.notes">
              {{ item.notes }}
            </template>
            <template #footer v-if="item.due">
              <NPopconfirmWithHook
                :loading="patchHook.isPending.value"
                @positive-click="
                  () => {
                    const patchedTask: googleTask = {
                      id: item?.id,
                      due: deadlineDateModel
                        ? new Date(deadlineDateModel).toISOString()
                        : undefined,
                    }
                    patchHook.mutate({
                      data: patchedTask,
                      tasklistId: tasklistId!,
                    })
                  }
                "
              >
                <template #description>修改截止日期</template>
                <template #trigger>
                  <NTag :bordered="false" @click.stop>
                    <template #icon>
                      <NIcon :size="'medium'">
                        <CalendarOutline />
                      </NIcon>
                    </template>
                    {{ new Date(item.due).toLocaleDateString() }}
                  </NTag>
                </template>
                <template #form>
                  <NDatePicker
                    v-model:value="deadlineDateModel"
                    clearable
                    placeholder="截止日期（留空将清除）"
                  />
                </template>
              </NPopconfirmWithHook>
            </template>
          </n-thing>
        </NCard>
      </NDropdown>
    </NSpin>
  </div>
</template>

<script setup lang="ts">
import {
  useGoogleTasksPatchMutation,
  type googleTask,
} from '@/services-composable/third-party/google-tasks'
import {
  NThing,
  NCheckbox,
  NSpin,
  NCard,
  NTag,
  NSpace,
  NText,
  NH5,
  NIcon,
  NDatePicker,
  NDropdown,
  type DropdownOption,
} from 'naive-ui'
import { CalendarOutline } from '@vicons/ionicons5'
import { computed, ref, watchEffect } from 'vue'
import NPopconfirmWithHook from '@/views/common/NPopconfirmWithHook.vue'

/**
 * !item => do not display
 * item && !status => idiling
 * item && status => status
 */
const props = defineProps<{ item?: googleTask; tasklistId: string }>()

const patchHook = useGoogleTasksPatchMutation()

const updating = computed(() => patchHook.isPending.value)

const completed = computed(() => props.item?.status === 'completed')

const deadlineDateModel = ref<number>()
watchEffect(() => {
  deadlineDateModel.value = props.item?.due ? new Date(props.item?.due).getTime() : undefined
})

const dropdownOptions = [
  {
    key: 'delete',
    label: '删除',
  },
  {
    key: 'goto',
    label: '在Google Tasks中查看',
  },
] as const satisfies DropdownOption[]

type DropdownKey = (typeof dropdownOptions)[number]['key']
const handleDropdownSelect = (key: DropdownKey) => {
  switch (key) {
    case 'delete':
      console.log('To be implemented')
      break
    case 'goto':
      const url = props.item?.webViewLink
      if (url) {
        window.open(url, '_blank')
      } else {
        throw new Error('Assertion Error')
      }
      break
    default:
      throw new Error(`Assertion Error: ${key as never}`)
  }
}
</script>

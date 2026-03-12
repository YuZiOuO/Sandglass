<template>
  <div v-if="item">
    <NSpin :show="updating">
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
              >
              </n-checkbox>
            </NSpace>
          </template>
          <template #description v-if="item.notes">
            {{ item.notes }}
          </template>
          <!-- <template #default> </template> -->
          <template #footer v-if="item.due">
            <NPopconfirmWithHook
              :loading="patchHook.isPending.value"
              @positive-click="
                () => {
                  const patchedTask: googleTask = {
                    id: item?.id,
                    due: deadlineDateModel ? new Date(deadlineDateModel).toISOString() : undefined,
                  }
                  patchHook.mutate({
                    data: patchedTask,
                    tasklistId: tasklistId!,
                  })
                }
              "
            >
              <template #trigger>
                <NTag :bordered="false">
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
</script>

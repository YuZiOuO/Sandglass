<template>
  <div v-if="item">
    <NSpin :show="updating">
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
        <n-thing>
          <template #header>
            {{ item.title }}
          </template>
          <template #header-extra>
            <NButton size="small"> ... </NButton>
          </template>
          <template #description>
            {{ item.notes }}
          </template>
          <template #default>
            {{ item.due ? new Date(item.due).toLocaleDateString() : undefined }}
          </template>
        </n-thing>
      </n-checkbox>
    </NSpin>
  </div>
</template>

<script setup lang="ts">
import {
  useGoogleTasksPatchMutation,
  type googleTask,
} from '@/services-composable/third-party/google-tasks'
import { NThing, NCheckbox, NSpin, NButton } from 'naive-ui'
import { computed } from 'vue'

/**
 * !item => do not display
 * item && !status => idiling
 * item && status => status
 */
const props = defineProps<{ item?: googleTask; tasklistId: string }>()

const patchHook = useGoogleTasksPatchMutation()

const updating = computed(() => patchHook.isPending.value)

const completed = computed(() => props.item?.status === 'completed')
</script>

<script setup lang="ts">
import { NButton, NDatePicker, NPopconfirm } from 'naive-ui'
import dayjs from 'dayjs'
import { FilterCircle, FilterCircleOutline } from '@vicons/ionicons5'

const model = defineModel<[number, number]>('value')

const shortcuts = ():Record<string,() => [number,number]> =>
  ({
    today: () => [dayjs().startOf('day').valueOf(), dayjs().valueOf()],
    withIn7days: () => [dayjs().subtract(7, 'day').startOf('day').valueOf(), dayjs().valueOf()],
    withIn30days: () => [dayjs().subtract(30, 'day').startOf('day').valueOf(), dayjs().valueOf()],
  }) as const

</script>

<template>
  <n-popconfirm
    :positive-text="'今天'"
    @positive-click="model = shortcuts()['today']()"
    :negative-text="'清除'"
    @negative-click="model = undefined"
  >
    <template #trigger>
      <n-button
        circle
        :quaternary="!model"
        :secondary="!!model"
        :type="model ? 'success' : 'default'"
      >
        <template #icon>
          <filter-circle v-if="model" />
          <filter-circle-outline v-else />
        </template>
      </n-button>
    </template>

    <template #icon>
      {{ undefined }}
    </template>
    <n-date-picker
      size="small"
      v-model:value="model"
      type="daterange"
      :shortcuts="shortcuts()"
      :update-value-on-close="true"
    />
  </n-popconfirm>
</template>

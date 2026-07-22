<script setup lang="ts">
import { h, onMounted, ref, watch } from 'vue'
import {
  NAlert,
  NButton,
  NEmpty,
  NList,
  NListItem,
  NPopconfirm,
  NRadioButton,
  NRadioGroup,
  NSpace,
  NSpin,
  NThing,
  useNotification,
} from 'naive-ui'
import type { NotificationReactive } from 'naive-ui'

import type { Mail, MailCapability } from '../../capability/mail'

const { capabilities } = defineProps<{
  capabilities: readonly [MailCapability]
}>()
const capability = capabilities[0]
const mails = ref<readonly Mail[]>([])
const mode = ref<'current' | 'all'>('current')
const loading = ref(false)
const processing = ref(false)
const error = ref('')
const notification = useNotification()

const actions = {
  archive: {
    run: (id: string) => capability.archiveMail(id),
    undo: (id: string) => capability.unarchiveMail(id),
    title: '邮件已归档。',
    failure: '归档邮件失败。',
    undoFailure: '撤销归档失败。',
  },
  unarchive: {
    run: (id: string) => capability.unarchiveMail(id),
    undo: (id: string) => capability.archiveMail(id),
    title: '邮件已取消归档。',
    failure: '取消归档失败。',
    undoFailure: '撤销取消归档失败。',
  },
  trash: {
    run: (id: string) => capability.trashMail(id),
    undo: (id: string) => capability.untrashMail(id),
    title: '邮件已移至回收站。',
    failure: '移动邮件失败。',
    undoFailure: '恢复邮件失败。',
  },
} as const
type Action = keyof typeof actions

async function loadMails() {
  loading.value = true
  error.value = ''

  try {
    mails.value = await (mode.value === 'current'
      ? capability.listMails()
      : capability.listAllMails())
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : '加载邮件失败。'
  } finally {
    loading.value = false
  }
}

async function perform(action: () => Promise<void>, failure: string) {
  processing.value = true
  error.value = ''

  try {
    await action()
    await loadMails()
    return true
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : failure
    return false
  } finally {
    processing.value = false
  }
}

function showUndoNotification(title: string, undo: () => Promise<unknown>) {
  const n: NotificationReactive = notification.success({
    title,
    description: '可在五秒内撤销此操作。',
    action: () =>
      h(
        NButton,
        {
          size: 'small',
          onClick: () => {
            n.destroy()
            void undo()
          },
        },
        { default: () => '撤销' },
      ),
    closable: true,
    duration: 5000,
    keepAliveOnHover: true,
  })
}

async function changeMail(id: string, action: Action) {
  const { run, undo, title, failure, undoFailure } = actions[action]
  if (await perform(() => run(id), failure)) {
    showUndoNotification(title, () => perform(() => undo(id), undoFailure))
  }
}

watch(mode, loadMails)

onMounted(() => {
  void loadMails()
})
</script>

<template>
  <n-space vertical size="large">
    <n-space justify="space-between">
      <n-radio-group v-model:value="mode" name="mail-mode" size="small">
        <n-radio-button value="current">当前</n-radio-button>
        <n-radio-button value="all">全部邮件</n-radio-button>
      </n-radio-group>
      <n-button size="small" :loading="loading" :disabled="processing" @click="loadMails">
        刷新
      </n-button>
    </n-space>
    <n-alert v-if="error" type="error" :title="error" />

    <n-spin :show="loading">
      <n-empty v-if="!loading && !mails.length" description="此队列中没有邮件。" />
      <n-list v-else-if="mails.length" hoverable clickable>
        <n-list-item v-for="item in mails" :key="item.id">
          <n-thing :title="item.title" :description="item.content">
            <template #footer>
              <n-space size="small">
                <n-button
                  v-if="!item.archived"
                  size="small"
                  :disabled="processing"
                  @click="changeMail(item.id, 'archive')"
                >
                  归档
                </n-button>
                <n-button
                  v-else
                  size="small"
                  :disabled="processing"
                  @click="changeMail(item.id, 'unarchive')"
                >
                  取消归档
                </n-button>
                <n-popconfirm @positive-click="changeMail(item.id, 'trash')">
                  <template #trigger>
                    <n-button size="small" type="error" secondary :disabled="processing">
                      删除
                    </n-button>
                  </template>
                  将这封邮件移至回收站？
                </n-popconfirm>
              </n-space>
            </template>
          </n-thing>
        </n-list-item>
      </n-list>
    </n-spin>
  </n-space>
</template>

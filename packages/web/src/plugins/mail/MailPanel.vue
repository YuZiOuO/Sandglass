<script setup lang="ts">
import { h, onMounted, ref, watch } from 'vue'
import {
  NAlert,
  NButton,
  NCard,
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
    title: 'Mail archived.',
    failure: 'Failed to archive mail.',
    undoFailure: 'Failed to undo archive.',
  },
  unarchive: {
    run: (id: string) => capability.unarchiveMail(id),
    undo: (id: string) => capability.archiveMail(id),
    title: 'Mail unarchived.',
    failure: 'Failed to unarchive mail.',
    undoFailure: 'Failed to undo unarchive.',
  },
  trash: {
    run: (id: string) => capability.trashMail(id),
    undo: (id: string) => capability.untrashMail(id),
    title: 'Mail moved to trash.',
    failure: 'Failed to trash mail.',
    undoFailure: 'Failed to restore mail.',
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
    error.value = cause instanceof Error ? cause.message : 'Failed to load mail.'
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
    description: 'Undo this change within five seconds.',
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
        { default: () => 'Undo' },
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
  <section>
    <n-card title="Mail">
      <template #header-extra>
        <n-button size="small" :loading="loading" :disabled="processing" @click="loadMails">
          Refresh
        </n-button>
      </template>

      <n-space vertical size="large">
        <n-radio-group v-model:value="mode" name="mail-mode" size="small">
          <n-radio-button value="current">Current</n-radio-button>
          <n-radio-button value="all">All mail</n-radio-button>
        </n-radio-group>
        <n-alert v-if="error" type="error" :title="error" />

        <n-spin :show="loading">
          <n-empty v-if="!loading && !mails.length" description="No mail in this queue." />
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
                      Archive
                    </n-button>
                    <n-button
                      v-else
                      size="small"
                      :disabled="processing"
                      @click="changeMail(item.id, 'unarchive')"
                    >
                      Unarchive
                    </n-button>
                    <n-popconfirm @positive-click="changeMail(item.id, 'trash')">
                      <template #trigger>
                        <n-button size="small" type="error" secondary :disabled="processing">
                          Trash
                        </n-button>
                      </template>
                      Move this mail to trash?
                    </n-popconfirm>
                  </n-space>
                </template>
              </n-thing>
            </n-list-item>
          </n-list>
        </n-spin>
      </n-space>
    </n-card>
  </section>
</template>

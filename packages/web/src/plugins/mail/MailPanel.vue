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

import type { MailCapability } from '../../capability/mail'
import type { Capability } from '../../core/capability'

type Mail = Awaited<ReturnType<MailCapability['listMails']>>[number]

const { capabilities } = defineProps<{
  capabilities: readonly Capability[]
}>()
const mail = capabilities.find(
  (capability): capability is MailCapability => 'listMails' in capability,
)
const mails = ref<readonly Mail[]>([])
const mode = ref<'current' | 'all'>('current')
const loading = ref(false)
const processing = ref(false)
const error = ref('')
const notification = useNotification()

async function loadMails() {
  if (!mail) {
    return
  }

  loading.value = true
  error.value = ''

  try {
    mails.value = await (mode.value === 'current' ? mail.listMails() : mail.listAllMails())
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Failed to load mail.'
  } finally {
    loading.value = false
  }
}

async function perform(action: () => Promise<void>, failure: string) {
  if (!mail) {
    return false
  }

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

async function archiveMail(id: string) {
  if (!mail) {
    return
  }

  if (await perform(() => mail.archiveMail(id), 'Failed to archive mail.')) {
    showUndoNotification('Mail archived.', () =>
      perform(() => mail.unarchiveMail(id), 'Failed to undo archive.'),
    )
  }
}

async function unarchiveMail(id: string) {
  if (!mail) {
    return
  }

  if (await perform(() => mail.unarchiveMail(id), 'Failed to unarchive mail.')) {
    showUndoNotification('Mail unarchived.', () =>
      perform(() => mail.archiveMail(id), 'Failed to undo unarchive.'),
    )
  }
}

async function trashMail(id: string) {
  if (!mail) {
    return
  }

  if (await perform(() => mail.trashMail(id), 'Failed to trash mail.')) {
    showUndoNotification('Mail moved to trash.', () =>
      perform(() => mail.untrashMail(id), 'Failed to restore mail.'),
    )
  }
}

watch(mode, loadMails)

onMounted(() => {
  void loadMails()
})
</script>

<template>
  <section v-if="mail">
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
                      @click="archiveMail(item.id)"
                    >
                      Archive
                    </n-button>
                    <n-button
                      v-else
                      size="small"
                      :disabled="processing"
                      @click="unarchiveMail(item.id)"
                    >
                      Unarchive
                    </n-button>
                    <n-popconfirm @positive-click="trashMail(item.id)">
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

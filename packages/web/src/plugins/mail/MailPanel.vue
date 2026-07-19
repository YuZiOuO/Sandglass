<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

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
const error = ref('')

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

async function archiveMail(id: string) {
  if (!mail) {
    return
  }

  try {
    await mail.archiveMail(id)
    await loadMails()
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Failed to archive mail.'
  }
}

async function trashMail(id: string) {
  if (!mail) {
    return
  }

  try {
    await mail.trashMail(id)
    await loadMails()
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Failed to trash mail.'
  }
}

watch(mode, loadMails)

onMounted(() => {
  void loadMails()
})
</script>

<template>
  <section v-if="mail">
    <h1>Mail</h1>
    <label>
      View
      <select v-model="mode">
        <option value="current">Current</option>
        <option value="all">All</option>
      </select>
    </label>
    <button type="button" :disabled="loading" @click="loadMails">Refresh</button>
    <p v-if="loading">Loading...</p>
    <p v-if="error">{{ error }}</p>
    <ul v-if="!loading">
      <li v-for="item in mails" :key="item.id">
        <h2>{{ item.title }}</h2>
        <p>{{ item.content }}</p>
        <button type="button" :disabled="loading" @click="archiveMail(item.id)">Archive</button>
        <button type="button" :disabled="loading" @click="trashMail(item.id)">Trash</button>
      </li>
    </ul>
  </section>
</template>

<template>
  <NCollapse v-if="user">
    <NCollapseItem v-for="field in user" :key="field[0]?.toString()" :title="field[0]">
      {{ field[1] }}
    </NCollapseItem>
  </NCollapse>
  <NText v-else>No user login.</NText>
</template>

<script setup lang="ts">
import { useFirebase } from '@/services-composable/firebase'
import type { User } from 'firebase/auth'
import { NCollapse, NCollapseItem, NText } from 'naive-ui'
import { ref } from 'vue'

const user = ref<[string, unknown][]>()

const fbService = useFirebase()

if (fbService.auth.currentUser) {
  user.value = Object.entries(fbService.auth.currentUser as User)
}
</script>

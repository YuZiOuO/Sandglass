<template>
  <NCollapse>
    <NCollapseItem v-for="field in user" :key="field[0]?.toString()" :title="field[0]">
      {{ field[1] }}
    </NCollapseItem>
  </NCollapse>
</template>

<script setup lang="ts">
import { useFirebase } from '@/services-composable/firebase'
import type { User } from 'firebase/auth'
import { NCollapse, NCollapseItem } from 'naive-ui'

const fbService = await useFirebase()
const user = Object.entries(fbService.auth.currentUser as User)
console.log(user)
</script>

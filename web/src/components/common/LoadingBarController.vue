<template><div /></template>

<script setup lang="ts">
import { useLoadingBar } from 'naive-ui'
import { useRouter } from 'vue-router'

const loadingBar = useLoadingBar()
const router = useRouter()

router.beforeEach(() => {
  loadingBar.start()
  return true
})

router.afterEach(() => {
  loadingBar.finish()
  return true
})
</script>

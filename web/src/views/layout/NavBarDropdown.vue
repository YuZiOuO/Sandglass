<template>
  <n-dropdown :disabled="uid === null" :options="dropdownOptions" @select="handleDropdownSelect">
    <n-button v-if="uid !== null" tertiary type="primary"> 我的 </n-button>
    <RouterLink v-else to="/login">
      <n-button tertiary type="primary"> 登录 </n-button>
    </RouterLink>
  </n-dropdown>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { renderIcon } from '@/util'
import { NButton, NDropdown, useMessage, type MessageReactive } from 'naive-ui'
import {
  Pencil as EditIcon,
  LogOutOutline as LogoutIcon,
  PersonCircleOutline as UserIcon,
} from '@vicons/ionicons5'
import { useAuthenticationStore } from '@/stores/authentication'
import { storeToRefs } from 'pinia'

const authStore = useAuthenticationStore()
const { uid } = storeToRefs(authStore)

const message = useMessage()
let logoutMessage: MessageReactive | null = null

async function handleDropdownSelect(key: string) {
  if (key === 'logout') {
    logoutMessage = message.create('正在注销...', { type: 'loading' })
    try {
      await authStore.logout()
      logoutMessage.content = '注销成功'
      logoutMessage.type = 'success'
      logoutMessage.duration = 2
    } catch (e) {
      console.log(e)
      logoutMessage.content = '注销失败,请参阅控制台'
      logoutMessage.type = 'error'
      logoutMessage.duration = 2
      logoutMessage.keepAliveOnHover = true
    }
  }
}

const dropdownOptions = [
  {
    label: '用户资料',
    key: 'profile',
    icon: renderIcon(UserIcon),
    disabled: true,
  },
  {
    label: '编辑用户资料',
    key: 'editProfile',
    icon: renderIcon(EditIcon),
    disabled: true,
  },
  {
    label: '注销',
    key: 'logout',
    icon: renderIcon(LogoutIcon),
  },
]
</script>

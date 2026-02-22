<template>
  <n-dropdown :disabled="!!session.data" :options="dropdownOptions" @select="handleDropdownSelect">
    <n-button v-if="!!session.data" tertiary type="primary"> 我的 </n-button>
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
import { authCli } from '@/services-composable/common'

const session = authCli.useSession()

const message = useMessage()
let logoutMessage: MessageReactive | null = null

async function handleDropdownSelect(key: string) {
  if (key === 'logout') {
    logoutMessage = message.create('正在注销...', { type: 'loading' })
    try {
      await authCli.signOut()
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

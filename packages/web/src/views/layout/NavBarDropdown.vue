<template>
  <div v-if="session.data">
    <n-dropdown :options="dropdownOptions" @select="handleDropdownSelect">
      <n-button text>
        <template #icon>
          <n-icon :component="UserIcon" />
        </template>
        {{ session.data.user.name || '用户' }}
      </n-button>
    </n-dropdown>
  </div>
  <div v-else>
    <RouterLink to="/login">
      <n-button type="primary" ghost>登录</n-button>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { renderIcon } from '@/util'
import { NButton, NDropdown, NIcon, useMessage, type MessageReactive } from 'naive-ui'
import {
  Pencil as EditIcon,
  LockClosedOutline,
  LogOutOutline as LogoutIcon,
  PersonCircleOutline as UserIcon,
} from '@vicons/ionicons5'
import { authCli } from '@/services-composable/common'

const session = authCli.useSession()
const router = useRouter()
const message = useMessage()

let logoutMessage: MessageReactive | null = null

async function handleDropdownSelect(key: string) {
  if (key === 'logout') {
    logoutMessage = message.create('正在注销...', { type: 'loading' })
    try {
      await authCli.signOut()
      if (logoutMessage) {
        logoutMessage.content = '注销成功，跳转到首页...'
        logoutMessage.type = 'success'
      }
      router.push('/')
    } catch (e) {
      console.error(e)
      if (logoutMessage) {
        logoutMessage.content = '注销失败,请参阅控制台'
        logoutMessage.type = 'error'
      }
    }
  } else if (key === 'addPasskey') {
    try {
      await authCli.passkey.addPasskey({
        authenticatorAttachment: 'cross-platform',
      })
      message.success('Passkey 添加请求已发送')
    } catch (e) {
      console.error(e)
      message.error('Passkey 添加失败')
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
    label: '绑定Passkey',
    key: 'addPasskey',
    icon: renderIcon(LockClosedOutline),
  },
  {
    type: 'divider',
    key: 'd1',
  },
  {
    label: '注销',
    key: 'logout',
    icon: renderIcon(LogoutIcon),
  },
]
</script>

<template>
  <n-dropdown :disabled="!isLogined" :options="dropdownOptions" @select="handleDropdownSelect">
    <n-button v-if="isLogined" tertiary type="primary"> 我的 </n-button>
    <RouterLink v-else to="/login">
      <n-button tertiary type="primary"> 登录 </n-button>
    </RouterLink>
  </n-dropdown>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { renderIcon } from '@/util'
import { NButton, NDropdown } from 'naive-ui'
import {
  Pencil as EditIcon,
  LogOutOutline as LogoutIcon,
  PersonCircleOutline as UserIcon,
} from '@vicons/ionicons5'
import { useAuthenticationStore } from '@/stores/authentication'
import pinia from '@/stores'

const authenticationStore = useAuthenticationStore(pinia)
const isLogined = ref<boolean>(false)
onMounted(async () => {
  isLogined.value = await authenticationStore.isLogined()
})

async function handleDropdownSelect(key: string) {
  if (key === 'logout') {
    try {
      await authenticationStore.logout()
    } catch (e) {
      console.log(e)
      throw e
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

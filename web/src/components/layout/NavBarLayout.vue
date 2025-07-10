<template>
  <n-grid :cols="10">
    <n-gi>
      <n-icon>
      </n-icon>
    </n-gi>
    <n-gi :offset="1" :span="6">
      <n-menu :value="null" mode="horizontal" :options="menuOptions" style="width: 100%; height: 100%" />
    </n-gi>
    <n-gi :offset="1">
      <n-flex justify="center" align="center" style="width: 100%; height: 100%">
        <n-dropdown :disabled="!store.loginStatus" :options="dropdownOptions" @select="handleDropdownSelect">
          <n-button v-if="store.loginStatus" tertiary type="primary">
            我的
          </n-button>
          <RouterLink v-else to="/login">
            <n-button tertiary type="primary">
              登录
            </n-button>
          </RouterLink>
        </n-dropdown>
      </n-flex>
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { h } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { renderIcon } from '@/util';
import { NButton, NGrid, NGi, NIcon, NMenu, type MenuOption, NDropdown, NFlex, useMessage } from 'naive-ui';
import {
  Pencil as EditIcon,
  LogOutOutline as LogoutIcon,
  PersonCircleOutline as UserIcon
} from '@vicons/ionicons5'
import { useLoginStatus } from '@/stores/login_status';
import { logout } from '@/api/user_api';

const message = useMessage()
const router = useRouter()
const store = useLoginStatus()

function handleDropdownSelect(key: string) {
  if (key === "logout") {
    logout((res) => {
      if (res === null) {
        message.error("注销失败")
      } else {
        if (res.status === 204) {
          store.reverseLoginStatus()
          router.push('/')
        }
      }
    })
  }
}

const menuOptions: MenuOption[] = [
  {
    label: () => h(RouterLink, { to: { path: '/' } },
      { default: () => '主页' }
    ),
    key: '主页',  // fixme:要有key才能被点击,原因未知
  }, {
    label: () => h(RouterLink, { to: { path: '/proj' } },
      { default: () => '项目' }
    ),
    key: '项目',
  },
]

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
    icon: renderIcon(LogoutIcon)
  }
]
</script>
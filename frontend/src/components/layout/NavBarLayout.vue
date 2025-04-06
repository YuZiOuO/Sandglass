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
        <n-dropdown :disabled="!props.login" :options="dropdownOptions">
          <n-button tertiary type="primary">
            {{ props.login ? "我的" : "登录" }}
          </n-button>
        </n-dropdown>
      </n-flex>
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { NGrid, NGi, NIcon, NMenu, type MenuOption } from 'naive-ui';
import { h } from 'vue';
import { RouterLink } from 'vue-router';
import { renderIcon } from '@/util';
import { NButton, NDropdown, NFlex } from 'naive-ui';
import {
  Pencil as EditIcon,
  LogOutOutline as LogoutIcon,
  PersonCircleOutline as UserIcon
} from '@vicons/ionicons5'

const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            path: '/'
          }
        },
        { default: () => '主页' }
      ),
    key: 'go-back-home',
  }, {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            path: '/proj/new'
          }
        },
        { default: () => '项目列表' }
      ),
    key: 'go-to-work',
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

const props = defineProps({
  login: {
    type: Boolean,
    required: true,
  }
})
</script>
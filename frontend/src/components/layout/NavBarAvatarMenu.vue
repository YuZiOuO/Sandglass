<template>
    <n-dropdown :options="options">
        <n-avatar round src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" bordered />
    </n-dropdown>
</template>

<script lang="ts">
import { renderIcon } from '@/util';
import { NAvatar, NDropdown } from 'naive-ui';
import {
    Pencil as EditIcon,
    LogOutOutline as LogoutIcon,
    PersonCircleOutline as UserIcon
} from '@vicons/ionicons5'

const options = [
    {
        label: '用户资料',
        key: 'profile',
        icon: renderIcon(UserIcon)
    },
    {
        label: '编辑用户资料',
        key: 'editProfile',
        icon: renderIcon(EditIcon)
    },
    {
        label: '退出登录',
        key: 'logout',
        icon: renderIcon(LogoutIcon)
    }
]

export default {
    data() {
        return {
            options
        }
    },
    components: {
        NAvatar,
        NDropdown,
    }
}
</script>

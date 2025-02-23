<template>
    <n-icon size="40px">
        <Sandglass />
    </n-icon>
    <n-menu :value="null" mode="horizontal" :options="menuOptions" />
    <n-flex>
        <NavBarAvatar />
    </n-flex>
</template>

<script lang="ts">
import { NFlex, NIcon, NMenu, type MenuOption } from 'naive-ui';
import Sandglass from '../icons/Sandglass.vue';
import { h } from 'vue';
import { RouterLink } from 'vue-router';
import NavBarAvatar from './NavBarAvatarMenu.vue';
import { renderIcon } from '@/util';

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
                        path: '/proj'
                    }
                },
                { default: () => '项目' }
            ),
        key: 'go-to-work',
    },
    {
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        path: '/login'
                    }
                },
                { default: () => '登录' }
            ),
        key: 'hear-the-wind-sing',
        icon: renderIcon(Sandglass)
    },
]

export default {
    data() {
        return {
            menuOptions
        };
    },
    components: {
        NIcon,
        Sandglass,
        NMenu,
        NavBarAvatar,
        NFlex,
    }
}
</script>

<style scoped></style>
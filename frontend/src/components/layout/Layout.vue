<template>
    <n-layout>
        <n-layout-header bordered class="header">
            <NavBarLayout :login="status" />
        </n-layout-header>
        <n-layout-content class="content">
            <RouterView />
        </n-layout-content>
        <n-layout-footer bordered>
            <FooterLayout />
        </n-layout-footer>
    </n-layout>
</template>

<script setup lang="ts">
import { NLayout, NLayoutHeader, NLayoutFooter, NLayoutContent } from "naive-ui"
import { RouterView } from "vue-router";

import NavBarLayout from "./NavBarLayout.vue";
import FooterLayout from "./FooterLayout.vue";
import { useLoginStatus } from "@/stores/login_status";

const { status } = useLoginStatus()
</script>

<style scoped>
.header {
    display: flex;
    align-items: center;
    padding: 8px;
    line-height: 1.0;
}

.content {
    /* 内容居中 */
    display: flex;
    justify-content: center;

    /* 最多占用整个容器85% */
    max-width: 95%;
    margin: 12px auto;
}
</style>
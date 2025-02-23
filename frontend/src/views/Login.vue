<template>
    <n-flex justify="center">
        <MLogin />
    </n-flex>
</template>

<script lang="ts">
import MLogin from '@/components/module/MLogin.vue';
import { NFlex } from 'naive-ui';

export default {
    components: {
        NFlex,
        MLogin,
    }
}
</script>
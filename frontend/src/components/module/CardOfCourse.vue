<template>
    <div>
        <n-flex size="large">
            <home-page-single-card />
            <home-page-single-card />
        </n-flex>
    </div>
</template>

<script lang="ts">
import { NFlex } from 'naive-ui';
import HomePageSingleCard from './HomePageSingleCard.vue';

export default {
    data() {
    },
    components: {
        NFlex,
        HomePageSingleCard
    }
}
</script>
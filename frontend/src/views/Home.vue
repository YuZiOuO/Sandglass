<template>
    <div>
        <CardOfCourse />
    </div>
</template>

<script lang="ts">
import CardOfCourse from '@/components/module/CardOfCourse.vue';

const string = "Hello";

export default {
    data() {
        return {
            string
        }
    },
    components: {
        CardOfCourse
    }
}
</script>
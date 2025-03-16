<template>
    <MProject :proj="asserted_proj_obj" />
</template>

<script lang="ts" setup>
import type { Project } from '@/api/model/proj_model';
import { get_proj_by_id } from '@/api/proj_api';
import MProject from '@/components/module/MProject.vue';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const proj_id = ref(route.params.proj_id);
const proj_obj = (await get_proj_by_id(proj_id.value as string))?.data;

const asserted_proj_obj = proj_obj as Project
// 如果无法获得obj
</script>
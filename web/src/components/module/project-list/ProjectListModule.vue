<template>
    <n-list hoverable clickable>
        <template #header>
            项目列表
        </template>
        <n-list-item v-for="p in props.projs" :key="p.id">
            <n-thing :title="p.name" content-style="margin-top: 10px;">
                <template #description>
                    <n-space size="small" style="margin-top: 4px">
                        <n-tag :bordered="false" type="success" size="small">
                            <template #icon>
                                #
                            </template>
                            {{ p.id }}
                        </n-tag>
                        <n-tag v-for="t in p.tags" :key="t" :bordered="false" type="info" size="small">
                            {{ t }}
                        </n-tag>
                    </n-space>
                </template>
                <template #header-extra>
                    <n-button @click="() => handleClick(p.id)">
                        进入
                    </n-button>
                </template>
                {{ p.description }}
            </n-thing>
        </n-list-item>
    </n-list>
</template>

<script setup lang="ts">
import type { Project } from '@/api/model/proj';
import router from '@/router';
import { NList, NListItem, NSpace, NTag, NThing, NButton } from 'naive-ui';
import type { PropType } from 'vue';

const props = defineProps({
    projs: {
        type: Object as PropType<Project[]>,
        required: true
    }
})

function handleClick(id: string) {
    const p = router.push({ name: 'Project#', params: { proj_id: id } })
    console.log(p)
}
</script>
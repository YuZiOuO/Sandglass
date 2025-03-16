<template>
    <n-layout has-sider>
        <n-layout-sider>
            <n-scrollbar style="max-height: 100%">
                <n-timeline>
                    <n-timeline-item v-for="t in proj.tasks" :key="t.UUID" type="success" :title="t.taskName"
                        :content="t.description" :time="t.deadline" />
                    <!-- TODO:sidebar的行为:高度与右边内容对齐，如果长度高于右边，则加载滚动条 -->
                    <!-- TODO:根据task的状态改变左边圆圈和线段的样式-->
                </n-timeline>
            </n-scrollbar>
        </n-layout-sider>
        <n-layout-content>
            <n-page-header :subtitle="'#' + proj.ID">
                <template #header>
                    <n-breadcrumb>
                        <n-breadcrumb-item>项目</n-breadcrumb-item>
                        <n-breadcrumb-item>详情</n-breadcrumb-item>
                        <n-breadcrumb-item>TODO:不知道这里放啥</n-breadcrumb-item>
                    </n-breadcrumb>
                </template>
                <template #avatar>
                    <n-avatar :src="proj.avatarUrl" />
                </template>
                <template #title>
                    <n-text>{{ proj.projName }}</n-text>
                </template>
                <template #extra>
                    <n-space>
                        <n-button>更改</n-button>
                        <n-dropdown :options="options" placement="bottom-start">
                            <n-button :bordered="false" style="padding: 0 4px">
                                ···
                            </n-button>
                        </n-dropdown>
                    </n-space>
                </template>
                <n-text>
                    {{ proj.description }}
                </n-text>
                <n-hr />
                <n-grid :cols="5">
                    <n-gi>
                        <n-statistic label="截止于" :value="proj.endTimestamp" />
                    </n-gi>
                    <n-gi>
                        <n-statistic label="开始于" :value="proj.startTimestamp" />
                    </n-gi>
                    <n-gi>
                        <n-statistic label="剩余的 Assignment" value="36" />
                    </n-gi>
                    <n-gi>
                        <n-statistic label="剩余的 Proj" value="83" />
                    </n-gi>
                    <n-gi>
                        <n-statistic label="剩余的 ..." value="2,346" />
                    </n-gi>
                </n-grid>
                <n-hr />
                <template #footer>
                    <!-- TODO:footer,也不知道放啥，可以不放。 -->
                </template>
            </n-page-header>
            <n-card bordered>
                <n-calendar>
                    <!-- TODO: 日历的内容,和task对接 -->
                </n-calendar>
            </n-card>
        </n-layout-content>
    </n-layout>
</template>

<script setup lang="ts">
import {
    NAvatar, NBreadcrumb, NBreadcrumbItem,
    NButton, NCalendar, NCard, NDropdown, NGi, NGrid,
    NHr, NLayout, NLayoutContent, NLayoutSider, NPageHeader,
    NScrollbar, NSpace, NStatistic, NText, NTimeline, NTimelineItem
} from 'naive-ui';
import type { Project } from '@/api/model/proj_model';
import { ref, type PropType } from 'vue';
defineProps({
    proj: {
        type: Object as PropType<Project>,
        default: () => null
    }
})
const options = ref([
    {
        label: '催更',
        key: '1'
    },
    {
        label: '催更',
        key: '2'
    },
    {
        label: '催更',
        key: '3'
    }
])
</script>

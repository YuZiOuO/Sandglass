<template>
    <n-layout has-sider>
        <n-layout-sider>
            <n-scrollbar style="max-height: 100%">
                <n-timeline>
                    <n-timeline-item v-for="t in mergedData?.tasks" :key="t.UUID" type="success" :title="t.taskName"
                        :content="t.description" :time="t.deadline" />
                    <!-- TODO:sidebar的行为:高度与右边内容对齐，如果长度高于右边，则加载滚动条 -->
                    <!-- TODO:根据task的状态改变左边圆圈和线段的样式-->
                </n-timeline>
            </n-scrollbar>
        </n-layout-sider>
        <n-layout-content>
            <n-page-header :subtitle="'#' + mergedData.UUID">
                <template #header>
                    <n-breadcrumb>
                        <n-breadcrumb-item>项目</n-breadcrumb-item>
                        <n-breadcrumb-item>详情</n-breadcrumb-item>
                        <n-breadcrumb-item>TODO:不知道这里放啥</n-breadcrumb-item>
                    </n-breadcrumb>
                </template>
                <template #avatar>
                    <n-avatar :src="mergedData.avatarUrl" />
                </template>
                <template #title>
                    <n-text>{{ mergedData.projName }}</n-text>
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
                    {{ mergedData.description }}
                </n-text>
                <n-hr />
                <n-grid :cols="5">
                    <n-gi>
                        <n-statistic label="截止于" :value="mergedData.endTimestamp" />
                    </n-gi>
                    <n-gi>
                        <n-statistic label="开始于" :value="mergedData.startTimestamp" />
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

<script lang="ts">
import type { Project, Task } from '@/api/model';
import { getProjInfo } from '@/api/proj';
import { NAvatar, NBreadcrumb, NBreadcrumbItem, NButton, NCalendar, NCard, NDropdown, NGi, NGrid, NHr, NLayout, NLayoutContent, NLayoutSider, NPageHeader, NScrollbar, NSpace, NStatistic, NText, NTimeline, NTimelineItem } from 'naive-ui';


export default {
    data() {
        return {
            apiData: null as Project | null,
            options: [
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
            ]
        }
    },
    async mounted() {
        this.apiData = await getProjInfo()
    },
    computed: {
        mergedData() {
            return { ...this.$props, ...this.apiData }; //挂载时从api拿到的数据将覆盖props
        }
    },
    props: {
        projName: String,
        UUID: String,
        status: String,
        avatarUrl: String,
        description: String,
        startTimestamp: String,
        endTimestamp: String,
        Tasks: Array<Task>,
    },
    components: {
        NLayout,
        NPageHeader,
        NGi,
        NGrid,
        NAvatar,
        NBreadcrumb,
        NStatistic,
        NBreadcrumbItem,
        NSpace,
        NButton,
        NDropdown,
        NTimeline,
        NTimelineItem,
        NLayoutSider,
        NLayoutContent,
        NCalendar,
        NCard,
        NScrollbar,
        NText,
        NHr,
    }
}
</script>
<style></style>

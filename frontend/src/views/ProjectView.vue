<template>
  <ProjectDetailModule :proj="proj" />
</template>

<script lang="ts" setup>
import ProjectDetailModule from '@/components/module/project-page/ProjectDetailModule.vue';

//TODO: fetch proj obj from api

const proj = {
  id: "1",
  name: "示例项目",
  url: "https://example.com",
  description: "这是一个测试项目",
  start_timestamp: 1672531200,
  end_timestamp: 1675219600,
  tasks: [
    {
      id: "task1",
      name: "任务1",
      end_timestamp: 1672617600,
      finished: false,
      url: null,
      attachment: null,
      start_timestamp: 1672531200,
      description: "任务1描述",
    },
    {
      id: "task2",
      name: "任务2",
      end_timestamp: 1672704000,
      finished: true,
      url: "https://example.com/task2",
      attachment: null,
      start_timestamp: 1672617600,
      description: "任务2描述",
    },
    {
      id: "task3",
      name: "任务3",
      end_timestamp: 1672790400,
      finished: false,
      url: null,
      attachment: null,
      start_timestamp: 1672704000,
      description: "任务3描述",
    },
    {
      id: "task4",
      name: "任务4",
      end_timestamp: 1672876800,
      finished: true,
      url: "https://example.com/task4",
      attachment: null,
      start_timestamp: 1672790400,
      description: "任务4描述",
    },
    {
      id: "task5",
      name: "任务5",
      end_timestamp: 1672963200,
      finished: false,
      url: null,
      attachment: null,
      start_timestamp: 1672876800,
      description: "任务5描述",
    },
  ],
  nodes: [
    {
      id: "node1",
      name: "节点1",
      timestamp: Date.now() - 86400000 * 4,
      finished: false,
      description: "节点1描述",
      url: null,
    },
    {
      id: "node2",
      name: "节点2",
      timestamp: Date.now() - 86400000 * 3,
      finished: false,
      description: "未完成的过期节点",
      url: "https://example.com/node2",
    },
    {
      id: "node3",
      name: "节点3",
      timestamp: Date.now() + 86400000 * 40,
      finished: false,
      description: "未完成的很远节点",
      url: null,
    },
    {
      id: "node4",
      name: "节点4",
      timestamp: Date.now() + 86400000 * 15,
      finished: false,
      description: "未完成的远节点",
      url: "https://example.com/node4",
    },
    {
      id: "node5",
      name: "节点5",
      timestamp: Date.now() + 86400000 * 0.5,
      finished: false,
      description: "未完成的邻近节点",
      url: null,
    },
  ],
  attachments: [
    {
      id: "attachment1",
      name: "附件1",
      url: "https://example.com/attachment1",
    },
    {
      id: "attachment2",
      name: "附件2",
      url: "https://example.com/attachment2",
    },
    {
      id: "attachment3",
      name: "附件3",
      url: "https://example.com/attachment3",
    },
    {
      id: "attachment4",
      name: "附件4",
      url: "https://example.com/attachment4",
    },
    {
      id: "attachment5",
      name: "附件5",
      url: "https://example.com/attachment5",
    },
  ],
};


</script>

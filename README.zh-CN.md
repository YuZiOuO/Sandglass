# Sandglass

[![CI](https://github.com/YuZiOuO/Sandglass/actions/workflows/ci.yml/badge.svg)](https://github.com/YuZiOuO/Sandglass/actions/workflows/ci.yml)

Sandglass 是一个可编程的个人工作台，用于组织日常工作中使用的工具、外部服务和个人数据，形成适合自己的工作流。已有插件可以组合使用；当现有功能不够贴合需求时，开发者也可以编写新的插件。

当前应用提供了一个示例：以项目的形式管理课程学习，将考勤与日历、任务列表、代码仓库及外部服务集成在一起。

[在线演示](https://sandglass.p1xel.ink)

[English](./README.md)

## 概述

插件是 Sandglass 增加功能的主要方式。每个插件可以包含：

- 用户界面；
- 状态和业务逻辑；
- 对外部服务的操作；
- 面向特定领域的视图。

工作台布局可以调整：插件可以添加、移除、排序和缩放，布局也会被保存。

目前插件以 Vue 和 TypeScript 源码模块实现。

## 架构

Sandglass 的架构围绕三类核心接口展开：

- **Plugin** 提供特定业务场景所需的界面、状态和业务逻辑。
- **Capability** 描述插件可以使用的服务，不绑定具体的服务提供方。
- **Connection** 负责外部服务的授权与访问，并提供该连接可用的 capability。

插件依赖 capability，而不是依赖具体的 connection 实现。这样可以将业务逻辑与外部 API 细节分离，并让不同连接复用相同的 capability 接口。

## 当前示例

- 支持签到、暂停、签退和历史记录的考勤功能。
- 可以绑定仓库、日历和任务列表的项目管理。
- Google 邮件、日历和任务集成。
- GitHub 仓库动态和仓库选择。

这个插件模型也可以用于组织其他类型的工作流，或构建面向特定领域的应用。

## 开发

开发环境需要 Bun，以及 API 所需的环境配置。请先安装依赖，再分别在不同终端中启动 API 和前端开发服务器。

```sh
bun install
bun run --filter @sandglass/api dev
bun run --filter @sandglass/web dev
```

前端位于 `packages/web`。API 位于 `packages/api`，运行在 Cloudflare Workers 上，并通过 Wrangler 进行开发和部署。启动前请配置两个软件包所需的环境变量，以及 API 声明的 Cloudflare bindings。

常用检查：

```sh
bun run --filter @sandglass/web check
bun run --filter @sandglass/api check
```

## 许可证

GPL-3.0 License

# ⏳ Sandglass (沙漏)

> Time flows, wisdom unfolds.

[![](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/YuZiOuO/sandglass/actions)
[![](https://img.shields.io/badge/license-GPL3.0-blue)](https://github.com/YuZiOuO/sandglass/blob/main/LICENSE)
[![](https://img.shields.io/badge/PRs-welcome-orange)](https://github.com/YuZiOuO/sandglass/pulls)
[![Status](https://img.shields.io/badge/Status-Alpha-yellow)]()

> 🚧 **注意**: 本项目目前处于**早期开发阶段**。功能可能会快速迭代变化。

[English](./README.md) | **中文**

---

## 📖 简介

**Sandglass** 是一款为学生量身定制的**一站式效率工具**。

[**💻 在线演示 (Live Demo)**](https://sandglass.kanata.ink)

我们将每一门课程视为一个 **项目 (Project)**。Sandglass 提供统一的看板，助你集中管理课程的截止日期、日程、笔记和代码仓库。

## ✨ 主要功能

### 1. ⏱️ 考勤与记录
*   **打卡机制:** 采用类似上班打卡的模式 (开始/暂停/结束)，如实记录投入时间。
*   **投入热力图:** 生成类似 GitHub 的贡献图，直观量化学习努力程度。

### 2. 📅 双向同步
*   **Google 生态互通:** 与 Google 日历和 Google 任务完全双向同步。在任意一端修改，数据实时更新。
*   **统一视图:** 以时间轴和日历形式展示课程表、考试安排与作业截止日期。

### 3. 💻 代码追踪
*   **仓库关联:** 将 Github 仓库直接绑定至课程项目。
*   **提交可视化:** 在看板中直接查看代码提交记录与活跃度。

### 4. 🗂️ 知识管理
*   **资源聚合:** 集中管理课件 PDF、实验文档与参考链接。
*   **Markdown 笔记:** 随时记录课程重点与灵感。

## 🛠️ 技术栈

*   **前端**: Vue 3, Vite, Naive UI, TanStack Query, ECharts
*   **后端**: Bun, Hono, Better Auth, Zod
*   **数据库**: PostgreSQL, Prisma
*   **集成**: Google API, GitHub API

## 🚀 快速上手 (开发)

1.  **克隆**: `git clone https://github.com/YuZiOuO/sandglass.git`
2.  **安装**: `bun install` (或 pnpm)
3.  **配置**: 在 `packages/api` 和 `packages/web` 配置 `.env`。
4.  **迁移**: `cd packages/schema && bunx prisma db push`
5.  **运行**:
    *   后端: `cd packages/api && bun run dev`
    *   前端: `cd packages/web && bun run dev`

## 🤝 贡献代码

欢迎提交 PR！

## 📄 许可证

GPL-3.0 License

# ⏳ Sandglass (沙漏)

> Time flows, wisdom unfolds.

[![](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/YuZiOuO/sandglass/actions)
[![](https://img.shields.io/badge/license-GPL3.0-blue)](https://github.com/YuZiOuO/sandglass/blob/main/LICENSE)
[![](https://img.shields.io/badge/PRs-welcome-orange)](https://github.com/YuZiOuO/sandglass/pulls)

**Sandglass** 是一款为学生量身定制的**一站式效率工具**。

---

## 💡 核心理念：课程即项目

我们将每一门课程视为一个 **Project**。Sandglass 旨在提供一个统一的看板，让你能够集中管理一门课的**所有学习事务**，包括截止日期、课程安排、笔记和代码仓库。

---

## ✨ 主要功能

Sandglass 为你的每个“课程项目”提供以下核心功能：

* **📅 任务与日程集成 (Google Tasks/Calendar):**
    * **任务时间线 (Timeline):** 基于 Google Tasks，以时间轴形式清晰罗列课程相关所有任务（待办/已完成），支持快速添加和标记完成。
    * **集成日历 (Calendar):** 基于 Google Calendar，清晰展示所有课程安排和任务截止日期 (DDL)，支持添加周期性事件。

* **📝 课程笔记与资料管理:**
    * 你可以为每节课添加 Markdown 笔记，并关联课件 PDF、实验指导书等相关附件。

* **🔥 学习投入可视化:**
    * **效率热力图:** 直观展示你在这门课上的时间投入。
    * **代码提交热力图 (GitHub):** 关联课程代码仓库，以热力图形式展示代码提交活跃度。

## 🛠️ 技术栈与依赖

Sandglass 的核心功能**依赖**以下 API：

  * **Google API (Calendar & Tasks):** 负责所有日程和任务管理。
  * **GitHub API:** 用于获取代码仓库的提交数据。
  * **Vue+NaiveUI**: 用于构建前端页面
  * **NestJS+Firebase**: 用于构建后端服务
  * **MongoDB**: 数据库

## 📸 应用截图 (待补充)

## 🚀 快速上手 (开发)

**本地开发运行：**

1.  **克隆仓库:**
    ```sh
    git clone [https://github.com/YuZiOuO/sandglass.git](https://github.com/YuZiOuO/sandglass.git)
    cd sandglass
    ```
2.  **安装依赖:**
    ```sh
    pnpm install
    ```
3.  **配置环境变量:**
    往前后端分别注入环境变量（待补充）
    
5.  **运行应用:**
    运行脚本位于各个子包的package.json中

## 🤝 贡献代码

欢迎任何人以各种形式参与贡献！

## 📄 许可证

详情请见 `LICENSE` 文件。

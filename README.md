# ⏳ Sandglass (沙漏)

> Time flows, wisdom unfolds.

[![](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/YuZiOuO/sandglass/actions)
[![](https://img.shields.io/badge/license-GPL3.0-blue)](https://github.com/YuZiOuO/sandglass/blob/main/LICENSE)
[![](https://img.shields.io/badge/PRs-welcome-orange)](https://github.com/YuZiOuO/sandglass/pulls)
[![Status](https://img.shields.io/badge/Status-Alpha-yellow)]()

> 🚧 **Note**: This project is currently in **early development**. Features may change rapidly.

**English** | [中文](./README.zh-CN.md)

---

## 📖 Introduction

**Sandglass** is a one-stop productivity tool tailored for students.

[**💻 Live Demo**](https://sandglass.kanata.ink)

Treat every course as a **Project**. Sandglass provides a unified dashboard to manage everything about a course: deadlines, schedules, notes, and code repositories.

## ✨ Features

### 1. ⏱️ Attendance & Tracking
*   **Check-in System:** Track time spent on courses with a "Clock-in/Clock-out" mechanism.
*   **Heatmap:** Visualize your effort with GitHub-style contribution graphs.

### 2. 📅 Two-way Sync
*   **Google Ecosystem:** Full bidirectional synchronization with Google Calendar and Google Tasks.
*   **Unified View:** Manage course schedules, exams, and deadlines in one timeline.

### 3. 💻 Code & Development
*   **GitHub Integration:** Link course repositories directly to your project.
*   **Commit Visualization:** Track code activity and growth within the course dashboard.

### 4. 🗂️ Knowledge Management
*   **Resources:** Centralize slides, PDFs, and reference links.
*   **Notes:** Built-in Markdown support for course notes.

## 🛠️ Tech Stack

*   **Frontend**: Vue 3, Vite, Naive UI, TanStack Query, ECharts
*   **Backend**: Bun, Hono, Better Auth, Zod
*   **Database**: PostgreSQL, Prisma
*   **Integrations**: Google API, GitHub API

## 🚀 Quick Start

1.  **Clone**: `git clone https://github.com/YuZiOuO/sandglass.git`
2.  **Install**: `bun install`
3.  **Env**: Configure `.env` in `packages/api` and `packages/web`.
4.  **Migrate**: `cd packages/schema && bunx prisma db push`
5.  **Run**:
    *   API: `cd packages/api && bun run dev`
    *   Web: `cd packages/web && bun run dev`

## 🤝 Contribution

PRs are welcome!

## 📄 License

GPL-3.0 License

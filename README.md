# Sandglass

[![CI](https://github.com/YuZiOuO/Sandglass/actions/workflows/ci.yml/badge.svg)](https://github.com/YuZiOuO/Sandglass/actions/workflows/ci.yml)

Sandglass is a programmable personal workbench for organizing the tools, external services, and personal data used in day-to-day work. Existing plugins can be combined to support different workflows, while developers can write new plugins when more tailored behavior is needed.

The current application includes one example: managing coursework as projects, with attendance tracking, calendars, task lists, repositories, and external service integrations brought together in one workflow.

[Live Demo](https://sandglass.p1xel.ink)

[中文](./README.zh-CN.md)

## Overview

Plugins are the main way to add features to Sandglass. A plugin can provide:

- a user interface;
- state and business logic;
- operations over external services;
- a domain-specific view.

The dashboard layout can be customized: plugins can be added, removed, reordered, resized, and saved as part of the workspace layout.

Plugins are currently implemented as Vue and TypeScript source modules.

## Architecture

Sandglass is built around three core interfaces:

- **Plugin** provides a view together with the state and business logic for a specific use case.
- **Capability** describes a service that a plugin can use without depending on a specific provider.
- **Connection** manages authentication and access to an external provider, and supplies the capabilities available through that connection.

Plugins depend on capabilities rather than on provider-specific connections. This keeps business logic separate from external API details and allows the same capability interface to be reused by different connections.

## Current Examples

- Attendance tracking with check-in, pause, check-out, and history.
- Project management with bindings to repositories, calendars, and task lists.
- Gmail, Google Calendar, and Google Tasks integrations.
- GitHub repository activity and repository selection.

The same plugin model can also support other workflows and domain-specific applications.

## Development

Prerequisites: Bun and the environment configuration required by the API. Install the dependencies first, then run the API and web development servers in separate terminals.

```sh
bun install
bun run --filter @sandglass/api dev
bun run --filter @sandglass/web dev
```

The web application lives in `packages/web`. The API in `packages/api` runs on Cloudflare Workers and is developed and deployed with Wrangler. Configure the required environment variables for both packages and the Cloudflare bindings declared for the API before starting the applications.

Useful checks:

```sh
bun run --filter @sandglass/web check
bun run --filter @sandglass/api check
```

## License

GPL-3.0 License

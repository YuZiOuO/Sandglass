# Monorepo Agent Instructions
(Bun + Prisma + Hono + better-auth + Vue + Naive UI + TanStack Query)

You are an engineering agent working in an MVP-stage monorepo project.

The runtime is **Bun**.

The repository structure:

- packages/
  - schema
  - api
  - web

Your job is to implement changes in a way that is:
- Minimal
- Safe
- Consistent with existing patterns
- Low complexity
- No redesign

---

# 0) MVP Minimal-Change Doctrine (HIGHEST PRIORITY)

This project is in MVP stage.

You MUST prioritize:

1. Smallest possible diff.
2. Only change what is necessary.
3. Do NOT redesign architecture.
4. Do NOT introduce new abstractions unless strictly required.
5. Avoid adding new layers, factories, wrappers, or global systems.
6. Do NOT refactor unrelated code.
7. Keep changes local to the smallest scope possible.
8. Prefer copying the nearest existing implementation pattern.
9. If you think a refactor would be beneficial, DO NOT perform it. Leave a short comment suggesting it instead.

This rule overrides all others.

---

# 1) Repository Architecture

## packages/schema

Responsibilities:
- Owns Prisma schema and migrations.
- Generates Prisma client for api.
- Generates Zod models that may be used by api (and optionally web).

Rules:
- Prisma schema is the single source of truth for DB structure.
- If schema changes:
  - Update Prisma schema.
  - Respect Bun-based generation scripts.
  - Ensure Prisma client works in api.
  - Keep Zod models aligned.

Do not introduce new schema abstractions unless required.

---

## packages/api (Hono + better-auth)

Responsibilities:
- Hono-based API.
- Integrated with better-auth.
- Exposes two CLIs to web:
  - One for normal API calls.
  - One for authentication flows (including OAuth).

Important:
- Endpoints are NOT REST.
- Do NOT convert to REST style.
- Follow existing endpoint grouping and procedure-style patterns.
- Copy nearby endpoint structure when adding new ones.

Validation:
- Use Zod where already used.
- Respect existing input/output typing style.

Auth:
- better-auth is already integrated.
- Do not modify auth flow unless explicitly requested.
- Never log secrets or tokens.

---

## packages/web (Vue + Naive UI + TanStack Query)

Responsibilities:
- Vue frontend.
- UI must use Naive UI.
- Server state managed by TanStack Query.
- service-composable exposes all API hooks.

Rules:
- Do NOT fetch directly in components if a composable hook exists.
- Add new API interactions inside service-composable.
- Keep components lean and declarative.

---

# 2) UI Rules (Strict)

Naive UI is mandatory.

- Use Naive UI components.
- Use Naive UI message/notification system.
- Follow existing UI patterns.
- Do NOT introduce other UI libraries.
- Do NOT introduce new styling systems.

Avoid creative redesign.

---

# 3) TanStack Query Rules

TanStack Query is the single source of truth for server state.

## 3.1 Minimal QueryKey Policy

This project does NOT want large refactors.

You MAY adjust query keys ONLY if:

- There is a bug or collision.
- Invalidation cannot work otherwise.
- You are adding a new hook.

When adjusting keys:

- Only modify keys in files you are already touching.
- Do NOT migrate the whole repo.
- Prefer matching nearby existing key style over inventing a new system.
- Keep keys simple and stable.
- Do not introduce a complex global key factory unless one already exists.

Stability rules:
- Keys must be deterministic.
- No random or unstable objects.
- Prefer simple array structure consistent with existing code.

## 3.2 Hooks

When adding new server interaction:

- Add `useXxxQuery` for reads.
- Add `useXxxMutation` for writes.
- Place them in service-composable.
- Ensure proper invalidation of related queries.
- Keep logic minimal.

Do NOT:
- Duplicate server state in local refs.
- Introduce custom caching layers.

---

# 4) API Response Semantics (MVP Mode)

The project is in MVP stage.

There is NO unified API response wrapper.

Rules:

- Trust TypeScript types as the semantic contract.
- Do not introduce a global `{ data, error }` format.
- Match the existing endpoint's response style.
- Keep return shape aligned with declared TS types.

Do not redesign API format.

---

# 5) Type Safety

- Avoid `any`.
- Prefer inferred types.
- Keep changes type-safe.
- Align API responses with TS definitions.

Do not introduce advanced type systems unless needed.

---

# 6) Auth (Web Side)

- Auth uses cookies.
- Auth client is already configured.
- Do NOT modify cookie/session handling.
- Do NOT introduce token storage.
- Only modify auth behavior if explicitly requested.

---

# 7) Bun Runtime

- Prefer bun commands over node/npm.
- Avoid Node-specific assumptions.
- Respect existing bun scripts.

---

# 8) Schema Change Workflow

If Prisma schema is modified:

1. Update schema.
2. Respect bun-based generation flow.
3. Ensure api compiles.
4. Ensure types still align in web.
5. Do not redesign schema unless required.

---

# 9) Change Reporting Format

When proposing changes:

Provide:

- What was changed (1–3 bullets).
- Why it was necessary.
- Which package(s) were affected.
- Any follow-up steps (bun commands, migration, etc.).

Keep explanation concise.

Avoid long essays.

---

# 10) Over-Engineering Prevention

Do NOT:

- Introduce new architectural patterns.
- Add generic factories.
- Add plugin systems.
- Add dependency injection.
- Add global abstraction layers.
- “Future-proof” the system.
- Perform cleanup refactors unless explicitly requested.

This is MVP. Simplicity over elegance.

---

# Core Principle

Solve the exact problem.
Use the simplest correct solution.
Change as little code as possible.
Follow existing patterns.
Do not redesign.

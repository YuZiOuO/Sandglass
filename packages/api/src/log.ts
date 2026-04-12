import { AsyncLocalStorage } from "node:async_hooks";
import { Console } from "node:console";
import type { LogScope, RequestTraceContext } from "@sandglass/shared";
import { LOG_SERVICES } from "@sandglass/shared";

type LogLevel = "debug" | "info" | "warn" | "error";
type LogFields = Record<string, unknown> & {
  err?: unknown;
};

const requestContextStorage = new AsyncLocalStorage<RequestTraceContext>();
const runtimeEnv = process.env.NODE_ENV;
const isProduction = runtimeEnv === "production";
const ANSI_RESET = "\x1b[0m";
const LEVEL_COLORS = {
  debug: "#0055ff",
  info: "#16d33c",
  warn: "#ffff00",
  error: "#ff0000",
} as const;
const prettyConsole = new Console({
  stdout: process.stdout,
  stderr: process.stderr,
  inspectOptions: { colors: true, depth: 5, compact: false },
});
const WRITERS = {
  debug: prettyConsole.debug.bind(prettyConsole),
  info: prettyConsole.info.bind(prettyConsole),
  warn: prettyConsole.warn.bind(prettyConsole),
  error: prettyConsole.error.bind(prettyConsole),
} as const;

const compact = (value: Record<string, unknown>) => {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined && entry !== null && entry !== ""),
  );
};

const serializeError = (err: unknown) => {
  if (err instanceof Error) {
    return compact({
      name: err.name,
      message: err.message,
      stack: err.stack,
    });
  }

  return { value: String(err) };
};

const paint = (text: string, color: string) => {
  const ansi = Bun.color(color, "ansi");
  return ansi ? `${ansi}${text}${ANSI_RESET}` : text;
};

const formatPrettyLine = (payload: Record<string, unknown>) => {
  const level = String(payload.level ?? "info") as LogLevel;

  return [
    paint(String(payload.timestamp ?? "").slice(11, 19), "#6b7280"),
    paint(level.toUpperCase().padEnd(5, " "), LEVEL_COLORS[level]),
    payload.scope && paint(`[${String(payload.scope)}]`, "#94a3b8"),
    String(payload.message ?? ""),
    payload.status && `status=${payload.status}`,
    payload.durationMs && `dur=${payload.durationMs}ms`,
    payload.method && String(payload.method),
    payload.path && String(payload.path),
    payload.requestId && `req=${payload.requestId}`,
    payload.userId && `user=${payload.userId}`,
    payload.cfRay && `cf=${payload.cfRay}`,
    payload.target && `target=${payload.target}`,
  ]
    .filter(Boolean)
    .join(" ");
};

const pickPrettyExtra = (payload: Record<string, unknown>) => {
  return compact({
    detail: payload.detail,
    query: payload.query,
    issue: payload.issue,
    error: payload.error,
  });
};

const writeLog = (level: LogLevel, scope: LogScope, message: string, fields: LogFields = {}) => {
  const { err, ...rest } = fields;
  const payload = compact({
    timestamp: new Date().toISOString(),
    level,
    service: LOG_SERVICES.api,
    env: runtimeEnv,
    scope,
    message,
    ...requestContextStorage.getStore(),
    ...rest,
    ...(err ? { error: serializeError(err) } : {}),
  });

  if (!isProduction) {
    const header = formatPrettyLine(payload);
    const extra = pickPrettyExtra(payload);
    if (Object.keys(extra).length) {
      WRITERS[level](header, extra);
      return;
    }
    WRITERS[level](header);
    return;
  }

  WRITERS[level](JSON.stringify(payload));
};

export const withRequestContext = <T>(context: RequestTraceContext, fn: () => T) => {
  return requestContextStorage.run(context, fn);
};

export const updateRequestContext = (patch: Partial<RequestTraceContext>) => {
  const current = requestContextStorage.getStore();
  if (!current) return;
  Object.assign(current, patch);
};

export const createLogger = (scope: LogScope) => ({
  debug: (message: string, fields?: LogFields) => writeLog("debug", scope, message, fields),
  info: (message: string, fields?: LogFields) => writeLog("info", scope, message, fields),
  warn: (message: string, fields?: LogFields) => writeLog("warn", scope, message, fields),
  error: (message: string, fields?: LogFields) => writeLog("error", scope, message, fields),
});

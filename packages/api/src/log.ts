import { AsyncLocalStorage } from "node:async_hooks";
import type { LogScope, RequestTraceContext } from "@sandglass/shared";
import { LOG_SERVICES } from "@sandglass/shared";

type LogLevel = "debug" | "info" | "warn" | "error";

type LogFields = Record<string, unknown> & {
  err?: unknown;
};

const requestContextStorage = new AsyncLocalStorage<RequestTraceContext>();

const compactObject = (value: Record<string, unknown>) => {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined && entry !== null && entry !== ""),
  );
};

const serializeError = (err: unknown) => {
  if (err instanceof Error) {
    return compactObject({
      name: err.name,
      message: err.message,
      stack: err.stack,
    });
  }

  return { value: String(err) };
};

const writeLog = (level: LogLevel, message: string, fields: LogFields = {}) => {
  const { err, ...rest } = fields;
  const payload = compactObject({
    timestamp: new Date().toISOString(),
    level,
    service: LOG_SERVICES.api,
    env: process.env.NODE_ENV ?? "development",
    message,
    ...requestContextStorage.getStore(),
    ...rest,
    error: err ? serializeError(err) : undefined,
  });

  const line = JSON.stringify(payload);
  if (level === "error") {
    console.error(line);
    return;
  }
  if (level === "warn") {
    console.warn(line);
    return;
  }
  console.log(line);
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
  debug: (message: string, fields?: LogFields) => writeLog("debug", message, { scope, ...fields }),
  info: (message: string, fields?: LogFields) => writeLog("info", message, { scope, ...fields }),
  warn: (message: string, fields?: LogFields) => writeLog("warn", message, { scope, ...fields }),
  error: (message: string, fields?: LogFields) => writeLog("error", message, { scope, ...fields }),
});

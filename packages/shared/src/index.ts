export const TRACE_HEADERS = {
  requestId: "x-request-id",
  cfRay: "cf-ray",
} as const;

export const LOG_SERVICES = {
  api: "sandglass-api",
  web: "sandglass-web",
} as const;

export const LOG_SCOPES = {
  api: "api",
  client: "client",
  db: "db",
  env: "env",
  http: "http",
} as const;

export type LogScope = (typeof LOG_SCOPES)[keyof typeof LOG_SCOPES];

export type RequestTraceContext = {
  requestId: string;
  cfRay?: string;
  method?: string;
  path?: string;
  userId?: string;
};

export type ErrorTraceContext = {
  requestId?: string;
  cfRay?: string;
  status?: number;
  statusText?: string;
};

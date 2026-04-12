import type { App } from 'vue'
import * as Sentry from '@sentry/vue'
import type { ErrorTraceContext } from '@sandglass/shared'
import { TRACE_HEADERS } from '@sandglass/shared'

type ErrorWithRequestContext = Error & ErrorTraceContext

const sentryDsn = import.meta.env.SG_WEB_SENTRY_DSN

export function initSentry(app: App<Element>) {
  if (!sentryDsn) return

  Sentry.init({
    app,
    dsn: sentryDsn,
    enabled: true,
    environment: import.meta.env.MODE,
    sendDefaultPii: false,
  })
}

export function captureFrontendError(err: unknown, extras?: Record<string, unknown>) {
  if (!sentryDsn) return

  Sentry.withScope((scope) => {
    scope.setTag('surface', 'web')
    scope.setExtra('pathname', window.location.pathname)

    if (extras) {
      scope.setExtras(extras)
    }

    if (err instanceof Error) {
      const context = err as ErrorWithRequestContext
      if (context.requestId) scope.setTag(TRACE_HEADERS.requestId, context.requestId)
      if (context.cfRay) scope.setTag(TRACE_HEADERS.cfRay, context.cfRay)
      if (context.status) scope.setExtra('http_status', context.status)
      if (context.statusText) scope.setExtra('http_status_text', context.statusText)

      Sentry.captureException(err)
      return
    }

    Sentry.captureMessage(String(err), 'error')
  })
}

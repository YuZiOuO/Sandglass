import { createDiscreteApi } from 'naive-ui'
import type { ErrorTraceContext } from '@sandglass/shared'
import { TRACE_HEADERS } from '@sandglass/shared'
import { captureFrontendError } from '@/sentry'

export type TraceableError = Error & ErrorTraceContext

export const withTraceContext = (
  err: Error,
  headers: Headers,
  status?: number,
  statusText?: string,
) => {
  const error = err as TraceableError
  error.requestId = headers.get(TRACE_HEADERS.requestId) ?? undefined
  error.cfRay = headers.get(TRACE_HEADERS.cfRay) ?? undefined
  error.status = status
  error.statusText = statusText
  return error
}

const UIApi = createDiscreteApi(['notification'])

export const notifyError = (err: unknown) => {
  let error: TraceableError

  if (err instanceof Error) {
    error = err as TraceableError
  } else {
    error = new Error(typeof err === 'string' ? err : 'Unknown error') as TraceableError
    error.name = 'Unexpected Error'
  }

  const description = [error.message]
  if (error.requestId) {
    description.push(`Request ID: ${error.requestId}`)
  }
  if (error.cfRay) {
    description.push(`Ray ID: ${error.cfRay}`)
  }

  UIApi.notification.error({
    title: error.name,
    description: description.join('\n'),
  })

  captureFrontendError(error)
}

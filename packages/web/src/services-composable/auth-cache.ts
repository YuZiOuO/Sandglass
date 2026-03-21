/**
 * [AI 生成]
 * 实现了 `getAccessToken` 的缓存层，用于优化性能并防止冗余的 API 调用。
 * 包含了针对并发请求的去重逻辑。
 */
import { authCli } from './common'

// 自定义类型

/**
 * 显式定义 AccessTokenResult 的原因：
 * Better-auth 的重载函数导致 TS 无法正确推断返回类型，回退为 any。
 * 为确保内部缓存类型安全，需手动定义此结构。
 */
type AccessTokenResult = {
  data: {
    accessToken: string
    accessTokenExpiresAt?: Date
    scopes: string[]
    idToken?: string
    refreshToken?: string
  } | null
  error: {
    status: number | string
    statusText: string
    message?: string
  } | null
}

/**
 * CommonReturn 用于强制类型断言。
 * 原因：TS 无法根据 `options.throw` 推断出匹配重载签名的返回类型，
 * 需使用此类型强制转换，以保证函数整体签名兼容。
 */
type CommonReturn = Awaited<ReturnType<typeof authCli.getAccessToken>>

// 实现

const _tokenCache = new Map<string, NonNullable<AccessTokenResult['data']>>()
const _fetchPromiseCache = new Map<string, Promise<AccessTokenResult>>()
const TOKEN_EXPIRY_BUFFER_MS = 10000 // 过期时间, 防止使用即将失效的Token

export function invalidateAccessToken(providerId: string) {
  _tokenCache.delete(providerId)
}

/**
 * 获取访问令牌的缓存实现
 *
 * 1. **Cache Hit**: 如果内存中有未过期 Token，直接返回。
 * 2. **Deduplication**: 如果已有正在进行的请求，复用该 Promise，避免并发重复请求。
 * 3. **Fetch**: 如果无缓存或已过期，发起新请求，并更新缓存。
 */
export const getCachedAccessToken: typeof authCli.getAccessToken = async (
  ...args: Parameters<typeof authCli.getAccessToken>
) => {
  const [query, options] = args
  const provider = query?.providerId

  // 1. 无 Provider，直接透传（无法缓存）
  if (!provider) {
    return authCli.getAccessToken(...args)
  }

  // 2. 检查缓存
  const cached = _tokenCache.get(provider)
  if (cached) {
    const expiresAt = cached.accessTokenExpiresAt
      ? new Date(cached.accessTokenExpiresAt).getTime()
      : 0
    // 如果未设置过期时间或已过期（考虑缓冲时间），则视为失效
    if (expiresAt > Date.now() + TOKEN_EXPIRY_BUFFER_MS) {
      if (options?.throw) {
        return cached as unknown as CommonReturn
      }
      return { data: cached, error: null } as unknown as CommonReturn
    }
    // 已过期，清理无效缓存
    _tokenCache.delete(provider)
  }

  // 3. 发起请求或复用现有请求
  if (!_fetchPromiseCache.has(provider)) {
    // 强制 throw: false，确保 Promise 总是 Resolve 为统一结构
    // 这样所有复用该 Promise 的调用者都能安全拿到 { data, error }
    const fetchPromise = authCli
      .getAccessToken(query, { ...options, throw: false })
      .then((res) => {
        if (res.data) {
          _tokenCache.set(provider, res.data)
        }
        return res as AccessTokenResult
      })
      .finally(() => {
        _fetchPromiseCache.delete(provider)
      })
    _fetchPromiseCache.set(provider, fetchPromise)
  }

  const result = await _fetchPromiseCache.get(provider)!

  // 4. 根据调用者期望的格式返回结果
  if (options?.throw) {
    if (result.error) throw result.error
    return result.data as unknown as CommonReturn
  }

  return result as unknown as CommonReturn
}

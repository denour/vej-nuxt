import type { NitroFetchRequest } from 'nitropack'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

// Helper to normalize joining base and path without duplicating segments
function joinUrl(base: string, path: string) {
  if (!base) return path
  const b = base.replace(/\/$/, '')
  const p = path.startsWith('/') ? path : `/${path}`
  return `${b}${p}`
}

// Centralized API fetcher
export async function apiFetch<T = any>(path: string, opts: { method?: HttpMethod; body?: any; query?: any; headers?: Record<string, string> } = {}) {
  const config = useRuntimeConfig()
  // apiBase could be either host or host+version, keep path agnostic
  const base = config.public.apiBase

  const url = joinUrl(base, path)

  try {
    return await $fetch<T>(url as unknown as NitroFetchRequest, {
      method: opts.method || 'GET',
      body: opts.body,
      query: opts.query,
      headers: opts.headers,
      // Credentials could be added if needed
    })
  } catch (e: any) {
    // Normalize errors
    const statusCode = e?.response?.status || e?.statusCode || 500
    const message = e?.data?.message || e?.message || 'Error en la solicitud'
    throw createError({ statusCode, statusMessage: message })
  }
}

export function withTTL<T>(
  current: T | null | undefined,
  lastFetchedAt: number | null,
  ttlMs: number
) {
  const now = Date.now()
  if (!current) return false
  if (!lastFetchedAt) return false
  return now - lastFetchedAt < ttlMs
}

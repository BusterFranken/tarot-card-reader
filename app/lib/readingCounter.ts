import { Redis } from '@upstash/redis'

// Upstash via the Vercel Marketplace sets KV_REST_API_*; a direct Upstash setup uses UPSTASH_REDIS_REST_*.
const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN

export const redis = url && token ? new Redis({ url, token }) : null

const TOTAL_KEY = 'readings:total'
const dayKey = (date: string) => `readings:day:${date}`

/** Counts one completed reading. Never throws: analytics must not break a reading. */
export async function recordReading(): Promise<void> {
  if (!redis) return
  try {
    const today = new Date().toISOString().slice(0, 10)
    await redis.pipeline().incr(TOTAL_KEY).incr(dayKey(today)).exec()
  } catch (error) {
    console.error('Failed to record reading:', error)
  }
}

/** Total readings plus per-day counts for the last `days` days (UTC). */
export async function getReadingStats(days = 30) {
  if (!redis) return null
  const dates = Array.from({ length: days }, (_, i) => {
    const d = new Date()
    d.setUTCDate(d.getUTCDate() - i)
    return d.toISOString().slice(0, 10)
  })
  const [total, ...counts] = await redis.mget<(number | null)[]>(TOTAL_KEY, ...dates.map(dayKey))
  return {
    total: total ?? 0,
    daily: dates.map((date, i) => ({ date, readings: counts[i] ?? 0 })),
  }
}

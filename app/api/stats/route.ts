import { NextRequest, NextResponse } from 'next/server'
import { getReadingStats } from '../../lib/readingCounter'

export const dynamic = 'force-dynamic'

// GET /api/stats with header "Authorization: Bearer <STATS_TOKEN>"
export async function GET(request: NextRequest) {
  const expected = process.env.STATS_TOKEN
  if (!expected || request.headers.get('authorization') !== `Bearer ${expected}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const daysParam = Number(request.nextUrl.searchParams.get('days') ?? 30)
  const days = Number.isFinite(daysParam) ? Math.min(Math.max(Math.floor(daysParam), 1), 365) : 30

  try {
    const stats = await getReadingStats(days)
    if (!stats) {
      return NextResponse.json({ error: 'Reading counter storage is not configured' }, { status: 503 })
    }
    return NextResponse.json(stats)
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to load stats', details: error.message }, { status: 500 })
  }
}

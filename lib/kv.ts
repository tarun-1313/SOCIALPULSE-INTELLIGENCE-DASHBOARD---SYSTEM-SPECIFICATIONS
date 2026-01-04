import { Redis } from "@upstash/redis"

export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

export async function incrementPageView() {
  try {
    const today = new Date().toISOString().split("T")[0]
    await redis.incr(`page_views:${today}`)
    await redis.expire(`page_views:${today}`, 60 * 60 * 24 * 7) // Keep for 7 days
  } catch (error) {
    console.error("[v0] Error updating Upstash KV:", error)
  }
}

export async function getDailyViews() {
  try {
    const today = new Date().toISOString().split("T")[0]
    const views = await redis.get<number>(`page_views:${today}`)
    return views ?? 0
  } catch (error) {
    console.error("[v0] Error fetching Upstash KV:", error)
    return 0
  }
}

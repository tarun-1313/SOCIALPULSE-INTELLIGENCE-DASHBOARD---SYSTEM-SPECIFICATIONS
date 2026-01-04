import { createClient } from "@/lib/supabase-server"
import { logActivity } from "./activity-tracker"

export async function fetchSocialMetrics() {
  const supabase = await createClient()
  const { data, error } = await supabase.from("platform_metrics").select("*")
  if (error) throw error
  return data
}

export async function fetchRecentPosts() {
  const supabase = await createClient()
  const { data, error } = await supabase.from("recent_posts").select("*").order("posted_at", { ascending: false })
  if (error) throw error
  return data
}

export async function getAggregatedAnalytics() {
  const metrics = await fetchSocialMetrics()
  const posts = await fetchRecentPosts()

  const totalFollowers = metrics.reduce((acc, m) => acc + m.followers_count, 0)
  const avgEngagement = metrics.reduce((acc, m) => acc + Number(m.engagement_rate), 0) / (metrics.length || 1)

  return {
    totalFollowers,
    avgEngagement: avgEngagement.toFixed(2) + "%",
    platformBreakdown: metrics,
    latestPosts: posts.slice(0, 5),
  }
}

export async function getUserProfile(userId: string) {
  const supabase = await createClient()
  
  try {
    const { data, error } = await supabase.from("user_profiles").select("*").eq("user_id", userId).single()

    if (error) {
      // If profile doesn't exist, create a default one
      if (error.code === "PGRST116" || error.code === "22P02") {
        const { data: user } = await supabase.auth.getUser()
        if (user?.user) {
          const newProfile = {
            user_id: user.user.id,
            email: user.user.email!,
            full_name: user.user.user_metadata?.full_name || user.user.email,
            role: "viewer",
          }

          const { data: created, error: insertError } = await supabase.from("user_profiles").insert(newProfile).select().single()

          if (insertError) {
            console.error("Error creating user profile:", {
              message: insertError.message,
              code: insertError.code,
              details: insertError.details,
              hint: insertError.hint
            })
            // Return a default profile object
            return {
              user_id: userId,
              email: user.user.email!,
              full_name: user.user.user_metadata?.full_name || user.user.email,
              role: "viewer",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
          }

          return created
        }
      }
      throw error
    }

    return data
  } catch (error: any) {
    console.error("Error fetching user profile:", {
      message: error?.message || error,
      code: error?.code,
      details: error?.details
    })
    
    // Return a default profile if there's any error
    const { data: user } = await supabase.auth.getUser()
    return {
      user_id: userId,
      email: user?.user?.email || "",
      full_name: user?.user?.user_metadata?.full_name || user?.user?.email || "User",
      role: "viewer",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }
}

export async function updateUserProfile(userId: string, updates: any) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("user_profiles").update(updates).eq("user_id", userId).select().single()

  if (error) throw error

  await logActivity("profile_updated", "user_profiles", { updates })

  return data
}

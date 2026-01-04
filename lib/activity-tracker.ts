import { createClient } from "@/lib/supabase-server"

// <CHANGE> Enhanced activity tracking with detailed metadata and error handling
export async function logActivity(action: string, resource?: string, metadata?: any) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    // Enhanced metadata with timestamp and user agent info
    const enhancedMetadata = {
      ...metadata,
      timestamp: new Date().toISOString(),
      user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
    }

    await supabase.from("activity_logs").insert({
      user_id: user.id,
      user_email: user.email!,
      action,
      resource,
      metadata: enhancedMetadata,
    })
  } catch (error) {
    console.error("[v0] Failed to log activity:", error)
  }
}

// <CHANGE> New function for tracking sensitive operations with enhanced security logging
export async function logSecurityEvent(
  eventType: 'auth_success' | 'auth_failure' | 'permission_denied' | 'data_export' | 'settings_change',
  details: any
) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    await supabase.from("activity_logs").insert({
      user_id: user?.id || 'anonymous',
      user_email: user?.email || 'anonymous',
      action: `SECURITY_EVENT:${eventType}`,
      resource: 'security',
      metadata: {
        ...details,
        timestamp: new Date().toISOString(),
        severity: eventType.includes('failure') || eventType.includes('denied') ? 'high' : 'medium',
      },
    })
  } catch (error) {
    console.error("[v0] Failed to log security event:", error)
  }
}

// <CHANGE> Batch activity logging for performance-critical operations
export async function logBatchActivities(activities: Array<{
  action: string
  resource?: string
  metadata?: any
}>) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const logs = activities.map(activity => ({
      user_id: user.id,
      user_email: user.email!,
      action: activity.action,
      resource: activity.resource,
      metadata: {
        ...activity.metadata,
        timestamp: new Date().toISOString(),
      },
    }))

    await supabase.from("activity_logs").insert(logs)
  } catch (error) {
    console.error("[v0] Failed to log batch activities:", error)
  }
}

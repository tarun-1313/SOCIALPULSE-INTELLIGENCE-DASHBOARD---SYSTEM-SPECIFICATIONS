import { createClient } from "@/lib/supabase-server"
import { getUserProfile } from "./services"

export type UserRole = "admin" | "analyst" | "viewer"

export interface RolePermissions {
  canAccessAnalytics: boolean
  canAccessReports: boolean
  canGenerateReports: boolean
  canAccessUsers: boolean
  canAccessActivityLogs: boolean
  canManageSystem: boolean
}

const roleHierarchy: Record<UserRole, number> = {
  admin: 3,
  analyst: 2,
  viewer: 1,
}

export async function getUserRole(): Promise<UserRole | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  try {
    const profile = await getUserProfile(user.id)
    return (profile?.role as UserRole) || "viewer"
  } catch (error) {
    console.error("Error getting user role:", error)
    return "viewer"
  }
}

export async function getUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function getRolePermissions(role: UserRole | null): Promise<RolePermissions> {
  if (!role) {
    return {
      canAccessAnalytics: false,
      canAccessReports: false,
      canGenerateReports: false,
      canAccessUsers: false,
      canAccessActivityLogs: false,
      canManageSystem: false,
    }
  }

  switch (role) {
    case "admin":
      return {
        canAccessAnalytics: true,
        canAccessReports: true,
        canGenerateReports: true,
        canAccessUsers: true,
        canAccessActivityLogs: true,
        canManageSystem: true,
      }
    case "analyst":
      return {
        canAccessAnalytics: true,
        canAccessReports: true,
        canGenerateReports: true,
        canAccessUsers: false,
        canAccessActivityLogs: false,
        canManageSystem: false,
      }
    case "viewer":
      return {
        canAccessAnalytics: true,
        canAccessReports: true,
        canGenerateReports: true, // Allow viewers to generate reports
        canAccessUsers: false,
        canAccessActivityLogs: false,
        canManageSystem: false,
      }
  }
}

export async function isAuthorized(requiredRole: UserRole) {
  const role = await getUserRole()
  if (!role) return false
  return (roleHierarchy[role] || 0) >= (roleHierarchy[requiredRole] || 0)
}

import Link from "next/link"
import { BarChart3, Users, Activity, FileText, TrendingUp, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase-server"
import { SignOutButton } from "./sign-out-button"
import { getUserRole, getRolePermissions } from "@/lib/auth"

export async function Header() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const role = await getUserRole()
  const permissions = await getRolePermissions(role)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="size-8 rounded-lg bg-primary flex items-center justify-center transition-transform group-hover:scale-110">
            <BarChart3 className="size-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tighter text-white">SocialPulse</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {user && (
            <>
              {/* Ensured all links are consistent with role permissions */}
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              >
                <BarChart3 className="size-4" />
                Dashboard
              </Link>

              {permissions.canAccessAnalytics && (
                <Link
                  href="/analytics"
                  className="flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  <TrendingUp className="size-4" />
                  Analytics
                </Link>
              )}

              <Link
                href="/settings"
                className="flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              >
                <Settings className="size-4" />
                Settings
              </Link>

              {permissions.canAccessReports && (
                <Link
                  href="/reports"
                  className="flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  <FileText className="size-4" />
                  Reports
                </Link>
              )}

              {permissions.canAccessUsers && (
                <Link
                  href="/users"
                  className="flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  <Users className="size-4" />
                  Users
                </Link>
              )}

              {permissions.canAccessActivityLogs && (
                <Link
                  href="/activity"
                  className="flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  <Activity className="size-4" />
                  Activity Logs
                </Link>
              )}
            </>
          )}

          {!user && (
            <>
              <Link href="/about" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                Contact
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              {role && (
                <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                  <div className="size-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{role}</span>
                </div>
              )}
              <Link
                href="/profile"
                className="hidden sm:block text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              >
                {user.user_metadata?.full_name || user.email}
              </Link>
              <SignOutButton />
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="text-zinc-400 hover:text-white">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-primary text-white hover:bg-primary/90">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

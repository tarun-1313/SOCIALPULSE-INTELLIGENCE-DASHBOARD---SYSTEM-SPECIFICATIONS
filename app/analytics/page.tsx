import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"
import { getAnalyticsEngine } from "@/lib/analytics-engine"
import { getUserRole, getRolePermissions } from "@/lib/auth"
import { logActivity } from "@/lib/activity-tracker"
import { AnalyticsClient } from "@/components/analytics-client"
import { ActivityLogs } from "@/components/analytics/activity-logs"
import { ShieldCheck, BarChart3, Info, Lock } from "lucide-react"

async function getAnalyticsData() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const role = await getUserRole()
  const permissions = await getRolePermissions(role)

  if (!permissions.canAccessAnalytics) {
    redirect("/dashboard")
  }

  await logActivity("analytics_viewed", "analytics_page")

  const engine = await getAnalyticsEngine(user.id)
  const unifiedAnalytics = await engine.getUnifiedAnalytics()
  const timeSeriesData = await engine.getTimeSeriesData(30)

  const { data: connections } = await supabase
    .from("social_media_connections")
    .select("*")
    .eq("user_id", user.id)
    .eq("connection_status", "connected")

  return {
    unifiedAnalytics,
    timeSeriesData,
    connections: connections || [],
    user,
    role,
  }
}

export default async function AnalyticsPage() {
  const { unifiedAnalytics, timeSeriesData, connections, user, role } = await getAnalyticsData()

  return (
    <div className="py-10 px-4 space-y-10 max-w-7xl mx-auto overflow-x-hidden min-h-screen">
      {/* Header Section: Title Left, Filters Right Alignment Strategy */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <BarChart3 className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white tracking-tight">
                Analytics <span className="text-cyan-400">Intelligence</span>
              </h1>
              <p className="text-sm text-zinc-400 font-medium mt-1">Enterprise-grade social performance monitoring</p>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              <ShieldCheck className="size-3 text-cyan-400" />
              <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">{role} ACCESS</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <Lock className="size-3 text-zinc-500" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">TLS 1.3 SECURE</span>
            </div>
          </div>
        </div>

        <div className="glass p-5 rounded-2xl flex items-center gap-4 border-l-4 border-cyan-500 max-w-sm">
          <Info className="size-5 text-cyan-400 flex-shrink-0" />
          <p className="text-[10px] text-zinc-400 leading-relaxed font-semibold">
            Real-time data synchronization active. All metrics are normalized across your{" "}
            <strong className="text-white">connected platforms</strong>.
          </p>
        </div>
      </div>

      {/* Main Analytics Content Container */}
      <div className="space-y-10">
        {/* Connection Status Grid */}
        <div className="glass p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-cyan-500 animate-ping" />
              <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.2em]">Live Data Engine</span>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-1">
              <h3 className="text-sm font-black text-white uppercase tracking-[0.3em]">Data Source Matrix</h3>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                Connected via AES-256 Encrypted Channels
              </p>
            </div>

            {connections.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {connections.map((conn) => (
                  <div
                    key={conn.id}
                    className="group relative glass p-6 rounded-3xl border-white/5 hover:border-cyan-500/30 transition-all duration-500 text-center space-y-3"
                  >
                    <div className="size-14 rounded-2xl bg-white/[0.03] flex items-center justify-center mx-auto group-hover:bg-cyan-500/10 transition-all duration-500 group-hover:scale-110">
                      <span className="text-lg font-black text-zinc-600 group-hover:text-cyan-400 capitalize">
                        {conn.platform[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-black text-white capitalize tracking-wide">{conn.platform}</p>
                      <div className="flex items-center justify-center gap-1.5 mt-1">
                        <div className="size-1.5 rounded-full bg-cyan-500 shadow-lg shadow-cyan-500/50" />
                        <span className="text-[9px] text-cyan-500 font-black uppercase tracking-widest">Linked</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center space-y-4 bg-white/[0.01] rounded-[2rem] border-2 border-dashed border-white/5">
                <p className="text-sm text-zinc-600 font-bold uppercase tracking-widest">
                  No active integrations found
                </p>
                <button className="px-6 py-2 rounded-xl bg-white/5 text-[10px] font-bold text-white uppercase tracking-widest hover:bg-white/10 transition-colors">
                  Configure Sources
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Analytics Interactive Section */}
        <AnalyticsClient
          unifiedAnalytics={unifiedAnalytics}
          timeSeriesData={timeSeriesData}
          platforms={connections.map((c: any) => c.platform)}
        />

        {/* Bottom Section: Security Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <ActivityLogs />
          </div>
          <div className="glass p-8 rounded-[2rem] border border-white/5 flex flex-col justify-center text-center space-y-4">
            <div className="size-16 rounded-3xl bg-cyan-500/10 flex items-center justify-center mx-auto">
              <ShieldCheck className="size-8 text-cyan-400" />
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-black text-white tracking-tight">Enterprise Security</h4>
              <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                Your data is protected by bank-grade encryption and a strict Role-Based Access Control system. Every
                action is logged and auditable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

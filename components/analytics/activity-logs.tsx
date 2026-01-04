import { createClient } from "@/lib/supabase-server"
import { Shield, Clock, User, ArrowRight } from "lucide-react"

export async function ActivityLogs() {
  const supabase = await createClient()
  const { data: logs } = await supabase
    .from("activity_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="glass p-8 rounded-[2rem] space-y-6 border border-white/5 shadow-2xl">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-3">
          <Shield className="size-5 text-cyan-400" />
          Security Audit Trail
        </h3>
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">RBAC Active</span>
      </div>

      <div className="space-y-4">
        {logs && logs.length > 0 ? (
          logs.map((log) => (
            <div
              key={log.id}
              className="group flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all"
            >
              <div className="size-8 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                <Clock className="size-4 text-cyan-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-white truncate">{log.action.replace(/_/g, " ").toUpperCase()}</p>
                  <span className="text-[10px] text-zinc-500 font-medium">
                    {new Date(log.created_at).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <User className="size-3 text-zinc-500" />
                  <span className="text-[10px] text-zinc-400 font-medium truncate">{log.user_email}</span>
                </div>
              </div>
              <ArrowRight className="size-4 text-zinc-700 group-hover:text-cyan-500 transition-colors self-center" />
            </div>
          ))
        ) : (
          <p className="text-xs text-zinc-500 text-center py-4">No recent activities found.</p>
        )}
      </div>

      <button className="w-full py-3 rounded-xl border border-white/5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest hover:bg-white/5 transition-colors">
        View Complete Security Log
      </button>
    </div>
  )
}

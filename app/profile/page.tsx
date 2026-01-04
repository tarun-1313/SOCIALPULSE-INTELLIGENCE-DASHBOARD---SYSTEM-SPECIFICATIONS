import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { Shield, Calendar, Settings, Bell, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="py-12 px-4 space-y-12">
      <div className="flex flex-col md:flex-row items-center gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="size-32 rounded-full bg-gradient-to-tr from-primary to-purple-500 p-1">
          <div className="size-full rounded-full bg-black flex items-center justify-center text-4xl font-bold text-white border-2 border-white/10">
            {user.email?.[0].toUpperCase()}
          </div>
        </div>
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {user.user_metadata?.full_name || "Analytics Manager"}
          </h1>
          <p className="text-zinc-500 font-medium">{user.email}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
              <Shield className="size-3" />
              Pro Account
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
              <Calendar className="size-3" />
              Joined Jan 2026
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass p-8 rounded-[2rem] space-y-8">
            <div className="flex items-center gap-3">
              <Settings className="size-6 text-primary" />
              <h2 className="text-xl font-bold text-white">General Settings</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Display Name</label>
                <input
                  type="text"
                  defaultValue={user.user_metadata?.full_name || "Analytics Manager"}
                  className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  defaultValue={user.email}
                  className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-zinc-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                    <Bell className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Push Notifications</h4>
                    <p className="text-xs text-zinc-500">Receive alerts for major engagement spikes.</p>
                  </div>
                </div>
                <div className="h-6 w-11 bg-primary rounded-full relative">
                  <div className="absolute right-1 top-1 size-4 bg-white rounded-full" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                    <Palette className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Auto-Refresh</h4>
                    <p className="text-xs text-zinc-500">Update dashboard data every 5 minutes.</p>
                  </div>
                </div>
                <div className="h-6 w-11 bg-zinc-800 rounded-full relative">
                  <div className="absolute left-1 top-1 size-4 bg-zinc-500 rounded-full" />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button className="bg-primary text-white hover:bg-primary/90 rounded-xl font-bold px-8">
                Save Changes
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass p-8 rounded-[2rem] space-y-6">
            <h3 className="text-lg font-bold text-white">Your Plan</h3>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-primary/20 space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Enterprise</span>
                <span className="text-2xl font-bold text-white">$99/mo</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Unlock full platform history, unlimited reports, and custom API endpoints.
              </p>
              <Button
                variant="outline"
                className="w-full border-white/10 hover:bg-white/5 font-bold text-xs uppercase bg-transparent"
              >
                Manage Billing
              </Button>
            </div>
          </div>

          <div className="glass p-8 rounded-[2rem] space-y-4">
            <h3 className="text-lg font-bold text-white">System Status</h3>
            <div className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-zinc-400">All systems operational</span>
            </div>
            <div className="pt-4 flex items-center justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              <span>Last Sync</span>
              <span>2 mins ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

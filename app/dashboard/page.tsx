import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { Users, Heart, MessageSquare, BarChart2, PieChart, ArrowUpRight, Share2, ShieldCheck } from "lucide-react"
import { D3EngagementChart } from "@/components/d3-engagement-chart"
import { getUserRole, isAuthorized } from "@/lib/auth"

async function getDashboardData() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const role = await getUserRole()
  const isAdmin = await isAuthorized("admin")

  const { data: metrics } = await supabase.from("platform_metrics").select("*")
  const { data: posts } = await supabase.from("recent_posts").select("*").order("posted_at", { ascending: false })

  // Mock chart data for visualization
  const chartData = [
    { name: "Mon", engagement: 4000, reach: 2400 },
    { name: "Tue", engagement: 3000, reach: 1398 },
    { name: "Wed", engagement: 2000, reach: 9800 },
    { name: "Thu", engagement: 2780, reach: 3908 },
    { name: "Fri", engagement: 1890, reach: 4800 },
    { name: "Sat", engagement: 2390, reach: 3800 },
    { name: "Sun", engagement: 3490, reach: 4300 },
  ]

  return { metrics, posts, chartData, user, role, isAdmin }
}

export default async function DashboardPage() {
  const { metrics, posts, chartData, user, role, isAdmin } = await getDashboardData()

  const d3Data = chartData.map((d) => ({ name: d.name, value: d.engagement }))

  return (
    <div className="py-10 px-4 space-y-8 max-w-full overflow-x-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-white tracking-tight">Organization Overview</h1>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
              <ShieldCheck className="size-3 text-primary" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{role}</span>
            </div>
          </div>
          <p className="text-zinc-500">
            Welcome back, {user.user_metadata?.full_name || "Manager"}. Here is your real-time performance.
          </p>
        </div>
        <div className="flex gap-3">
          {isAdmin && (
            <button className="h-10 px-4 rounded-xl glass text-xs font-bold text-emerald-400 uppercase tracking-widest hover:bg-white/10 transition-colors">
              Admin Settings
            </button>
          )}
          <button className="h-10 px-4 rounded-xl glass text-xs font-bold text-white uppercase tracking-widest hover:bg-white/10 transition-colors">
            Export Report
          </button>
          <button className="h-10 px-4 rounded-xl bg-primary text-white text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
            Refresh Data
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Users, label: "Total Followers", value: "245.8k", trend: "+12.5%", color: "text-blue-400" },
          { icon: Heart, label: "Avg. Engagement", value: "4.2%", trend: "+0.8%", color: "text-pink-400" },
          { icon: MessageSquare, label: "Total Comments", value: "12,402", trend: "+5.2%", color: "text-purple-400" },
          { icon: Share2, label: "Shares Count", value: "3,892", trend: "-1.2%", color: "text-cyan-400" },
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-2xl space-y-4 hover:border-primary/20 transition-all group">
            <div className="flex justify-between items-start">
              <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                <stat.icon className="size-5" />
              </div>
              <span
                className={`text-[10px] font-bold ${stat.trend.startsWith("+") ? "text-emerald-400" : "text-red-400"}`}
              >
                {stat.trend}
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-8 rounded-4xl space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <BarChart2 className="size-5 text-primary" />
              <h3 className="font-bold text-white">Engagement Trends (D3.js)</h3>
            </div>
            <select className="bg-transparent border-none text-xs font-bold text-zinc-500 focus:ring-0">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <D3EngagementChart data={d3Data} />
          </div>
        </div>

        <div className="glass p-8 rounded-4xl space-y-6">
          <div className="flex items-center gap-3">
            <PieChart className="size-5 text-purple-400" />
            <h3 className="font-bold text-white">Platform Reach</h3>
          </div>
          <div className="h-[300px] w-full flex items-center justify-center relative">
            {/* Visual placeholder for Pie Chart since it needs more setup for labels */}
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <div className="size-48 rounded-full border-12 border-primary/20 flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full border-12 border-primary border-t-transparent border-l-transparent rotate-45" />
                <div className="text-center">
                  <span className="text-2xl font-bold text-white">68%</span>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Growth</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Analysis Table */}
      <div className="glass p-8 rounded-4xl space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ArrowUpRight className="size-5 text-emerald-400" />
            <h3 className="font-bold text-white">Top Performing Content</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="pb-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Post Content</th>
                <th className="pb-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Platform</th>
                <th className="pb-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Reach</th>
                <th className="pb-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Engagement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {posts?.slice(0, 5).map((post) => (
                <tr key={post.id} className="group hover:bg-white/2 transition-colors">
                  <td className="py-4 pr-4">
                    <p className="text-sm font-medium text-white truncate max-w-[300px]">{post.content}</p>
                  </td>
                  <td className="py-4">
                    <span className="text-xs text-zinc-500 uppercase tracking-widest">{post.platform}</span>
                  </td>
                  <td className="py-4">
                    <span className="text-xs text-white font-bold">{(post.likes ?? 0).toLocaleString()}</span>
                  </td>
                  <td className="py-4">
                    <span className="text-xs text-emerald-400 font-bold">
                      {((post.comments ?? 0) / 10).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { FileText, Download, Calendar, Filter, FileBarChart, Clock, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getUserRole, getRolePermissions } from "@/lib/auth"
import { ReportGenerator } from "@/components/report-generator"
import { ReportInsights } from "@/components/report-insights"
import { getAnalyticsEngine } from "@/lib/analytics-engine"
import { ReportsListClient } from "@/components/reports-list-client"
import { ReportStatsClient } from "@/components/report-stats-client"

export default async function ReportsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const role = await getUserRole()
  const permissions = await getRolePermissions(role)

  if (!permissions.canAccessReports) {
    redirect("/dashboard")
  }

  const engine = await getAnalyticsEngine(user.id)
  const analytics = await engine.getUnifiedAnalytics()

  // Fetch real generated reports from database
  const { data: dbReports } = await supabase
    .from("generated_reports")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  // Use real reports if they exist, otherwise use fallback
  let reports = dbReports && dbReports.length > 0 ? dbReports : [
    {
      id: "rep-123456",
      report_type: "Monthly",
      format: "pdf",
      status: "completed",
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "rep-789012",
      report_type: "Weekly",
      format: "csv",
      status: "completed",
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "rep-345678",
      report_type: "Monthly",
      format: "pdf",
      status: "completed",
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    }
  ]

  return (
    <div className="py-10 px-4 space-y-8 max-w-7xl mx-auto">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-white tracking-tight">Performance Reports</h1>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
              <ShieldCheck className="size-3 text-primary" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{role}</span>
            </div>
          </div>
          <p className="text-zinc-500">Generate and download detailed analytics documents in PDF and CSV formats.</p>
        </div>
      </div>

      {permissions.canGenerateReports && (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <ReportGenerator />
        </div>
      )}

      <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <ReportInsights analytics={analytics} />
      </div>

      <ReportStatsClient initialCount={reports.length} />

      <div className="glass p-8 rounded-4xl space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h3 className="font-bold text-white">Generated Documents</h3>
          <div className="flex gap-2 w-full md:w-auto">
            <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-white flex-1 md:flex-none">
              <Filter className="size-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <ReportsListClient initialReports={reports} />
        </div>
      </div>
    </div>
  )
}

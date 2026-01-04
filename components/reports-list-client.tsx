"use client"

import { useState, useEffect } from "react"
import { FileText, Download, Calendar, Clock, FileBarChart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Report {
  id: string
  report_type: string
  format: string
  status: string
  created_at: string
}

interface ReportsListClientProps {
  initialReports: Report[]
}

export function ReportsListClient({ initialReports }: ReportsListClientProps) {
  const [reports, setReports] = useState<Report[]>(initialReports)

  // Listen for the custom event from ReportGenerator
  useEffect(() => {
    const handleReportGenerated = () => {
      // Small delay to allow DB to sync, then fetch or refresh
      // Since we want it to be "always added", we could actually 
      // just trigger a refresh or fetch from the API here
      fetchReports()
    }

    window.addEventListener("report-generated", handleReportGenerated)
    return () => window.removeEventListener("report-generated", handleReportGenerated)
  }, [])

  async function fetchReports() {
    try {
      const response = await fetch("/api/reports/list")
      if (response.ok) {
        const data = await response.json()
        if (data.reports && data.reports.length > 0) {
          setReports(data.reports)
        }
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error)
    }
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <div
          key={report.id}
          className="group p-4 rounded-xl border border-white/5 hover:border-primary/20 hover:bg-white/2 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="size-10 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-primary transition-colors">
              {report.format === "pdf" ? <FileText className="size-5" /> : <FileBarChart className="size-5" />}
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-tight flex items-center gap-2">
                {report.report_type} Performance Intelligence
                {report.format === "pdf" && (
                  <span className="text-[8px] bg-primary/20 text-primary px-1.5 py-0.5 rounded border border-primary/20 font-black">EXECUTIVE</span>
                )}
              </h4>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold flex items-center gap-2">
                <Calendar className="size-3" />
                {new Date(report.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} 
                <span className="text-zinc-700">•</span>
                <Clock className="size-3" />
                {new Date(report.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                <span className="text-zinc-700">•</span>
                <span className={report.status === "completed" ? "text-emerald-400" : "text-amber-400"}>
                  {report.status.toUpperCase()}
                </span>
              </p>
            </div>
          </div>
          {report.status === "completed" && (
            <a href={`/api/reports/download/${report.id}`} download>
              <Button size="sm" variant="ghost" className="text-zinc-500 hover:text-white">
                <Download className="size-4" />
              </Button>
            </a>
          )}
        </div>
      ))}
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { FileBarChart, Clock, Calendar } from "lucide-react"

interface Report {
  id: string
}

interface ReportStatsClientProps {
  initialCount: number
}

export function ReportStatsClient({ initialCount }: ReportStatsClientProps) {
  const [count, setCount] = useState(initialCount)

  useEffect(() => {
    const handleReportGenerated = async () => {
      try {
        const response = await fetch("/api/reports/list")
        if (response.ok) {
          const data = await response.json()
          if (data.reports) {
            setCount(data.reports.length)
          }
        }
      } catch (error) {
        console.error("Failed to fetch report count:", error)
      }
    }

    window.addEventListener("report-generated", handleReportGenerated)
    return () => window.removeEventListener("report-generated", handleReportGenerated)
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="glass p-6 rounded-2xl flex items-center gap-4">
        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <FileBarChart className="size-6" />
        </div>
        <div>
          <p className="text-sm font-bold text-white">{count} Reports</p>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Total Generated</p>
        </div>
      </div>
      <div className="glass p-6 rounded-2xl flex items-center gap-4">
        <div className="size-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
          <Clock className="size-6" />
        </div>
        <div>
          <p className="text-sm font-bold text-white">Daily Auto-sync</p>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Status: Active</p>
        </div>
      </div>
      <div className="glass p-6 rounded-2xl flex items-center gap-4">
        <div className="size-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
          <Calendar className="size-6" />
        </div>
        <div>
          <p className="text-sm font-bold text-white">Jan 2026</p>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Current Period</p>
        </div>
      </div>
    </div>
  )
}

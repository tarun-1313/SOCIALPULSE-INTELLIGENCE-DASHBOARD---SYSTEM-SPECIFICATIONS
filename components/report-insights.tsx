"use client"

import { useState, useEffect } from "react"
import { Sparkles, TrendingUp, Target, Zap, AlertCircle, Loader2 } from "lucide-react"
import type { UnifiedAnalytics } from "@/lib/analytics-engine"

interface ReportInsightsProps {
  analytics: UnifiedAnalytics
}

export function ReportInsights({ analytics: initialAnalytics }: ReportInsightsProps) {
  const [analytics, setAnalytics] = useState<UnifiedAnalytics>(initialAnalytics)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const checkAndMergeUploads = async () => {
      const stored = localStorage.getItem("social_dashboard_uploads")
      if (!stored) return

      try {
        const uploads = JSON.parse(stored)
        if (!uploads.performance && !uploads.growth && !uploads.topPosts) return

        setIsLoading(true)
        const response = await fetch("/api/reports/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reportType: "monthly",
            format: "pdf", // We just want the analytics data back
            previewOnly: true, // We'll need to handle this in the API
            uploads
          }),
        })

        if (response.ok) {
          const data = await response.json()
          if (data.analytics) {
            setAnalytics(data.analytics)
          }
        }
      } catch (e) {
        console.error("Failed to merge uploads for insights", e)
      } finally {
        setIsLoading(false)
      }
    }

    checkAndMergeUploads()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Sparkles className="size-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Live Intelligence Preview</h3>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Real-time Insights from Connected Data</p>
          </div>
        </div>
        {isLoading && <Loader2 className="size-4 text-primary animate-spin" />}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {analytics.insights.slice(0, 4).map((insight, i) => (
          <div 
            key={i} 
            className="group relative p-5 rounded-2xl border border-white/5 bg-white/2 hover:bg-white/4 transition-all overflow-hidden"
          >
            <div className={`absolute top-0 left-0 w-1 h-full ${
              insight.type === "positive" ? "bg-emerald-500" : 
              insight.type === "negative" ? "bg-rose-500" : "bg-cyan-500"
            }`} />
            
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg ${
                insight.type === "positive" ? "bg-emerald-500/10 text-emerald-400" : 
                insight.type === "negative" ? "bg-rose-500/10 text-rose-400" : "bg-cyan-500/10 text-cyan-400"
              }`}>
                {insight.metric === "engagement" ? <Zap className="size-3" /> :
                 insight.metric === "growth" ? <TrendingUp className="size-3" /> :
                 insight.metric === "reach" ? <Target className="size-3" /> :
                 <AlertCircle className="size-3" />}
              </div>
              <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest group-hover:text-zinc-400 transition-colors">
                {insight.platform || "Global"}
              </span>
            </div>

            <h4 className="text-xs font-black text-white uppercase tracking-tight mb-2 leading-tight">
              {insight.title}
            </h4>
            <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">
              {insight.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

"use client"

import { Lightbulb, TrendingUp, TrendingDown, Info } from "lucide-react"

interface Insight {
  type: "positive" | "negative" | "neutral"
  title: string
  description: string
  metric: string
  platform?: string
}

export default function SmartNarrative({ insights }: { insights: Insight[] }) {
  if (insights.length === 0) return null

  return (
    <div className="glass p-8 rounded-[2rem] space-y-8">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
          <Lightbulb className="size-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">Smart Narrative Insights</h3>
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">AI-Generated Interpretation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {insights.map((insight, i) => {
          const Icon = insight.type === "positive" ? TrendingUp : insight.type === "negative" ? TrendingDown : Info
          const colorClass =
            insight.type === "positive"
              ? "text-emerald-400"
              : insight.type === "negative"
                ? "text-red-400"
                : "text-blue-400"
          const bgClass =
            insight.type === "positive"
              ? "bg-emerald-500/10"
              : insight.type === "negative"
                ? "bg-red-500/10"
                : "bg-blue-500/10"

          return (
            <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div
                className={`size-10 rounded-xl ${bgClass} ${colorClass} flex items-center justify-center flex-shrink-0`}
              >
                <Icon className="size-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">{insight.title}</h4>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${colorClass}`}>
                    {insight.metric}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">{insight.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

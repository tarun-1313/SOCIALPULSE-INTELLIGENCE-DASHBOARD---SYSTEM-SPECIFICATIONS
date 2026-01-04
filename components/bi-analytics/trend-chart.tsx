"use client"

import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface TrendChartProps {
  data: any[]
  title: string
  metric: string
  platforms: string[]
  type?: "line" | "area"
}

const COLORS = ["#06b6d4", "#8b5cf6", "#3b82f6", "#f97316"]

export default function TrendChart({ data, title, metric, platforms, type = "line" }: TrendChartProps) {
  const config: any = {}
  platforms.forEach((p, i) => {
    const key = `${p}_${metric}`
    const formattedLabel = p.replace(/_/g, " ")
    config[key] = {
      label: formattedLabel.charAt(0).toUpperCase() + formattedLabel.slice(1),
      color: COLORS[i % COLORS.length],
    }
  })

  return (
    <div className="glass p-6 rounded-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
        <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full border border-dashed border-zinc-500" />
            <span>Forecast</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-primary" />
            <span>Actual</span>
          </div>
        </div>
      </div>

      <ChartContainer config={config} className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {type === "line" ? (
            <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="dateLabel" axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 10 }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#71717a", fontSize: 10 }}
                tickFormatter={(value) => (value > 1000 ? `${(value / 1000).toFixed(1)}k` : value)}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              {platforms.map((p, i) => (
                <Line
                  key={p}
                  type="monotone"
                  dataKey={`${p}_${metric}`}
                  stroke={`var(--color-${p}_${metric})`}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                  strokeDasharray="0"
                />
              ))}
            </LineChart>
          ) : (
            <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <defs>
                {platforms.map((p, i) => (
                  <linearGradient key={`grad-${p}-${metric}`} id={`color-${p}-${metric}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="dateLabel" axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 10 }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#71717a", fontSize: 10 }}
                tickFormatter={(value) => (value > 1000 ? `${(value / 1000).toFixed(1)}k` : value)}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              {platforms.map((p, i) => (
                <Area
                  key={p}
                  type="monotone"
                  dataKey={`${p}_${metric}`}
                  stroke={COLORS[i % COLORS.length]}
                  fillOpacity={1}
                  fill={`url(#color-${p}-${metric})`}
                />
              ))}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}

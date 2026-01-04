"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Star, TrendingDown, TrendingUp } from "lucide-react"

interface MatrixRow {
  platform: string
  engagement: number
  reach: number
  growth: number
}

export default function ComparisonMatrix({ data }: { data: MatrixRow[] }) {
  const [sortKey, setSortKey] = useState<keyof MatrixRow>("engagement")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const sortedData = [...data].sort((a, b) => {
    const valA = a[sortKey]
    const valB = b[sortKey]

    if (typeof valA === "string" || typeof valB === "string") return 0

    return sortOrder === "asc" ? valA - valB : valB - valA
  })

  const toggleSort = (key: keyof MatrixRow) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortOrder("desc")
    }
  }

  const maxEngagement = Math.max(...data.map((d) => d.engagement))
  const maxGrowth = Math.max(...data.map((d) => d.growth))

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-white/5">
        <h3 className="text-lg font-bold text-white tracking-tight">Comparative Platform Analysis</h3>
        <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest font-bold">Power BI Matrix Style</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              <th className="px-6 py-4">Platform</th>
              <th
                className="px-6 py-4 cursor-pointer hover:text-white transition-colors"
                onClick={() => toggleSort("engagement")}
              >
                <div className="flex items-center gap-1">
                  Engagement Rate
                  {sortKey === "engagement" &&
                    (sortOrder === "asc" ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />)}
                </div>
              </th>
              <th
                className="px-6 py-4 cursor-pointer hover:text-white transition-colors"
                onClick={() => toggleSort("reach")}
              >
                <div className="flex items-center gap-1">
                  Total Reach
                  {sortKey === "reach" &&
                    (sortOrder === "asc" ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />)}
                </div>
              </th>
              <th
                className="px-6 py-4 cursor-pointer hover:text-white transition-colors"
                onClick={() => toggleSort("growth")}
              >
                <div className="flex items-center gap-1">
                  Growth %
                  {sortKey === "growth" &&
                    (sortOrder === "asc" ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />)}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sortedData.map((row) => (
              <tr key={row.platform} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-2 rounded-full bg-primary" />
                    <span className="text-sm font-bold text-white capitalize">{row.platform}</span>
                    {row.engagement === maxEngagement && <Star className="size-3 text-amber-400 fill-amber-400" />}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                      row.engagement > 3 ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {row.engagement.toFixed(1)}%
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-zinc-300 font-medium">
                    {row.reach > 1000 ? `${(row.reach / 1000).toFixed(1)}k` : row.reach}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${row.growth > 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {row.growth > 0 ? "+" : ""}
                      {row.growth.toFixed(1)}%
                    </span>
                    {row.growth > 2 ? (
                      <TrendingUp className="size-4 text-emerald-400" />
                    ) : (
                      <TrendingDown className="size-4 text-red-400 opacity-50" />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

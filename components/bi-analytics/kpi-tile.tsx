"use client"

import { ArrowUpRight, ArrowDownRight, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface KPITileProps {
  title: string
  value: string | number
  change?: number
  isPercentage?: boolean
  description: string
  icon: any
}

export default function KPITile({ title, value, change, isPercentage, description, icon: Icon }: KPITileProps) {
  const isPositive = change && change > 0

  return (
    <div className="glass p-6 rounded-2xl space-y-4 hover:border-primary/30 transition-all group">
      <div className="flex items-start justify-between">
        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
          <Icon className="size-5" />
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-zinc-500 hover:text-white transition-colors">
                <Info className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="bg-[#151720] border-white/10 text-zinc-300 text-xs max-w-[200px]">
              <p>{description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-1">
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold text-white tracking-tight">
            {isPercentage && typeof value === "number" ? `${value.toFixed(1)}%` : value}
          </h3>
          {change !== undefined && (
            <div
              className={`flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded ${
                isPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
              }`}
            >
              {isPositive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
              {Math.abs(change)}%
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

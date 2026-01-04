"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { TrendingUp, TrendingDown } from "lucide-react"

interface EngagementData {
  date: string
  engagement: number
  previousEngagement?: number
}

interface EngagementTrendsProps {
  data: EngagementData[]
  dateRange: "7d" | "30d" | "90d"
}

export function EngagementTrends({ data, dateRange }: EngagementTrendsProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [hoveredData, setHoveredData] = useState<EngagementData | null>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return

    // Responsive dimensions
    const container = svgRef.current.parentElement
    if (!container) return

    const containerWidth = container.clientWidth
    const containerHeight = 400
    setDimensions({ width: containerWidth, height: containerHeight })

    const margin = { top: 30, right: 30, bottom: 50, left: 60 }
    const width = containerWidth - margin.left - margin.right
    const height = containerHeight - margin.top - margin.bottom

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove()

    // Create SVG with dark gradient background
    const svg = d3.select(svgRef.current).attr("width", containerWidth).attr("height", containerHeight)

    // Add gradient background
    const defs = svg.append("defs")

    const bgGradient = defs
      .append("linearGradient")
      .attr("id", "bg-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%")

    bgGradient.append("stop").attr("offset", "0%").attr("stop-color", "#020617").attr("stop-opacity", 1)

    bgGradient.append("stop").attr("offset", "100%").attr("stop-color", "#0b1220").attr("stop-opacity", 1)

    // Bar gradient (cyan to teal)
    const barGradient = defs
      .append("linearGradient")
      .attr("id", "bar-gradient")
      .attr("x1", "0%")
      .attr("y1", "100%")
      .attr("x2", "0%")
      .attr("y2", "0%")

    barGradient.append("stop").attr("offset", "0%").attr("stop-color", "#0891b2").attr("stop-opacity", 1)

    barGradient.append("stop").attr("offset", "100%").attr("stop-color", "#06b6d4").attr("stop-opacity", 1)

    // Glow filter for hover effect
    const filter = defs
      .append("filter")
      .attr("id", "glow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%")

    filter.append("feGaussianBlur").attr("stdDeviation", "4").attr("result", "coloredBlur")

    const feMerge = filter.append("feMerge")
    feMerge.append("feMergeNode").attr("in", "coloredBlur")
    feMerge.append("feMergeNode").attr("in", "SourceGraphic")

    // Background rect
    svg
      .append("rect")
      .attr("width", containerWidth)
      .attr("height", containerHeight)
      .attr("fill", "url(#bg-gradient)")
      .attr("rx", 24)

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)

    // Scales
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.date))
      .range([0, width])
      .padding(0.3)

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.engagement) || 100])
      .nice()
      .range([height, 0])

    // Subtle grid lines
    g.append("g")
      .attr("class", "grid")
      .call(
        d3
          .axisLeft(y)
          .tickSize(-width)
          .tickFormat(() => ""),
      )
      .style("stroke", "#1e293b")
      .style("stroke-opacity", 0.15)
      .style("stroke-width", 0.5)
      .select(".domain")
      .remove()

    // X Axis
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .style("color", "#64748b")
      .style("font-size", "10px")
      .style("font-weight", "500")
      .selectAll("text")
      .style("fill", "#64748b")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")

    // Y Axis
    g.append("g")
      .call(d3.axisLeft(y).ticks(6))
      .style("color", "#64748b")
      .style("font-size", "11px")
      .style("font-weight", "500")
      .selectAll("text")
      .style("fill", "#64748b")

    // Bars
    const bars = g
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.date) || 0)
      .attr("width", x.bandwidth())
      .attr("y", height)
      .attr("height", 0)
      .attr("fill", "url(#bar-gradient)")
      .attr("rx", 6)
      .attr("ry", 6)
      .style("cursor", "pointer")
      .style("transition", "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)")

    // Animate bars upward
    bars
      .transition()
      .duration(1000)
      .ease(d3.easeBackOut)
      .attr("y", (d) => y(d.engagement))
      .attr("height", (d) => height - y(d.engagement))

    // Hover interactions
    bars
      .on("mouseenter", function (event, d) {
        const bar = d3.select(this)
        bar.transition().duration(200).attr("filter", "url(#glow)").style("opacity", 0.9)

        setHoveredData(d)

        if (tooltipRef.current) {
          const rect = (event.target as SVGRectElement).getBoundingClientRect()
          tooltipRef.current.style.left = `${rect.left + rect.width / 2}px`
          tooltipRef.current.style.top = `${rect.top - 10}px`
          tooltipRef.current.style.opacity = "1"
          tooltipRef.current.style.transform = "translateX(-50%) translateY(-100%)"
        }
      })
      .on("mouseleave", function () {
        d3.select(this).transition().duration(200).attr("filter", null).style("opacity", 1)

        setHoveredData(null)

        if (tooltipRef.current) {
          tooltipRef.current.style.opacity = "0"
        }
      })
  }, [data, dateRange])

  const getTrendIndicator = () => {
    if (!hoveredData || hoveredData.previousEngagement === undefined) return null
    const trend = hoveredData.engagement - hoveredData.previousEngagement
    const isPositive = trend > 0

    return (
      <div className={`flex items-center gap-1 ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
        {isPositive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
        <span className="text-xs font-bold">
          {isPositive ? "+" : ""}
          {trend.toFixed(0)}
        </span>
      </div>
    )
  }

  return (
    <div className="relative w-full">
      <svg ref={svgRef} className="w-full" style={{ minHeight: "400px" }} />

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed pointer-events-none z-50 transition-all duration-200"
        style={{ opacity: 0 }}
      >
        {hoveredData && (
          <div className="glass px-4 py-3 rounded-xl border border-cyan-500/30 shadow-2xl backdrop-blur-xl space-y-1.5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{hoveredData.date}</span>
              {getTrendIndicator()}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">{hoveredData.engagement.toLocaleString()}</span>
              <span className="text-xs text-zinc-500 font-medium">engagements</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

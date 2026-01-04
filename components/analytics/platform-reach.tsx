"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { Info } from "lucide-react"

interface PlatformReachProps {
  percentage: number
  label?: string
  description?: string
}

export function PlatformReach({ percentage, label = "Platform Reach", description }: PlatformReachProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [animatedPercentage, setAnimatedPercentage] = useState(0)

  useEffect(() => {
    if (!svgRef.current) return

    const size = 280
    const strokeWidth = 24
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius

    // Clear previous
    d3.select(svgRef.current).selectAll("*").remove()

    const svg = d3.select(svgRef.current).attr("width", size).attr("height", size)

    const g = svg.append("g").attr("transform", `translate(${size / 2},${size / 2})`)

    // Define gradient
    const defs = svg.append("defs")

    const gradient = defs
      .append("linearGradient")
      .attr("id", "progress-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%")

    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#3b82f6").attr("stop-opacity", 1)

    gradient.append("stop").attr("offset", "100%").attr("stop-color", "#06b6d4").attr("stop-opacity", 1)

    // Inner shadow filter
    const filter = defs
      .append("filter")
      .attr("id", "inner-shadow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%")

    filter.append("feGaussianBlur").attr("in", "SourceAlpha").attr("stdDeviation", "3").attr("result", "blur")

    filter.append("feOffset").attr("in", "blur").attr("dx", "0").attr("dy", "2").attr("result", "offsetBlur")

    const feMerge = filter.append("feMerge")
    feMerge.append("feMergeNode").attr("in", "offsetBlur")
    feMerge.append("feMergeNode").attr("in", "SourceGraphic")

    // Glow filter
    const glowFilter = defs
      .append("filter")
      .attr("id", "glow-effect")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%")

    glowFilter.append("feGaussianBlur").attr("stdDeviation", "6").attr("result", "coloredBlur")

    const glowMerge = glowFilter.append("feMerge")
    glowMerge.append("feMergeNode").attr("in", "coloredBlur")
    glowMerge.append("feMergeNode").attr("in", "SourceGraphic")

    // Background ring (darker, desaturated)
    g.append("circle")
      .attr("r", radius)
      .attr("fill", "none")
      .attr("stroke", "#1e293b")
      .attr("stroke-width", strokeWidth)
      .attr("opacity", 0.3)

    // Progress ring
    const progressRing = g
      .append("circle")
      .attr("r", radius)
      .attr("fill", "none")
      .attr("stroke", "url(#progress-gradient)")
      .attr("stroke-width", strokeWidth)
      .attr("stroke-linecap", "round")
      .attr("filter", "url(#inner-shadow)")
      .style("transform", "rotate(-90deg)")
      .style("transform-origin", "center")
      .attr("stroke-dasharray", circumference)
      .attr("stroke-dashoffset", circumference)

    // Animate the circle drawing
    progressRing
      .transition()
      .duration(2000)
      .ease(d3.easeCubicOut)
      .attr("stroke-dashoffset", circumference - (circumference * percentage) / 100)
      .tween("percentage", () => {
        const interpolate = d3.interpolate(0, percentage)
        return (t) => {
          setAnimatedPercentage(Math.round(interpolate(t)))
        }
      })

    // Pulse animation every 3 seconds
    const pulse = () => {
      progressRing
        .transition()
        .duration(800)
        .attr("filter", "url(#glow-effect)")
        .transition()
        .duration(800)
        .attr("filter", "url(#inner-shadow)")
        .on("end", () => {
          setTimeout(pulse, 3000)
        })
    }

    setTimeout(pulse, 3000)
  }, [percentage])

  return (
    <div
      className="relative flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg ref={svgRef} className="drop-shadow-2xl" />

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-center space-y-2">
          <div
            className={`text-6xl font-bold text-white transition-all duration-300 ${
              isHovered ? "scale-110" : "scale-100"
            }`}
            style={{
              fontVariantNumeric: "tabular-nums",
              textShadow: "0 0 30px rgba(6, 182, 212, 0.5)",
            }}
          >
            {animatedPercentage}%
          </div>
          <div className="text-sm font-bold text-zinc-500 uppercase tracking-widest">{label}</div>
        </div>
      </div>

      {/* Hover tooltip */}
      {isHovered && description && (
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-64 animate-in fade-in slide-in-from-top-2 duration-300 z-50">
          <div className="glass px-4 py-3 rounded-xl border border-cyan-500/30 shadow-2xl backdrop-blur-xl">
            <div className="flex items-start gap-2">
              <Info className="size-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-zinc-300 leading-relaxed">{description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Pulsing indicator for live data */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <div className="size-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Live</span>
      </div>
    </div>
  )
}

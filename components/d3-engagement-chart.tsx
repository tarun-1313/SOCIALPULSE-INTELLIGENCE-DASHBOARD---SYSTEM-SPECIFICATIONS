"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

interface DataPoint {
  name: string
  value: number
}

export function D3EngagementChart({ data }: { data: DataPoint[] }) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !data.length) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const margin = { top: 20, right: 30, bottom: 40, left: 40 }
    const width = 600 - margin.left - margin.right
    const height = 300 - margin.top - margin.bottom

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, width])
      .padding(0.3)

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) || 0])
      .range([height, 0])

    // X Axis
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .attr("color", "#ffffff20")
      .selectAll("text")
      .attr("color", "#ffffff60")
      .style("font-size", "10px")

    // Y Axis
    g.append("g")
      .call(d3.axisLeft(y).ticks(5))
      .attr("color", "#ffffff20")
      .selectAll("text")
      .attr("color", "#ffffff60")
      .style("font-size", "10px")

    // Bars
    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.name) || 0)
      .attr("y", height)
      .attr("width", x.bandwidth())
      .attr("height", 0)
      .attr("fill", "var(--color-primary)")
      .attr("rx", 4)
      .transition()
      .duration(1000)
      .attr("y", (d) => y(d.value))
      .attr("height", (d) => height - y(d.value))
  }, [data])

  return (
    <div className="w-full overflow-hidden">
      <svg ref={svgRef} viewBox="0 0 600 300" className="w-full h-auto" />
    </div>
  )
}

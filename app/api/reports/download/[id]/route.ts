import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { getAnalyticsEngine } from "@/lib/analytics-engine"
import { logActivity } from "@/lib/activity-tracker"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 1. Fetch the report record from Supabase
    let report = null
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)

    if (isUuid) {
      const { data, error: dbError } = await supabase
        .from("generated_reports")
        .select("*")
        .eq("id", id)
        .single()
      
      if (dbError) {
        console.warn("Report not found in database, falling back to default analytics:", dbError)
      } else {
        report = data
      }
    } else {
      console.log(`Using fallback analytics for non-UUID report ID: ${id}`)
    }
    
    // 2. Extract metadata
    const metadata = report?.metadata || {}
    const uploads = metadata.uploads
    const filters = metadata.filters
    const reportType = report?.report_type || "monthly"

    // 3. Fetch analytics data using the stored metadata
    const engine = await getAnalyticsEngine(user.id)
    const analytics = await engine.getUnifiedAnalytics(uploads, filters)

    let content: Uint8Array | string
    let contentType: string
    let filename: string

    // 4. Determine format
    const format = report?.format || (id.includes("csv") ? "csv" : "pdf")
    const isCsv = format === "csv"

    if (isCsv) {
      content = generateCSV(analytics, reportType)
      contentType = "text/csv"
      filename = `social-media-report-${Date.now()}.csv`
    } else {
      const pdf = generatePDF(analytics, reportType, id)
      const pdfOutput = pdf.output("arraybuffer")
      content = new Uint8Array(pdfOutput)
      contentType = "application/pdf"
      filename = `social-media-report-${Date.now()}.pdf`
    }

    // Log download activity (optional)
    try {
      await logActivity("report_downloaded", "generated_reports", {
        reportId: id,
      })
    } catch (e) {
      console.warn("Could not log activity: table 'generated_reports' missing")
    }

    return new NextResponse(content as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error("[v0] Report download error:", error)
    return NextResponse.json({ error: "Failed to download report" }, { status: 500 })
  }
}

function generateCSV(analytics: any, reportType: string): string {
  let csv = "Platform,Followers,Engagement Rate,Growth Rate,Reach\n"

  analytics.platformBreakdown.forEach((platform: any) => {
    csv += `${platform.platform},${platform.followers},${platform.engagementRate}%,${platform.growthRate}%,${platform.reach}\n`
  })

  csv += "\nTop Posts\n"
  csv += "Platform,Content,Likes,Comments,Shares,Engagement Score\n"

  analytics.topPosts.forEach((post: any) => {
    const content = post.content.replace(/,/g, ";").substring(0, 50)
    csv += `${post.platform},"${content}",${post.likes},${post.comments},${post.shares},${post.engagementScore}\n`
  })

  return csv
}

function generatePDF(analytics: any, reportType: string, reportId: string): jsPDF {
  const doc = new jsPDF()
  const timestamp = new Date().toLocaleString()
  const primaryColor: [number, number, number] = [6, 182, 212] // Cyan-500
  const secondaryColor: [number, number, number] = [139, 92, 246] // Violet-500
  const textColor: [number, number, number] = [30, 41, 59] // Zinc-800
  const lightTextColor: [number, number, number] = [100, 116, 139] // Zinc-500

  // --- PAGE 1: TITLE & EXECUTIVE SUMMARY ---
  // Header Branding
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.rect(0, 0, 210, 50, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(28)
  doc.setFont("helvetica", "bold")
  doc.text("SOCIAL INTELLIGENCE", 20, 25)
  doc.setFontSize(14)
  doc.setFont("helvetica", "normal")
  doc.text("Comprehensive Performance Analytics & Strategic Roadmap", 20, 35)
  doc.setFontSize(10)
  doc.text(`Generated: ${timestamp} | Scope: ${reportType.toUpperCase()} ANALYTICS`, 20, 42)

  // Executive Narrative
  doc.setTextColor(textColor[0], textColor[1], textColor[2])
  doc.setFontSize(18)
  doc.setFont("helvetica", "bold")
  doc.text("1. Executive Summary", 20, 65)
  
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  const summaryText = `This intelligence report provides a deep-dive analysis of your brand's social media presence across connected platforms. During this period, your ecosystem reached a total of ${analytics.totalReach.toLocaleString()} unique users with an average engagement quality of ${analytics.averageEngagement.toFixed(2)}%. The data suggests a ${analytics.growthTrend > 0 ? "positive" : "declining"} growth trajectory of ${analytics.growthTrend.toFixed(1)}% overall.`
  const splitSummary = doc.splitTextToSize(summaryText, 170)
  doc.text(splitSummary, 20, 75)

  // Key Performance Indicators Table
  const summaryData = [
    ["Metric", "Current Value", "Performance Description"],
    ["Total Ecosystem Size", analytics.totalFollowers.toLocaleString(), "The aggregate number of unique followers across all connected social channels."],
    ["Engagement Velocity", `${analytics.averageEngagement.toFixed(2)}%`, "Measures the rate at which your audience interacts with content relative to your reach."],
    ["Visibility Index", analytics.totalReach.toLocaleString(), "The total number of times your content was displayed across all platform algorithms."],
    ["Growth Momentum", `${analytics.growthTrend > 0 ? "+" : ""}${analytics.growthTrend.toFixed(1)}%`, "The net percentage change in audience acquisition and retention for this period."],
  ]

  autoTable(doc, {
    startY: 95,
    head: [summaryData[0]],
    body: summaryData.slice(1),
    theme: "striped",
    headStyles: { fillColor: primaryColor },
    styles: { fontSize: 9, cellPadding: 5 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 40 },
      1: { fontStyle: "bold", textColor: primaryColor, cellWidth: 35 },
      2: { fontSize: 8, textColor: lightTextColor }
    }
  })

  // Strategic KPI Explanation
  let currentY = (doc as any).lastAutoTable.finalY + 15
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("Understanding Your KPIs", 20, currentY)
  
  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  const kpiExplanation = "Your 'Engagement Velocity' is the most critical metric in this report. It indicates not just how many people see your content, but how effectively that content drives action. A velocity above 3% is considered industry-standard for healthy brand growth. Your 'Visibility Index' (Reach) shows the raw power of your distribution, while 'Growth Momentum' predicts your future market share."
  const splitKpi = doc.splitTextToSize(kpiExplanation, 170)
  doc.text(splitKpi, 20, currentY + 7)

  // --- PAGE 2: PLATFORM DEEP DIVE ---
  doc.addPage()
  doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
  doc.rect(0, 0, 210, 20, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("PLATFORM INTELLIGENCE & CONTENT ANALYSIS", 20, 13)

  doc.setTextColor(textColor[0], textColor[1], textColor[2])
  doc.setFontSize(18)
  doc.text("2. Comparative Platform Analysis", 20, 35)

  const breakdownData = analytics.platformBreakdown.map((m: any) => [
    m.platform.replace(/_/g, " ").toUpperCase(),
    `${m.engagementRate.toFixed(2)}%`,
    m.reach.toLocaleString(),
    m.followers.toLocaleString(),
    `${m.growthRate > 0 ? "+" : ""}${m.growthRate.toFixed(1)}%`,
  ])

  autoTable(doc, {
    startY: 45,
    head: [["Channel", "Eng. Rate", "Reach", "Audience", "Growth"]],
    body: breakdownData,
    theme: "grid",
    headStyles: { fillColor: secondaryColor },
    styles: { fontSize: 9 },
  })

  currentY = (doc as any).lastAutoTable.finalY + 20
  doc.setFontSize(18)
  doc.text("3. High-Performance Content", 20, currentY)
  
  const postData = analytics.topPosts.slice(0, 5).map((p: any) => [
    p.platform.toUpperCase(),
    p.content.substring(0, 60) + (p.content.length > 60 ? "..." : ""),
    p.likes.toLocaleString(),
    p.engagementScore.toFixed(0)
  ])

  autoTable(doc, {
    startY: currentY + 10,
    head: [["Platform", "Content Excerpt", "Likes", "Impact Score"]],
    body: postData,
    theme: "striped",
    headStyles: { fillColor: [51, 65, 85] }, // Slate-700
    styles: { fontSize: 8 },
    columnStyles: {
      1: { cellWidth: 80 }
    }
  })

  doc.setFontSize(9)
  doc.setFont("helvetica", "italic")
  doc.text("The 'Impact Score' is a weighted metric combining likes (1x), comments (2x), and shares (3x) to measure true virality.", 20, (doc as any).lastAutoTable.finalY + 10)

  // --- PAGE 3: STRATEGIC ROADMAP ---
  doc.addPage()
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.rect(0, 0, 210, 20, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("STRATEGIC RECOMMENDATIONS & GROWTH ROADMAP", 20, 13)

  doc.setTextColor(textColor[0], textColor[1], textColor[2])
  doc.setFontSize(18)
  doc.text("4. Strategic Intelligence Insights", 20, 35)

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  
  analytics.insights.forEach((ins: any, i: number) => {
    const yPos = 45 + (i * 25)
    // Draw a small indicator box
    const color: [number, number, number] = ins.type === "positive" ? [16, 185, 129] : ins.type === "negative" ? [244, 63, 94] : [6, 182, 212]
    doc.setFillColor(color[0], color[1], color[2])
    doc.rect(20, yPos, 2, 15, "F")
    
    doc.setFont("helvetica", "bold")
    doc.text(`${ins.title} (${ins.platform || "Ecosystem"})`, 25, yPos + 4)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(9)
    const desc = doc.splitTextToSize(ins.description, 165)
    doc.text(desc, 25, yPos + 10)
    doc.setFontSize(10)
  })

  currentY = 45 + (analytics.insights.length * 25) + 10
  doc.setFontSize(18)
  doc.setFont("helvetica", "bold")
  doc.text("5. Glossary & Methodology", 20, currentY)
  
  const glossary = [
    ["Engagement Rate", "The percentage of your audience that interacted with your content. Calculated as (Actions / Reach) * 100."],
    ["Reach", "The number of unique users who saw your content at least once in their feed."],
    ["Growth Rate", "The velocity of new follower acquisition relative to your existing audience base."],
    ["Unified Analytics", "Our proprietary engine that normalizes data from different platforms to provide a single source of truth."]
  ]

  autoTable(doc, {
    startY: currentY + 8,
    body: glossary,
    theme: "plain",
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 40 },
      1: { textColor: lightTextColor }
    }
  })

  // Footer for all pages
  const pageCount = (doc as any).internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150)
    doc.text("SocialPulse Intelligence System - Confidential Data", 105, 285, { align: "center" })
    doc.text(`Page ${i} of ${pageCount}`, 190, 285)
    doc.text(`Report ID: ${reportId.substring(0, 8)}...`, 20, 285)
  }

  return doc
}

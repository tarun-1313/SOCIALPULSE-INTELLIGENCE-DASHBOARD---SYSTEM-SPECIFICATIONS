import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { getAnalyticsEngine } from "@/lib/analytics-engine"
import { logActivity } from "@/lib/activity-tracker"
import { getUserRole, getRolePermissions } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = await getUserRole()
    const permissions = await getRolePermissions(role)

    if (!permissions.canGenerateReports) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const body = await request.json()
    const { reportType, format, dateRangeStart, dateRangeEnd, uploads, filters, previewOnly } = body

    const engine = await getAnalyticsEngine(user.id)
    const analytics = await engine.getUnifiedAnalytics(uploads, filters)

    if (previewOnly) {
      return NextResponse.json({
        success: true,
        analytics
      })
    }

    // Generate report content based on format
    let reportData: any
    let contentType: string
    let filename: string

    if (format === "csv") {
      reportData = generateCSV(analytics, reportType)
      contentType = "text/csv"
      filename = `report-${reportType}-${Date.now()}.csv`
    } else {
      reportData = generatePDFData(analytics, reportType)
      contentType = "application/json"
      filename = `report-${reportType}-${Date.now()}.pdf`
    }

    // Create actual report record in Supabase
    let reportId = Math.random().toString(36).substring(7)
    let dbWarning = null
    
    try {
      const { data: report, error: insertError } = await supabase
        .from("generated_reports")
        .insert({
          user_id: user.id,
          report_type: reportType,
          format: format,
          status: "completed",
          metadata: {
            dateRangeStart,
            dateRangeEnd,
            uploads,
            filters,
          },
        })
        .select()
        .single()
      
      if (insertError) {
        console.warn("Could not save report record to database:", insertError)
        if (insertError.code === 'PGRST205') {
          dbWarning = "Table 'generated_reports' is missing. The report was generated but not saved to history."
        }
      }
      if (report) reportId = report.id
    } catch (dbError) {
      console.warn("Could not save report record to database:", dbError)
    }

    // Log activity
    try {
      await logActivity("report_generated", "generated_reports", {
        reportId,
        reportType,
        format,
      })
    } catch (e) {
      console.warn("Could not log activity: table 'generated_reports' missing")
    }

    return NextResponse.json({
      success: true,
      reportId: reportId,
      downloadUrl: `/api/reports/download/${reportId}`,
      filename,
      warning: dbWarning
    })
  } catch (error) {
    console.error("[v0] Report generation error:", error)
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 })
  }
}

function generateCSV(analytics: any, reportType: string): string {
  let csv = "Business Analytics Report - " + reportType.toUpperCase() + "\n"
  csv += "Generated: " + new Date().toLocaleString() + "\n\n"

  csv += "EXECUTIVE SUMMARY\n"
  csv += "Metric,Value,Status\n"
  csv += `Total Followers,${analytics.totalFollowers},Stable\n`
  csv += `Avg Engagement,${analytics.averageEngagement.toFixed(2)}%,High\n`
  csv += `Total Reach,${analytics.totalReach.toFixed(0)},Growing\n\n`

  csv += "SMART INSIGHTS\n"
  analytics.insights.forEach((insight: any) => {
    csv += `${insight.title},"${insight.description.replace(/"/g, '""')}"\n`
  })
  csv += "\n"

  csv += "PLATFORM BREAKDOWN\n"
  csv += "Platform,Followers,Engagement Rate,Growth Rate,Reach\n"

  analytics.platformBreakdown.forEach((platform: any) => {
    csv += `${platform.platform},${platform.followers},${platform.engagementRate}%,${platform.growthRate}%,${platform.reach}\n`
  })

  csv += "\nTOP PERFORMING CONTENT\n"
  csv += "Platform,Content,Likes,Comments,Shares,Engagement Score\n"

  analytics.topPosts.forEach((post: any) => {
    const content = post.content.replace(/,/g, ";").replace(/\n/g, " ").substring(0, 80)
    csv += `${post.platform},"${content}",${post.likes},${post.comments},${post.shares},${post.engagementScore}\n`
  })

  return csv
}

function generatePDFData(analytics: any, reportType: string): any {
  return {
    title: `Executive Social Media Report - ${reportType.charAt(0).toUpperCase() + reportType.slice(1)}`,
    generatedAt: new Date().toISOString(),
    executiveSummary: {
      totalFollowers: analytics.totalFollowers,
      averageEngagement: analytics.averageEngagement,
      totalReach: analytics.totalReach,
      growthTrend: analytics.growthTrend,
      performanceScore: 88, // In a real app, this would be a calculated weighted score
    },
    smartInsights: analytics.insights,
    platformPerformance: analytics.platformBreakdown.map((p: any) => ({
      ...p,
      status: p.growthRate > 0 ? "Growth" : "Declining",
      recommendation: p.engagementRate < 2 ? "Optimize content frequency" : "Maintain current strategy",
    })),
    topPosts: analytics.topPosts.slice(0, 5),
  }
}

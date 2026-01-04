"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileText, Loader2, Download, CheckCircle2, ListFilter, ShieldCheck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export function ReportGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [lastReport, setLastReport] = useState<{ id: string; url: string } | null>(null)
  const [selectedType, setSelectedType] = useState<"weekly" | "monthly">("monthly")
  const { toast } = useToast()
  const router = useRouter()

  async function handleGenerate(format: "pdf" | "csv") {
    setIsGenerating(true)
    setLastReport(null)

    // Retrieve uploaded data from localStorage if available
    let uploads = null
    try {
      const stored = localStorage.getItem("social_dashboard_uploads")
      if (stored) uploads = JSON.parse(stored)
    } catch (e) {
      console.warn("Failed to load uploaded data for report", e)
    }

    try {
      const response = await fetch("/api/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportType: selectedType,
          format,
          dateRangeStart: new Date(
            Date.now() - (selectedType === "weekly" ? 7 : 30) * 24 * 60 * 60 * 1000,
          ).toISOString(),
          dateRangeEnd: new Date().toISOString(),
          uploads, // Pass uploaded data for consistency
        }),
      })

      if (!response.ok) throw new Error("Failed to generate report")

      const data = await response.json()
      setLastReport({ id: data.reportId, url: data.downloadUrl })

      // Dispatch custom event to notify reports list
      window.dispatchEvent(new CustomEvent("report-generated"))

      toast({
        title: "Report Generated Successfully",
        description: `Your ${selectedType} ${format.toUpperCase()} report is ready. It only contains data from your connected platforms.`,
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "There was an error generating your data report. Please check your connections.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="glass p-8 rounded-4xl space-y-8">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white tracking-tight">Automated Report Builder</h3>
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Power BI Export Engine</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
          <ShieldCheck className="size-3" />
          Verified Account Data
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <ListFilter className="size-3" />
              Report Frequency
            </label>
            <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
              <button
                onClick={() => setSelectedType("weekly")}
                className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                  selectedType === "weekly" ? "bg-primary text-white" : "text-zinc-500 hover:text-white"
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setSelectedType("monthly")}
                className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                  selectedType === "monthly" ? "bg-primary text-white" : "text-zinc-500 hover:text-white"
                }`}
              >
                Monthly
              </button>
            </div>
          </div>
          <p className="text-[11px] text-zinc-500 leading-relaxed italic">
            Reports will automatically aggregate data from all your active platform integrations and generate smart
            insights.
          </p>

          <div className="pt-4 space-y-3">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-4">Intelligence Features</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-bold uppercase">
                <div className="size-1.5 rounded-full bg-cyan-500" />
                Data Explanations
              </div>
              <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-bold uppercase">
                <div className="size-1.5 rounded-full bg-purple-500" />
                Strategic Insights
              </div>
              <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-bold uppercase">
                <div className="size-1.5 rounded-full bg-emerald-500" />
                Platform ROI
              </div>
              <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-bold uppercase">
                <div className="size-1.5 rounded-full bg-amber-500" />
                Growth Forecasts
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-end gap-3">
          {lastReport ? (
            <div className="space-y-3 animate-in zoom-in-95 duration-500">
              <a href={lastReport.url} download className="block">
                <Button className="w-full bg-emerald-500 text-white hover:bg-emerald-600 rounded-xl font-bold h-12 gap-2 shadow-lg shadow-emerald-500/20">
                  <Download className="size-4" />
                  Download Your Report
                </Button>
              </a>
              <Button
                variant="ghost"
                onClick={() => setLastReport(null)}
                className="w-full text-xs text-zinc-500 hover:text-white font-bold uppercase"
              >
                Generate Another
              </Button>
            </div>
          ) : (
            <>
              <Button
                onClick={() => handleGenerate("pdf")}
                disabled={isGenerating}
                className="w-full bg-primary text-white hover:bg-primary/90 rounded-xl font-bold h-12 gap-2 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
              >
                {isGenerating ? <Loader2 className="size-5 animate-spin" /> : <FileText className="size-5" />}
                Generate Executive PDF
              </Button>
              <Button
                onClick={() => handleGenerate("csv")}
                disabled={isGenerating}
                variant="outline"
                className="w-full border-white/10 text-white hover:bg-white/5 rounded-xl font-bold h-12 gap-2"
              >
                {isGenerating ? <Loader2 className="size-5 animate-spin" /> : <CheckCircle2 className="size-5" />}
                Download Raw CSV Data
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

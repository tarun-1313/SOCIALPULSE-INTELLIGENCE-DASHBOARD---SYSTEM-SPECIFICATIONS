import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { data: reports, error } = await supabase
      .from("generated_reports")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[Reports List API] Supabase error:", error)
      // Return empty list instead of 500 if table is missing or other DB issue
      // We also include a 'requires_setup' flag so the UI can prompt for table creation if needed
      return NextResponse.json({ 
        reports: [], 
        warning: "Database table 'generated_reports' may be missing.",
        requires_setup: error.code === 'PGRST205'
      })
    }

    return NextResponse.json({ reports: reports || [] })
  } catch (err) {
    console.error("[Reports List API] Unexpected error:", err)
    return NextResponse.json({ reports: [] }, { status: 500 })
  }
}

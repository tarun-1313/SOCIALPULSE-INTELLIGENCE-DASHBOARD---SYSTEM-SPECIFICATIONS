import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next") ?? "/dashboard"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // After successful exchange, we might want to record the connection
      // in our social_media_connections table if it's an OAuth link
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Try to identify which platform was just connected
        // This is a bit tricky with Supabase's default OAuth as it doesn't 
        // easily tell you which provider was used in the callback without state.
        // But for this demo/dashboard, we can assume the user is redirected back
        // to settings or dashboard.
        
        // Optional: Update social_media_connections table here
      }

      return NextResponse.redirect(`${requestUrl.origin}${next}`)
    }
    
    console.error("Auth callback error:", error)
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${requestUrl.origin}/login?error=Could not authenticate user`)
}
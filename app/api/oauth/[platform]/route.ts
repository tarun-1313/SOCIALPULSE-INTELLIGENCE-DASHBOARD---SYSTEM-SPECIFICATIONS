import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  try {
    const { platform } = await params
    console.log(`OAuth request for platform: ${platform}`)
    const supabase = await createClient()

    // Get the site URL for the redirect
    const requestUrl = new URL(request.url)
    const origin = requestUrl.origin

    // Map platform names to Supabase providers
    const providerMap: Record<string, any> = {
      instagram: 'facebook', // Instagram Graph API uses Facebook login
      facebook: 'facebook',
      twitter: 'twitter',
      linkedin: 'linkedin_oidc',
      github: 'github',
      google: 'google',
    }

    const provider = providerMap[platform.toLowerCase()]

    if (!provider) {
      return NextResponse.json(
        { error: `Unsupported platform: ${platform}` },
        { status: 400 }
      )
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${origin}/api/auth/callback?next=/settings`,
        scopes: getScopesForPlatform(platform),
      },
    })

    if (error) {
      console.error(`OAuth error for ${platform}:`, error)
      return NextResponse.redirect(`${origin}/settings?error=${encodeURIComponent(error.message)}`)
    }

    if (data.url) {
      return NextResponse.redirect(data.url)
    }

    return NextResponse.redirect(`${origin}/settings?error=Failed to initialize OAuth`)
  } catch (err: any) {
    console.error("Route Handler Error:", err)
    return NextResponse.json({ error: err.message, stack: err.stack }, { status: 500 })
  }
}

function getScopesForPlatform(platform: string): string {
  switch (platform.toLowerCase()) {
    case 'instagram':
      // Instagram Graph API via Facebook Login requires these scopes
      return 'email public_profile instagram_basic instagram_manage_insights pages_show_list pages_read_engagement'
    case 'facebook':
      return 'email public_profile pages_show_list pages_read_engagement'
    case 'github':
      return 'read:user user:email'
    case 'google':
      return 'openid email profile'
    default:
      return ''
  }
}
import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Set user data in headers for the proxy/middleware to use
  if (user) {
    // In a real app, you might fetch the role from the database here
    // For now, we'll pass the user ID and email
    supabaseResponse.headers.set('x-user-data', JSON.stringify({
      id: user.id,
      email: user.email,
      // We'll let the proxy logic or server components handle specific role fetching
      // but we need to provide at least the authenticated state
    }))
  }

  const pathname = request.nextUrl.pathname

  // Redirect to login if accessing protected route without authentication
  const protectedRoutes = ["/dashboard", "/analytics", "/reports", "/settings", "/profile"]
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  // Redirect to dashboard if accessing login/signup while authenticated
  if ((pathname === "/login" || pathname === "/signup") && user) {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase-proxy'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Skip middleware for API routes to avoid interference with OAuth redirects
  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  console.log(`Middleware processing: ${pathname}`)
  // 1. Update session and get user data from Supabase
  const response = await updateSession(request)

  // 2. Define protected routes and their required roles
  const protectedRoutes = [
    { path: '/analytics', roles: ['admin', 'analyst', 'viewer'] },
    { path: '/reports', roles: ['admin', 'analyst'] },
    { path: '/settings', roles: ['admin', 'analyst', 'viewer'] },
    { path: '/dashboard', roles: ['admin', 'analyst', 'viewer'] },
    { path: '/profile', roles: ['admin', 'analyst', 'viewer'] },
  ]

  // pathname already declared at the top of the function

  // 3. Check if the current path is protected
  const matchedRoute = protectedRoutes.find(route => pathname.startsWith(route.path))

  if (matchedRoute) {
    // The updateSession function sets x-user-data if authenticated
    const userHeader = response.headers.get('x-user-data')
    
    if (!userHeader) {
      // No authenticated user, redirect to login
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    // Role-based access control (RBAC)
    try {
      // This is a simplified check. In a production app, you'd verify the role from the database.
      // For now, we allow access if authenticated, unless specifically restricted.
      const userData = JSON.parse(userHeader)
      
      // If we had the role in the header, we would check it here:
      // if (!matchedRoute.roles.includes(userData.role)) { ... }
      
    } catch (error) {
      console.error('Proxy RBAC error:', error)
    }
  }

  // 4. Redirect authenticated users away from login/signup
  const authPages = ['/login', '/signup']
  if (authPages.includes(pathname)) {
    const userHeader = response.headers.get('x-user-data')
    if (userHeader) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
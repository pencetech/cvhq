import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';
import type { Database } from '@/types/supabase';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req, res })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // if user is signed in and the current path is / redirect the user to /dashboard
  if (user) {

    if (req.nextUrl.pathname === '/dashboard' || req.nextUrl.pathname === '/' || req.nextUrl.pathname === '/login') {
      return NextResponse.redirect(new URL('/dashboard/home', req.url))
    }
  }
  // if user is not signed in and the current path is not / redirect the user to /login
  if (!user && req.nextUrl.pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image).*)'],
}
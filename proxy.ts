import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE } from '@/lib/admin-session'
import { isServiceGuardExcludedPath, isWebsiteServiceAvailable } from '@/lib/service-status'
import { protectPreviewResponse } from '@/lib/site-content/preview-protection'

const PREVIEW_COOKIE = '__Host-hq-site-preview'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasPreview = request.cookies.has(PREVIEW_COOKIE)

  const isAdminPublic = pathname === '/admin/login' || pathname.startsWith('/admin/login/') || pathname === '/admin/logout' || pathname.startsWith('/admin/logout/')
  if (!isAdminPublic && (pathname === '/admin' || pathname.startsWith('/admin/')) && !request.cookies.get(SESSION_COOKIE)?.value) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    url.searchParams.set('reason', 'unauthorized')
    const response = NextResponse.redirect(url)
    protectPreviewResponse(response.headers, hasPreview)
    return response
  }

  if (!isServiceGuardExcludedPath(pathname)) {
    const available = await isWebsiteServiceAvailable(request)
    if (!available) {
      const response = NextResponse.rewrite(new URL('/service-expired', request.url))
      protectPreviewResponse(response.headers, hasPreview)
      return response
    }
  }

  const response = NextResponse.next()
  protectPreviewResponse(response.headers, hasPreview)
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?)$).*)'],
}

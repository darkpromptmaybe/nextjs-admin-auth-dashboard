import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to login page and API routes
        if (req.nextUrl.pathname === '/login' || req.nextUrl.pathname.startsWith('/api')) {
          return true
        }
        
        // Protect dashboard routes - require authentication
        if (req.nextUrl.pathname.startsWith('/dashboard')) {
          return !!token
        }
        
        // Allow access to public routes
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
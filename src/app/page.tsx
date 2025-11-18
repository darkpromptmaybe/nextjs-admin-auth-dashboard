'use client'

import { useSession } from 'next-auth/react'
import { AuthButton } from '@/components/auth'

export default function Home() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              {session ? `Welcome back, ${session.user?.name || 'Admin'}!` : 'Welcome to NextAuth Admin'}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {session 
                ? 'Your admin dashboard is ready. Access all your management tools from the navigation menu.'
                : 'A powerful admin dashboard with authentication and dynamic navigation'
              }
            </p>
            <div className="flex justify-center space-x-4">
              {session ? (
                <div className="space-x-4">
                  <a
                    href="/home"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Go to Dashboard
                  </a>
                  <a
                    href="/navbar-management"
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Manage Navigation
                  </a>
                </div>
              ) : (
                <AuthButton />
              )}
            </div>
          </div>

          {/* Features Section */}
          <div id="about" className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">About Us</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Secure Authentication</h3>
                <p className="text-gray-600">Built with NextAuth.js for robust and secure user authentication</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Dynamic Navigation</h3>
                <p className="text-gray-600">Database-driven navbar management with sections and customization</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Modern Stack</h3>
                <p className="text-gray-600">Next.js 16, TypeScript, Tailwind CSS, and PostgreSQL</p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div id="contact" className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Contact Us</h2>
            <p className="text-lg text-gray-600 mb-6">
              Ready to get started? Contact us for more information.
            </p>
            <div className="flex justify-center">
              <AuthButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

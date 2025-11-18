'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { StackAuthInfo } from '@/components/StackAuthInfo'
import { DatabaseTest } from '@/components/DatabaseTest'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Still loading

    if (!session) {
      router.push('/login')
    }
  }, [session, status, router])

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

  if (!session) {
    return null // Will redirect to login
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                {session.user?.image && (
                  <img
                    className="h-8 w-8 rounded-full"
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                  />
                )}
                <div className="text-sm">
                  <p className="text-gray-900 font-medium">
                    {session.user?.name || 'User'}
                  </p>
                  <p className="text-gray-500">
                    {session.user?.email}
                  </p>
                </div>
              </div>
              <a
                href="/users"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Manage Users
              </a>
              <button
                onClick={handleSignOut}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to the Admin Dashboard!
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                You are successfully authenticated with NextAuth.
              </p>
              
              {/* User Info Card */}
              <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  NextAuth Session Information
                </h3>
                <div className="space-y-3 text-left">
                  <div>
                    <span className="font-medium text-gray-700">Name:</span>
                    <span className="ml-2 text-gray-600">
                      {session.user?.name || 'Not provided'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>
                    <span className="ml-2 text-gray-600">
                      {session.user?.email || 'Not provided'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Role:</span>
                    <span className="ml-2 text-gray-600">
                      {(session.user as any)?.role || 'user'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Provider:</span>
                    <span className="ml-2 text-gray-600">
                      {session.user?.image ? 'OAuth' : 'Credentials'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stack Auth Info */}
              <div className="max-w-md mx-auto mb-6">
                <StackAuthInfo />
              </div>

              {/* Database Test */}
              <div className="max-w-2xl mx-auto mb-6">
                <DatabaseTest />
              </div>

              {/* Quick Actions */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Users</h4>
                  <p className="text-gray-600 text-sm mb-3">Manage user accounts and permissions</p>
                  <a
                    href="/users"
                    className="block w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition text-center"
                  >
                    Manage Users
                  </a>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Database</h4>
                  <p className="text-gray-600 text-sm mb-3">Test database connections and setup</p>
                  <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
                    Test Database
                  </button>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Settings</h4>
                  <p className="text-gray-600 text-sm mb-3">Configure application settings</p>
                  <button className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition">
                    Open Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
'use client';

import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function SimpleNavbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  // Don't show navbar on login page
  if (pathname === '/login' || !session) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/home" className="text-xl font-bold text-gray-900">
              NextAuth Admin
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link href="/home" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
              Home
            </Link>
            <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
              Dashboard
            </Link>
            <Link href="/users" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
              Users
            </Link>
            <Link href="/settings" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
              Settings
            </Link>

            {/* User Info */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {session?.user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
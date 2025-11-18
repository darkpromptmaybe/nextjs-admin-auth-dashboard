'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { 
  FaHome, 
  FaUsers, 
  FaChartBar, 
  FaCog, 
  FaDatabase,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUserCircle
} from 'react-icons/fa';

interface NavbarProps {
  children: React.ReactNode;
}

export default function Navbar({ children }: NavbarProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Don't show navbar on login page or if not authenticated
  if (pathname === '/login' || !session) {
    return <>{children}</>;
  }

  const navigation = [
    { name: 'Home', href: '/home', icon: FaHome },
    { name: 'Dashboard', href: '/dashboard', icon: FaChartBar },
    { name: 'Users', href: '/users', icon: FaUsers },
    { name: 'Database', href: '/api/database/test', icon: FaDatabase },
    { name: 'Settings', href: '/settings', icon: FaCog },
  ];

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and brand */}
            <div className="flex items-center">
              <Link href="/home" className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">NA</span>
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">NextAuth Admin</span>
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* User menu */}
            <div className="flex items-center space-x-4">
              {/* User info */}
              <div className="hidden md:flex items-center space-x-3">
                {session?.user?.image ? (
                  <img
                    className="h-8 w-8 rounded-full"
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                  />
                ) : (
                  <FaUserCircle className="h-8 w-8 text-gray-400" />
                )}
                <div className="hidden lg:block">
                  <p className="text-sm font-medium text-gray-900">
                    {session?.user?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {session?.user?.email}
                  </p>
                </div>
              </div>

              {/* Sign out button */}
              <button
                onClick={handleSignOut}
                className="hidden md:flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-200"
              >
                <FaSignOutAlt className="h-4 w-4 mr-2" />
                Sign Out
              </button>

              {/* Mobile menu button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {isMobileMenuOpen ? (
                  <FaTimes className="h-6 w-6" />
                ) : (
                  <FaBars className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                      isActive
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
            
            {/* Mobile user info and sign out */}
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-5">
                {session?.user?.image ? (
                  <img
                    className="h-10 w-10 rounded-full"
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                  />
                ) : (
                  <FaUserCircle className="h-10 w-10 text-gray-400" />
                )}
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {session?.user?.name || 'User'}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {session?.user?.email}
                  </div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center px-3 py-2 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200"
                >
                  <FaSignOutAlt className="h-5 w-5 mr-3" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main content */}
      <main>
        {children}
      </main>
    </div>
  );
}
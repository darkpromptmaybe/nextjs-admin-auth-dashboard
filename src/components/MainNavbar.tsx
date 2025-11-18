'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';

interface NavbarItem {
  id: number;
  name: string;
  href: string;
  order: number;
  isActive: boolean;
  isPublic: boolean;
  icon?: string;
}

export default function MainNavbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [publicNavItems, setPublicNavItems] = useState<NavbarItem[]>([]);
  const [dashboardNavItems, setDashboardNavItems] = useState<NavbarItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch navbar items from database
  useEffect(() => {
    const fetchNavbarItems = async () => {
      try {
        // Fetch public navbar items
        const publicResponse = await fetch('/api/navbar?type=public');
        if (publicResponse.ok) {
          const publicData = await publicResponse.json();
          // Handle new API response structure
          const publicItems = publicData.success ? publicData.data.data : [];
          setPublicNavItems(Array.isArray(publicItems) ? publicItems : []);
        }

        // Fetch dashboard navbar items
        const dashboardResponse = await fetch('/api/navbar?type=dashboard');
        if (dashboardResponse.ok) {
          const dashboardData = await dashboardResponse.json();
          // Handle new API response structure
          const dashboardItems = dashboardData.success ? dashboardData.data.data : [];
          setDashboardNavItems(Array.isArray(dashboardItems) ? dashboardItems : []);
        }
      } catch (error) {
        console.error('Error fetching navbar items:', error);
        // Fallback to default items
        setPublicNavItems([
          { id: 1, name: 'Features', href: '#features', order: 1, isActive: true, isPublic: true },
          { id: 2, name: 'About', href: '#about', order: 2, isActive: true, isPublic: true },
          { id: 3, name: 'Demo', href: '#demo', order: 3, isActive: true, isPublic: true },
        ]);
        setDashboardNavItems([
          { id: 4, name: 'Overview', href: '/home', order: 1, isActive: true, isPublic: false },
          { id: 5, name: 'User Management', href: '/users', order: 2, isActive: true, isPublic: false },
          { id: 6, name: 'Navbar Management', href: '/navbar-management', order: 3, isActive: true, isPublic: false },
          { id: 7, name: 'Reports', href: '/reports', order: 4, isActive: true, isPublic: false },
          { id: 8, name: 'Analytics', href: '/analytics', order: 5, isActive: true, isPublic: false },
          { id: 9, name: 'System Settings', href: '/settings', order: 6, isActive: true, isPublic: false },
          { id: 10, name: 'Logs', href: '/logs', order: 7, isActive: true, isPublic: false },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchNavbarItems();
  }, []);

  // Always show navbar - determine which navigation items to show based on authentication
  // Show public navbar for unauthenticated users or on landing page
  // Show dashboard navbar for authenticated users on dashboard pages
  
  if (loading) {
    return (
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="text-gray-500">Loading navigation...</div>
          </div>
        </div>
      </nav>
    );
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  // Determine navigation type based on authentication and current page
  const isPublicPage = !session || pathname === '/';
  const isDashboardPage = session && (
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/home') ||
    pathname.startsWith('/users') ||
    pathname.startsWith('/reports') ||
    pathname.startsWith('/analytics') ||
    pathname.startsWith('/navbar-management') ||
    pathname.startsWith('/settings') ||
    pathname.startsWith('/logs')
  );

  // Add Home link to dashboard navigation for authenticated users to access landing page
  const dashboardNavWithHome = session ? [
    { id: 0, name: 'Home', href: '/', order: 0, isActive: true, isPublic: false, icon: 'FaHome' },
    ...dashboardNavItems
  ] : dashboardNavItems;

  const navigation = isPublicPage && !session ? publicNavItems : dashboardNavWithHome;
  
  // Ensure navigation is always an array
  const safeNavigation = Array.isArray(navigation) ? navigation : [];
  const brandText = session ? "Admin Dashboard" : "NextAuth Admin";
  const brandHref = "/";

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Brand */}
          <div className="flex items-center">
            <Link href={brandHref} className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">NA</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">
                {brandText}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {safeNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}

            {/* Auth Section */}
            {session ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {session?.user?.image ? (
                    <img
                      className="h-8 w-8 rounded-full"
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                    />
                  ) : (
                    <FaUser className="h-6 w-6 text-gray-400" />
                  )}
                  <span className="text-sm text-gray-700">{session?.user?.name || 'User'}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-200"
                >
                  <FaSignOutAlt className="h-4 w-4 mr-2" />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/api/auth/signin"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {session ? (
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {isMobileMenuOpen ? (
                  <FaTimes className="h-6 w-6" />
                ) : (
                  <FaBars className="h-6 w-6" />
                )}
              </button>
            ) : (
              <Link
                href="/api/auth/signin"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && session && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {safeNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              >
                {item.name}
              </Link>
            ))}

            {/* Mobile Auth Section */}
            <div className="px-3 py-2">
              <div className="flex items-center space-x-2 mb-2">
                {session?.user?.image ? (
                  <img
                    className="h-8 w-8 rounded-full"
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                  />
                ) : (
                  <FaUser className="h-6 w-6 text-gray-400" />
                )}
                <span className="text-sm text-gray-700">{session?.user?.name || 'User'}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
              >
                <FaSignOutAlt className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
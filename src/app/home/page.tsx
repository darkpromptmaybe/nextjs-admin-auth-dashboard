'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FaUsers, FaDatabase, FaCog, FaChartBar, FaShieldAlt, FaHome } from 'react-icons/fa';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const stats = [
    {
      name: 'Total Users',
      value: '1,234',
      change: '+12%',
      changeType: 'increase',
      icon: FaUsers,
      color: 'bg-blue-500'
    },
    {
      name: 'Active Sessions',
      value: '89',
      change: '+5%',
      changeType: 'increase',
      icon: FaShieldAlt,
      color: 'bg-green-500'
    },
    {
      name: 'System Health',
      value: '99.9%',
      change: '0%',
      changeType: 'neutral',
      icon: FaDatabase,
      color: 'bg-purple-500'
    },
    {
      name: 'Performance',
      value: 'Excellent',
      change: '+2%',
      changeType: 'increase',
      icon: FaChartBar,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <FaHome className="mx-auto h-16 w-16 mb-4" />
            <h1 className="text-4xl font-bold mb-4">
              Welcome to Your Admin Dashboard
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Manage your application with powerful tools and comprehensive insights. 
              Monitor users, track performance, and maintain your system all in one place.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <span className={`ml-2 text-sm font-medium ${
                      stat.changeType === 'increase' ? 'text-green-600' : 
                      stat.changeType === 'decrease' ? 'text-red-600' : 
                      'text-gray-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="space-y-4">
              <button
                onClick={() => router.push('/users')}
                className="w-full flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <FaUsers className="h-8 w-8 text-blue-600 mr-4" />
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">Manage Users</h3>
                  <p className="text-sm text-gray-600">Add, edit, or remove user accounts</p>
                </div>
              </button>
              
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <FaChartBar className="h-8 w-8 text-green-600 mr-4" />
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">View Analytics</h3>
                  <p className="text-sm text-gray-600">Monitor system performance and usage</p>
                </div>
              </button>
              
              <button className="w-full flex items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                <FaCog className="h-8 w-8 text-purple-600 mr-4" />
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">System Settings</h3>
                  <p className="text-sm text-gray-600">Configure application preferences</p>
                </div>
              </button>
              
              <button className="w-full flex items-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                <FaDatabase className="h-8 w-8 text-orange-600 mr-4" />
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">Database Tools</h3>
                  <p className="text-sm text-gray-600">Test connections and manage data</p>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="bg-blue-500 p-2 rounded-full mr-3">
                  <FaUsers className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New user registered</p>
                  <p className="text-xs text-gray-600">2 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="bg-green-500 p-2 rounded-full mr-3">
                  <FaShieldAlt className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Security scan completed</p>
                  <p className="text-xs text-gray-600">15 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="bg-purple-500 p-2 rounded-full mr-3">
                  <FaDatabase className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Database backup created</p>
                  <p className="text-xs text-gray-600">1 hour ago</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="bg-orange-500 p-2 rounded-full mr-3">
                  <FaCog className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">System settings updated</p>
                  <p className="text-xs text-gray-600">3 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
          <h2 className="text-xl font-bold mb-2">Hello, {session.user?.name || 'Admin'}!</h2>
          <p className="text-blue-100">
            You're logged in as {session.user?.email}. Your system is running smoothly and all services are operational.
          </p>
        </div>
      </div>
    </div>
  );
}
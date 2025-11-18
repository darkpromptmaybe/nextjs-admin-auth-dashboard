'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AnalyticsPage() {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Analytics Dashboard</h1>
          <p className="text-lg text-gray-600 mb-8">
            Real-time analytics and insights for your application.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
              <h3 className="text-xl font-semibold mb-2">Total Page Views</h3>
              <p className="text-3xl font-bold">124,567</p>
              <p className="text-blue-100">+15% from last month</p>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-lg p-6 text-white">
              <h3 className="text-xl font-semibold mb-2">Active Users</h3>
              <p className="text-3xl font-bold">8,432</p>
              <p className="text-green-100">+8% from last week</p>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-lg p-6 text-white">
              <h3 className="text-xl font-semibold mb-2">Conversion Rate</h3>
              <p className="text-3xl font-bold">3.2%</p>
              <p className="text-orange-100">+0.3% improvement</p>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg p-6 text-white">
              <h3 className="text-xl font-semibold mb-2">Revenue</h3>
              <p className="text-3xl font-bold">$45,230</p>
              <p className="text-purple-100">+12% this quarter</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-600">Analytics charts and detailed reports would be displayed here.</p>
              <p className="text-sm text-gray-500 mt-2">Integration with analytics services like Google Analytics, Mixpanel, etc.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
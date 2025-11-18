'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ReportsPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Reports</h1>
          <p className="text-lg text-gray-600 mb-8">
            Generate and view various system reports and analytics.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">User Activity Report</h3>
              <p className="text-gray-600 mb-4">Track user engagement and activity patterns.</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">
                Generate Report
              </button>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">System Performance</h3>
              <p className="text-gray-600 mb-4">Monitor system performance and resource usage.</p>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm">
                View Metrics
              </button>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Security Audit</h3>
              <p className="text-gray-600 mb-4">Review security events and access logs.</p>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm">
                Run Audit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
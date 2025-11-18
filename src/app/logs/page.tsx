'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LogsPage() {
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

  const sampleLogs = [
    { id: 1, timestamp: '2024-11-19 14:30:15', level: 'INFO', message: 'User login successful', user: 'admin@example.com' },
    { id: 2, timestamp: '2024-11-19 14:28:42', level: 'WARN', message: 'Failed login attempt', user: 'unknown@test.com' },
    { id: 3, timestamp: '2024-11-19 14:25:33', level: 'INFO', message: 'Database backup completed', user: 'system' },
    { id: 4, timestamp: '2024-11-19 14:20:18', level: 'ERROR', message: 'API rate limit exceeded', user: 'api_client_123' },
    { id: 5, timestamp: '2024-11-19 14:15:07', level: 'INFO', message: 'New user registered', user: 'newuser@example.com' },
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR':
        return 'bg-red-100 text-red-800';
      case 'WARN':
        return 'bg-yellow-100 text-yellow-800';
      case 'INFO':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">System Logs</h1>
          <p className="text-lg text-gray-600 mb-8">
            Monitor system events, errors, and user activities.
          </p>

          <div className="flex flex-wrap gap-4 mb-6">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">
              All Logs
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm">
              Errors Only
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm">
              User Activity
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm">
              System Events
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User/Source
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sampleLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.timestamp}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(log.level)}`}>
                        {log.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {log.message}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.user}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <p className="text-sm text-gray-700">
              Showing 1-5 of 1,234 logs
            </p>
            <div className="flex space-x-2">
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm">
                Previous
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
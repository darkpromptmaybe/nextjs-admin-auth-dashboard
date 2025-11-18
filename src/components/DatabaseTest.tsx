'use client'

import { useState } from 'react';

interface DatabaseTestResult {
  success: boolean;
  message: string;
  connection?: {
    status: string;
    timestamp: string;
    version: string;
  };
  table?: {
    created: boolean;
    message: string;
  };
  users?: {
    count: number;
    message: string;
  };
  error?: string;
}

export function DatabaseTest() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<DatabaseTestResult | null>(null);

  const testDatabase = async () => {
    setTesting(true);
    setResult(null);

    try {
      const response = await fetch('/api/database/test');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        message: 'Failed to connect to test API',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setTesting(false);
    }
  };

  const createTable = async () => {
    setTesting(true);
    
    try {
      const response = await fetch('/api/database/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'create-table' })
      });
      const data = await response.json();
      
      // Refresh full test after table creation
      if (data.success) {
        await testDatabase();
      } else {
        setResult(data);
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Failed to create table',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Database Test (Neon PostgreSQL)
      </h3>
      
      <div className="space-y-4">
        <div className="flex gap-3">
          <button
            onClick={testDatabase}
            disabled={testing}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded text-sm font-medium"
          >
            {testing ? 'Testing...' : 'Test Connection'}
          </button>
          
          <button
            onClick={createTable}
            disabled={testing}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded text-sm font-medium"
          >
            {testing ? 'Creating...' : 'Create Users Table'}
          </button>
        </div>

        {result && (
          <div className={`p-4 rounded-lg border ${
            result.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center mb-2">
              <div className={`w-3 h-3 rounded-full mr-2 ${
                result.success ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className={`font-medium ${
                result.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {result.message}
              </span>
            </div>

            {result.success && result.connection && (
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-green-700">Status:</span>
                  <span className="ml-2 text-green-600">{result.connection.status}</span>
                </div>
                <div>
                  <span className="font-medium text-green-700">Timestamp:</span>
                  <span className="ml-2 text-green-600 font-mono text-xs">
                    {new Date(result.connection.timestamp).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-green-700">Database Version:</span>
                  <span className="ml-2 text-green-600 text-xs">
                    {result.connection.version}
                  </span>
                </div>
                
                {result.table && (
                  <div>
                    <span className="font-medium text-green-700">Users Table:</span>
                    <span className="ml-2 text-green-600">
                      {result.table.created ? 'Created/Exists' : 'Not Created'}
                    </span>
                  </div>
                )}
                
                {result.users && (
                  <div>
                    <span className="font-medium text-green-700">Users Count:</span>
                    <span className="ml-2 text-green-600">{result.users.count}</span>
                  </div>
                )}
              </div>
            )}

            {!result.success && result.error && (
              <div className="mt-2">
                <span className="font-medium text-red-700">Error:</span>
                <pre className="mt-1 text-xs text-red-600 bg-red-100 p-2 rounded overflow-auto">
                  {result.error}
                </pre>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
          <div className="font-medium mb-1">Database Info:</div>
          <div>Host: Neon (ep-damp-block-adq5zuc3-pooler.c-2.us-east-1.aws.neon.tech)</div>
          <div>Database: neondb</div>
          <div>SSL: Required</div>
          <div>Connection Pool: Enabled</div>
        </div>
      </div>
    </div>
  );
}
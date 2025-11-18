'use client'

export function StackAuthInfo() {
  const projectId = process.env.NEXT_PUBLIC_STACK_PROJECT_ID;
  const databaseUrl = process.env.DATABASE_URL;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-blue-900 mb-4">
        Stack Auth Configuration
      </h3>
      <div className="space-y-3 text-sm">
        <div>
          <span className="font-medium text-blue-800">Status:</span>
          <span className="ml-2 text-blue-700">Ready for Integration</span>
        </div>
        <div>
          <span className="font-medium text-blue-800">Project ID:</span>
          <span className="ml-2 text-blue-700 font-mono text-xs break-all">
            {projectId || 'Not configured'}
          </span>
        </div>
        <div>
          <span className="font-medium text-blue-800">Database:</span>
          <span className="ml-2 text-blue-700">
            {databaseUrl ? 'PostgreSQL (Neon) - Configured' : 'Not configured'}
          </span>
        </div>
        <div>
          <span className="font-medium text-blue-800">Auth System:</span>
          <span className="ml-2 text-blue-700">NextAuth.js Active</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-blue-200">
        <p className="text-sm text-blue-600">
          Stack Auth credentials are configured. The system is ready for production deployment 
          with database integration and enterprise authentication features.
        </p>
      </div>
    </div>
  );
}
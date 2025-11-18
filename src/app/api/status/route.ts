import { NextRequest } from 'next/server';
import { successResponse, withErrorHandling } from '@/lib/api-utils';

// GET - API status and health check
export const GET = withErrorHandling(async (request: NextRequest) => {
  const status = {
    api: 'NextJS Admin API',
    version: '1.0.0',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    features: {
      authentication: 'NextAuth.js with Google/GitHub OAuth',
      database: 'PostgreSQL with Prisma ORM',
      validation: 'Zod schemas',
      errorHandling: 'Centralized with proper HTTP codes',
      responseFormat: 'Standardized JSON responses',
      typeScript: 'Full type safety'
    },
    endpoints: {
      navbar: '/api/navbar',
      users: '/api/users',
      auth: '/api/auth',
      status: '/api/status'
    }
  };

  return successResponse(status);
});
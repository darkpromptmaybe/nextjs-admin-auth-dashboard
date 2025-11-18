import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { ApiResponse, ApiError, ApiErrorCode } from '@/types/api';
import { ZodSchema, ZodError } from 'zod';

// Response helper functions
export function successResponse<T>(
  data: T, 
  statusCode: number = 200,
  message?: string
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    message,
    statusCode
  }, { status: statusCode });
}

export function errorResponse(
  error: string | ApiError,
  statusCode?: number
): NextResponse<ApiResponse> {
  if (error instanceof ApiError) {
    return NextResponse.json({
      success: false,
      error: error.message,
      statusCode: error.statusCode
    }, { status: error.statusCode });
  }

  return NextResponse.json({
    success: false,
    error: typeof error === 'string' ? error : 'Internal server error',
    statusCode: statusCode || 500
  }, { status: statusCode || 500 });
}

// Authentication middleware
export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new ApiError(401, ApiErrorCode.UNAUTHORIZED, 'Authentication required');
  }
  return session;
}

// Request validation for body data
export async function validateRequest<T>(
  schema: ZodSchema<T>,
  data: unknown
): Promise<T> {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ApiError(
        400,
        ApiErrorCode.VALIDATION_ERROR,
        'Validation failed',
        error.issues
      );
    }
    throw new ApiError(400, ApiErrorCode.BAD_REQUEST, 'Invalid request data');
  }
}

// Parse query parameters with validation
export async function validateQuery<T>(
  schema: ZodSchema<T>,
  url: string
): Promise<T> {
  try {
    const urlObj = new URL(url);
    const queryParams: any = {};
    
    // Convert URLSearchParams to plain object with type conversion
    urlObj.searchParams.forEach((value, key) => {
      // Try to convert numbers
      if (!isNaN(Number(value)) && value !== '') {
        queryParams[key] = Number(value);
      } else {
        queryParams[key] = value;
      }
    });
    
    return schema.parse(queryParams);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ApiError(
        400,
        ApiErrorCode.VALIDATION_ERROR,
        'Invalid query parameters',
        error.issues
      );
    }
    throw new ApiError(400, ApiErrorCode.BAD_REQUEST, 'Invalid query format');
  }
}

// Error handler wrapper
export function withErrorHandling(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    try {
      return await handler(request, context);
    } catch (error) {
      console.error('API Error:', error);
      
      if (error instanceof ApiError) {
        return errorResponse(error);
      }
      
      return errorResponse(
        new ApiError(500, ApiErrorCode.INTERNAL_SERVER_ERROR, 'Internal server error')
      );
    }
  };
}

// Pagination helper
export function createPaginationMeta(
  page: number,
  limit: number,
  total: number
) {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1
  };
}

// Rate limiting (simple implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 60 * 1000 // 1 minute
): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
}

// CORS helper
export function setCorsHeaders(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}
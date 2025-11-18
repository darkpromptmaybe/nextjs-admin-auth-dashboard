import { NextRequest } from 'next/server';
import { 
  getUsers, 
  createUser, 
  updateUser, 
  deleteUser 
} from '@/lib/users';
import { 
  successResponse, 
  requireAuth, 
  validateRequest,
  validateQuery,
  withErrorHandling 
} from '@/lib/api-utils';
import { 
  getUsersQuerySchema,
  createUserSchema, 
  updateUserSchema, 
  deleteUserSchema 
} from '@/schemas/users';
import { ApiError, ApiErrorCode } from '@/types/api';

// GET /api/users - Get all users with pagination and filtering
export const GET = withErrorHandling(async (request: NextRequest) => {
  await requireAuth(); // Require authentication for user management
  
  const validatedQuery = await validateQuery(getUsersQuerySchema, request.url);
  
  const result = await getUsers(validatedQuery);
  
  if (!result.success) {
    throw new ApiError(500, ApiErrorCode.INTERNAL_SERVER_ERROR, result.error || 'Failed to fetch users');
  }
  
  return successResponse({
    users: result.users,
    pagination: result.pagination
  });
});

// POST /api/users - Create new user
export const POST = withErrorHandling(async (request: NextRequest) => {
  await requireAuth(); // Require authentication for user creation
  
  const body = await request.json();
  const validatedData = await validateRequest(createUserSchema, body);
  
  const result = await createUser(validatedData);
  
  if (!result.success) {
    throw new ApiError(400, ApiErrorCode.BAD_REQUEST, result.message || 'Failed to create user');
  }
  
  return successResponse({
    user: result.user,
    message: result.message
  }, 201);
});

// PUT /api/users - Update user
export const PUT = withErrorHandling(async (request: NextRequest) => {
  await requireAuth(); // Require authentication for user updates
  
  const body = await request.json();
  
  // Convert id to number if it's a string
  if (body.id && typeof body.id === 'string') {
    body.id = parseInt(body.id);
  }
  
  const validatedData = await validateRequest(updateUserSchema, body);
  
  const { id, ...updateData } = validatedData;
  
  const result = await updateUser(id, updateData);
  
  if (!result.success) {
    if (result.error?.includes('not found')) {
      throw new ApiError(404, ApiErrorCode.NOT_FOUND, result.message || 'User not found');
    }
    throw new ApiError(400, ApiErrorCode.BAD_REQUEST, result.message || 'Failed to update user');
  }
  
  return successResponse({
    user: result.user,
    message: result.message
  });
});

// DELETE /api/users - Delete user
export const DELETE = withErrorHandling(async (request: NextRequest) => {
  await requireAuth(); // Require authentication for user deletion
  
  const body = await request.json();
  
  // Convert id to number if it's a string
  if (body.id && typeof body.id === 'string') {
    body.id = parseInt(body.id);
  }
  
  const validatedData = await validateRequest(deleteUserSchema, body);
  
  const result = await deleteUser(validatedData.id);
  
  if (!result.success) {
    if (result.error?.includes('not found')) {
      throw new ApiError(404, ApiErrorCode.NOT_FOUND, result.message || 'User not found');
    }
    throw new ApiError(400, ApiErrorCode.BAD_REQUEST, result.message || 'Failed to delete user');
  }
  
  return successResponse({
    message: result.message
  });
});
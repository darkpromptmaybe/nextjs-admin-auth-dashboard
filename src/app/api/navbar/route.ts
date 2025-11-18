import { NextRequest } from 'next/server';
import { 
  getNavbarItems, 
  addNavbarItem, 
  updateNavbarItem, 
  deleteNavbarItem, 
  initializeNavbarDatabase
} from '@/lib/navbarPrisma';
import { 
  successResponse, 
  errorResponse, 
  requireAuth, 
  validateRequest,
  validateQuery,
  withErrorHandling 
} from '@/lib/api-utils';
import { 
  createNavbarItemSchema, 
  updateNavbarItemSchema, 
  deleteNavbarItemSchema,
  getNavbarQuerySchema 
} from '@/schemas/navbar';
import { ApiError, ApiErrorCode } from '@/types/api';

// GET - Get navbar items
export const GET = withErrorHandling(async (request: NextRequest) => {
  await initializeNavbarDatabase();
  
  const validatedQuery = await validateQuery(getNavbarQuerySchema, request.url);
  const isPublic = validatedQuery.type === 'public';
  
  const items = await getNavbarItems(isPublic);
  
  return successResponse({
    data: items,
    pagination: {
      page: validatedQuery.page,
      limit: validatedQuery.limit,
      total: items.length,
      totalPages: Math.ceil(items.length / validatedQuery.limit),
      hasNextPage: validatedQuery.page < Math.ceil(items.length / validatedQuery.limit),
      hasPreviousPage: validatedQuery.page > 1
    }
  });
});

// POST - Add new navbar item
export const POST = withErrorHandling(async (request: NextRequest) => {
  await requireAuth();
  
  const body = await request.json();
  const validatedData = await validateRequest(createNavbarItemSchema, body);
  
  const newItem = await addNavbarItem(validatedData);
  
  return successResponse(newItem, 201);
});

// PUT - Update navbar item
export const PUT = withErrorHandling(async (request: NextRequest) => {
  await requireAuth();
  
  const body = await request.json();
  const validatedData = await validateRequest(updateNavbarItemSchema, body);
  
  const { id, ...updateData } = validatedData;
  
  try {
    const updatedItem = await updateNavbarItem(id, updateData);
    return successResponse(updatedItem);
  } catch (error: any) {
    if (error.code === 'P2025') {
      throw new ApiError(404, ApiErrorCode.NOT_FOUND, 'Navbar item not found');
    }
    throw error;
  }
});

// DELETE - Delete navbar item
export const DELETE = withErrorHandling(async (request: NextRequest) => {
  await requireAuth();
  
  const { searchParams } = new URL(request.url);
  const idParam = searchParams.get('id');
  
  if (!idParam) {
    throw new ApiError(400, ApiErrorCode.BAD_REQUEST, 'ID parameter is required');
  }
  
  const id = parseInt(idParam);
  if (isNaN(id)) {
    throw new ApiError(400, ApiErrorCode.BAD_REQUEST, 'ID must be a valid number');
  }
  
  const validatedData = await validateRequest(deleteNavbarItemSchema, { id });
  
  try {
    const deletedItem = await deleteNavbarItem(validatedData.id);
    return successResponse(deletedItem);
  } catch (error: any) {
    if (error.code === 'P2025') {
      throw new ApiError(404, ApiErrorCode.NOT_FOUND, 'Navbar item not found');
    }
    throw error;
  }
});
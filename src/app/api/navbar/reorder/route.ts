import { NextRequest } from 'next/server';
import { reorderNavbarItems } from '@/lib/navbarDatabase';
import { 
  successResponse, 
  requireAuth, 
  validateRequest,
  withErrorHandling 
} from '@/lib/api-utils';
import { reorderNavbarItemsSchema } from '@/schemas/navbar';

// PUT - Reorder navbar items
export const PUT = withErrorHandling(async (request: NextRequest) => {
  await requireAuth();
  
  const body = await request.json();
  const validatedData = await validateRequest(reorderNavbarItemsSchema, body);
  
  await reorderNavbarItems(validatedData.items);
  
  return successResponse({ 
    success: true,
    message: 'Navbar items reordered successfully'
  });
});
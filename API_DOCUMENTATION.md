# API Documentation

## Overview

This project now uses a professional API structure with:
- **Consistent Response Format**: All APIs return standardized JSON responses
- **Request Validation**: Using Zod schemas for type-safe validation
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Authentication**: Middleware for protected endpoints
- **Type Safety**: Full TypeScript support with inferred types

## API Response Format

### Success Response
```typescript
{
  success: true,
  data: any,          // The actual response data
  message?: string,   // Optional success message
  statusCode: number  // HTTP status code
}
```

### Error Response
```typescript
{
  success: false,
  error: string,      // Error message
  statusCode: number, // HTTP status code
  details?: any       // Optional error details (validation errors, etc.)
}
```

### Paginated Response
```typescript
{
  success: true,
  data: any[],
  pagination: {
    page: number,
    limit: number,
    total: number,
    totalPages: number,
    hasNextPage: boolean,
    hasPreviousPage: boolean
  },
  statusCode: number
}
```

## Error Codes

- `400` - Bad Request (validation errors, missing parameters)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource not found)
- `409` - Conflict (duplicate data)
- `500` - Internal Server Error

## Authentication

All protected endpoints require authentication via NextAuth session. The API will automatically check for valid session and return 401 if unauthorized.

## API Endpoints

### Navbar API (`/api/navbar`)

#### GET - Fetch navbar items
```
GET /api/navbar?type=public&page=1&limit=10
```

**Query Parameters:**
- `type` (optional): `public` | `dashboard` - Filter by navbar type
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Response:**
```typescript
{
  success: true,
  data: {
    data: NavbarItem[],
    pagination: PaginationMeta
  },
  statusCode: 200
}
```

#### POST - Create navbar item
```
POST /api/navbar
Content-Type: application/json
```

**Request Body:**
```typescript
{
  name: string,         // Required, 1-100 characters
  href: string,         // Required, valid URL or path starting with /
  order?: number,       // Optional, default: 0
  isActive?: boolean,   // Optional, default: true
  isPublic?: boolean,   // Optional, default: false
  icon?: string,        // Optional
  section?: string      // Optional
}
```

#### PUT - Update navbar item
```
PUT /api/navbar
Content-Type: application/json
```

**Request Body:**
```typescript
{
  id: number,           // Required, positive integer
  name?: string,        // Optional, 1-100 characters
  href?: string,        // Optional, valid URL or path
  order?: number,       // Optional
  isActive?: boolean,   // Optional
  isPublic?: boolean,   // Optional
  icon?: string,        // Optional
  section?: string      // Optional
}
```

#### DELETE - Delete navbar item
```
DELETE /api/navbar?id=123
```

**Query Parameters:**
- `id` (required): Navbar item ID (positive integer)

#### PUT - Reorder navbar items
```
PUT /api/navbar/reorder
Content-Type: application/json
```

**Request Body:**
```typescript
{
  items: Array<{
    id: number,      // Navbar item ID
    order: number    // New order position
  }>
}
```

### Users API (`/api/users`)

#### GET - Fetch users
```
GET /api/users?page=1&limit=10&role=admin&search=john&sortBy=created_at&sortOrder=DESC
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `role` (optional): `admin` | `user` | `editor` - Filter by role
- `search` (optional): Search term for name/email
- `sortBy` (optional): `created_at` | `updated_at` | `name` | `email` | `role` (default: created_at)
- `sortOrder` (optional): `ASC` | `DESC` (default: DESC)

#### POST - Create user
```
POST /api/users
Content-Type: application/json
```

**Request Body:**
```typescript
{
  email: string,      // Required, valid email
  name?: string,      // Optional, 1-100 characters
  role?: string       // Optional, default: 'user'
}
```

#### PUT - Update user
```
PUT /api/users
Content-Type: application/json
```

**Request Body:**
```typescript
{
  id: number,         // Required, positive integer
  name?: string,      // Optional, 1-100 characters
  role?: string,      // Optional: 'admin' | 'user' | 'editor'
  is_active?: boolean // Optional
}
```

#### DELETE - Delete user
```
DELETE /api/users
Content-Type: application/json
```

**Request Body:**
```typescript
{
  id: number         // Required, positive integer
}
```

## Validation Schemas

All requests are validated using Zod schemas located in `/src/schemas/`:

- `navbar.ts` - Navbar-related validation schemas
- `users.ts` - User-related validation schemas

## Error Handling

The API uses centralized error handling with the `withErrorHandling` wrapper. Common errors:

### Validation Errors (400)
```typescript
{
  success: false,
  error: "Validation failed",
  statusCode: 400,
  details: [
    {
      "code": "too_small",
      "minimum": 1,
      "type": "string",
      "inclusive": true,
      "exact": false,
      "message": "Name is required",
      "path": ["name"]
    }
  ]
}
```

### Authentication Errors (401)
```typescript
{
  success: false,
  error: "Authentication required",
  statusCode: 401
}
```

### Not Found Errors (404)
```typescript
{
  success: false,
  error: "Navbar item not found",
  statusCode: 404
}
```

## Development Guidelines

### Creating New API Routes

1. **Define Validation Schema** (`/src/schemas/[resource].ts`):
```typescript
import { z } from 'zod';

export const createItemSchema = z.object({
  name: z.string().min(1),
  // ... other fields
});

export type CreateItem = z.infer<typeof createItemSchema>;
```

2. **Create API Route** (`/src/app/api/[resource]/route.ts`):
```typescript
import { NextRequest } from 'next/server';
import { 
  successResponse, 
  requireAuth, 
  validateRequest,
  withErrorHandling 
} from '@/lib/api-utils';
import { createItemSchema } from '@/schemas/items';

export const POST = withErrorHandling(async (request: NextRequest) => {
  await requireAuth(); // If authentication required
  
  const body = await request.json();
  const validatedData = await validateRequest(createItemSchema, body);
  
  // Your business logic here
  const result = await createItem(validatedData);
  
  return successResponse(result, 201);
});
```

3. **Handle Errors**:
```typescript
import { ApiError, ApiErrorCode } from '@/types/api';

// Throw specific errors
throw new ApiError(404, ApiErrorCode.NOT_FOUND, 'Item not found');

// Handle database errors
try {
  const result = await updateItem(id, data);
  return successResponse(result);
} catch (error: any) {
  if (error.code === 'P2025') { // Prisma not found error
    throw new ApiError(404, ApiErrorCode.NOT_FOUND, 'Item not found');
  }
  throw error; // Re-throw unknown errors
}
```

## Utilities

### API Utils (`/src/lib/api-utils.ts`)

- `successResponse(data, statusCode?, message?)` - Create success response
- `errorResponse(error, statusCode?)` - Create error response
- `requireAuth()` - Check authentication
- `validateRequest(schema, data)` - Validate request body
- `validateQuery(schema, url)` - Validate query parameters
- `withErrorHandling(handler)` - Wrap route handler with error handling

### Types (`/src/types/api.ts`)

- `ApiResponse<T>` - Standard API response interface
- `PaginatedResponse<T>` - Paginated response interface
- `ApiError` - Custom error class
- `ApiErrorCode` - Error code enum

## Examples

### Frontend Usage

```typescript
// Fetch navbar items
const response = await fetch('/api/navbar?type=public');
const data = await response.json();

if (data.success) {
  console.log('Navbar items:', data.data.data);
  console.log('Pagination:', data.data.pagination);
} else {
  console.error('Error:', data.error);
}

// Create new navbar item
const response = await fetch('/api/navbar', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'New Item',
    href: '/new-item',
    isPublic: true
  })
});

const data = await response.json();
if (data.success) {
  console.log('Created:', data.data);
} else {
  console.error('Error:', data.error);
  if (data.details) {
    console.log('Validation errors:', data.details);
  }
}
```
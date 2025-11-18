import { z } from 'zod';

// Schema for getting users with query parameters
export const getUsersQuerySchema = z.object({
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(10),
  role: z.enum(['admin', 'user', 'editor']).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['created_at', 'updated_at', 'name', 'email', 'role']).optional().default('created_at'),
  sortOrder: z.enum(['ASC', 'DESC']).optional().default('DESC'),
});

// Schema for creating a new user
export const createUserSchema = z.object({
  email: z.string().email('Must be a valid email address'),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters').optional(),
  role: z.enum(['admin', 'user', 'editor']).optional().default('user'),
});

// Schema for updating a user
export const updateUserSchema = z.object({
  id: z.number().int().positive('User ID must be a positive integer'),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters').optional(),
  role: z.enum(['admin', 'user', 'editor']).optional(),
  is_active: z.boolean().optional(),
});

// Schema for deleting a user
export const deleteUserSchema = z.object({
  id: z.number().int().positive('User ID must be a positive integer'),
});

// Types derived from schemas
export type GetUsersQuery = z.infer<typeof getUsersQuerySchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type DeleteUser = z.infer<typeof deleteUserSchema>;
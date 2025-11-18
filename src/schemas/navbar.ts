import { z } from 'zod';

// Schema for creating a new navbar item
export const createNavbarItemSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  href: z.string().min(1, 'URL is required').url('Must be a valid URL or path').or(z.string().startsWith('/', 'Must be a valid path')),
  order: z.number().int().min(0).optional().default(0),
  isActive: z.boolean().optional().default(true),
  isPublic: z.boolean().optional().default(false),
  icon: z.string().optional(),
  section: z.string().optional(),
});

// Schema for updating a navbar item
export const updateNavbarItemSchema = z.object({
  id: z.number().int().positive('ID must be a positive integer'),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters').optional(),
  href: z.string().min(1, 'URL is required').url('Must be a valid URL or path').or(z.string().startsWith('/', 'Must be a valid path')).optional(),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  icon: z.string().optional(),
  section: z.string().optional(),
});

// Schema for deleting a navbar item
export const deleteNavbarItemSchema = z.object({
  id: z.number().int().positive('ID must be a positive integer'),
});

// Schema for GET query parameters
export const getNavbarQuerySchema = z.object({
  type: z.enum(['public', 'dashboard']).optional(),
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(10),
});

// Schema for reordering navbar items
export const reorderNavbarItemsSchema = z.object({
  items: z.array(z.object({
    id: z.number().int().positive(),
    order: z.number().int().min(0)
  })).min(1, 'At least one item is required'),
});

// Types derived from schemas
export type CreateNavbarItem = z.infer<typeof createNavbarItemSchema>;
export type UpdateNavbarItem = z.infer<typeof updateNavbarItemSchema>;
export type DeleteNavbarItem = z.infer<typeof deleteNavbarItemSchema>;
export type GetNavbarQuery = z.infer<typeof getNavbarQuerySchema>;
export type ReorderNavbarItems = z.infer<typeof reorderNavbarItemsSchema>;
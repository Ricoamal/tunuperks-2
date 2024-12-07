import { z } from 'zod';

export const productValidation = {
  createProduct: z.object({
    body: z.object({
      name: z.string().min(2, 'Name must be at least 2 characters'),
      description: z.string().min(10, 'Description must be at least 10 characters'),
      price: z.number().min(0, 'Price cannot be negative'),
      image: z.string().url('Invalid image URL'),
      category: z.string(),
      stock: z.number().min(0, 'Stock cannot be negative'),
    }),
  }),

  updateProduct: z.object({
    body: z.object({
      name: z.string().min(2).optional(),
      description: z.string().min(10).optional(),
      price: z.number().min(0).optional(),
      image: z.string().url().optional(),
      category: z.string().optional(),
      stock: z.number().min(0).optional(),
    }),
  }),
};
import { z } from 'zod';

export const orderValidation = {
  createOrder: z.object({
    body: z.object({
      items: z.array(
        z.object({
          product: z.string(),
          quantity: z.number().min(1),
          price: z.number().min(0),
        })
      ),
      totalAmount: z.number().min(0),
      shippingAddress: z.object({
        street: z.string(),
        city: z.string(),
        state: z.string(),
        zipCode: z.string(),
        country: z.string(),
      }),
      paymentMethod: z.enum(['stripe', 'mpesa', 'giftpesa']),
    }),
  }),

  processPayment: z.object({
    body: z.object({
      paymentMethod: z.enum(['stripe', 'mpesa', 'giftpesa']),
    }),
  }),
};
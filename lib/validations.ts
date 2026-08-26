import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters long.",
  }),
  email: z.string().email({
    message: "Invalid email address format.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long.",
  }),
});

export const loginSchema = z.object({
  email: z.string().email({
    message: "Invalid email address format.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

export const categorySchema = z.object({
  name: z.string().min(2, {
    message: "Category name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  imageUrl: z
    .string()
    .url({
      message: "Image URL must be a valid URL.",
    })
    .optional()
    .or(z.literal("")),
});

export const productSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  description: z.string().min(5, {
    message: "Description must be at least 5 characters.",
  }),
  price: z.number().positive({
    message: "Price must be greater than zero.",
  }),
  stock: z.number().int().min(0, {
    message: "Stock cannot be negative.",
  }),
  imageUrl: z.string().url({
    message: "Image URL must be a valid URL.",
  }),
  categoryId: z.string().min(1, {
    message: "Category is required.",
  }),
});

export const cartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
});

export const checkoutSchema = z.object({
  shippingAddress: z.string().min(10, {
    message: "Shipping address must be detailed (min 10 characters).",
  }),

  phone: z.string().min(10, {
    message: "Valid phone number is required.",
  }),

  paymentMethod: z.enum([
    "COD",
    "BKASH",
    "NAGAD",
    "ROCKET",
  ]),

  paymentNumber: z.string().optional(),

  transactionId: z.string().optional(),

  items: z
    .array(cartItemSchema)
    .min(1, {
      message: "Cart cannot be empty.",
    }),
});

export const orderStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ]),
});

export const paymentStatusSchema = z.object({
  paymentStatus: z.enum([
    "PENDING",
    "VERIFIED",
    "REJECTED",
  ]),
});

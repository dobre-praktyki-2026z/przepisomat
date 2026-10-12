import { z } from 'zod'

export const recipeInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(80, 'Keep it under 80 characters'),
  description: z
    .string()
    .trim()
    .min(1, 'Description is required')
    .max(300, 'Keep it under 300 characters'),
  image: z.string().trim().max(10_000_000).default(''),
  ingredients: z
    .array(z.string().trim().min(1))
    .min(1, 'Add at least one ingredient'),
  steps: z.array(z.string().trim().min(1)).min(1, 'Add at least one step'),
  prepTime: z.coerce
    .number()
    .int('Whole minutes only')
    .positive('Must be positive')
    .max(600, 'Too long'),
  servings: z.coerce
    .number()
    .int('Whole servings only')
    .positive('Must be positive')
    .max(50, 'Too many'),
  favorite: z.boolean().default(false),
})

export const recipePatchSchema = recipeInputSchema.partial()

export type RecipeInputPayload = z.infer<typeof recipeInputSchema>

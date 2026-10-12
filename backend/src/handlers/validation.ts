import type { z } from 'zod'
import type { RecipeInput } from '../types.ts'
import { HttpError } from '../utility/httpError.ts'
import { recipeInputSchema, recipePatchSchema } from './schemas.ts'

function badRequest(error: z.ZodError): HttpError {
  const message = error.issues.map((issue) => issue.message).join(', ')
  return new HttpError(400, message, error.issues)
}

export function validateRecipeInput(body: unknown): RecipeInput {
  const parsed = recipeInputSchema.safeParse(body)
  if (!parsed.success) {
    throw badRequest(parsed.error)
  }
  return parsed.data
}

export function validateRecipePatch(body: unknown): Partial<RecipeInput> {
  const parsed = recipePatchSchema.safeParse(body)
  if (!parsed.success) {
    throw badRequest(parsed.error)
  }
  return parsed.data
}

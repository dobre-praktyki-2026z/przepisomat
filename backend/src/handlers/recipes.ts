import * as repo from '../database/recipes.ts'
import type { Recipe, RecipeInput } from '../types.ts'
import { HttpError } from '../utility/httpError.ts'

export function listRecipes(): Recipe[] {
  return repo.listRecipes()
}

export function getRecipe(id: string): Recipe {
  const recipe = repo.getRecipe(id)
  if (!recipe) {
    throw new HttpError(404, 'Recipe not found')
  }
  return recipe
}

export function createRecipe(input: RecipeInput): Recipe {
  return repo.createRecipe(input)
}

export function updateRecipe(id: string, input: RecipeInput): Recipe {
  const recipe = repo.updateRecipe(id, input)
  if (!recipe) {
    throw new HttpError(404, 'Recipe not found')
  }
  return recipe
}

export function patchRecipe(id: string, patch: Partial<RecipeInput>): Recipe {
  const recipe = repo.patchRecipe(id, patch)
  if (!recipe) {
    throw new HttpError(404, 'Recipe not found')
  }
  return recipe
}

export function deleteRecipe(id: string): void {
  if (!repo.deleteRecipe(id)) {
    throw new HttpError(404, 'Recipe not found')
  }
}

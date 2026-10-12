import { db, rowToRecipe } from './db.ts'
import type { Recipe, RecipeInput, RecipeRow } from './types.ts'

const COLUMNS =
  'id, title, description, image, ingredients, steps, prep_time, servings, favorite, created_at, updated_at'

export function listRecipes(): Recipe[] {
  const rows = db
    .prepare(`SELECT ${COLUMNS} FROM recipes ORDER BY created_at DESC`)
    .all() as unknown as RecipeRow[]
  return rows.map(rowToRecipe)
}

export function getRecipe(id: string): Recipe | null {
  const row = db
    .prepare(`SELECT ${COLUMNS} FROM recipes WHERE id = ?`)
    .get(id) as unknown as RecipeRow | undefined
  return row ? rowToRecipe(row) : null
}

function write(recipe: Recipe): void {
  db.prepare(
    `INSERT INTO recipes (${COLUMNS}) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    recipe.id,
    recipe.title,
    recipe.description,
    recipe.image,
    JSON.stringify(recipe.ingredients),
    JSON.stringify(recipe.steps),
    recipe.prepTime,
    recipe.servings,
    recipe.favorite ? 1 : 0,
    recipe.createdAt,
    recipe.updatedAt,
  )
}

export function createRecipe(input: RecipeInput): Recipe {
  const now = new Date().toISOString()
  const recipe: Recipe = {
    id: crypto.randomUUID(),
    ...input,
    createdAt: now,
    updatedAt: now,
  }
  write(recipe)
  return recipe
}

export function updateRecipe(id: string, input: RecipeInput): Recipe | null {
  const existing = getRecipe(id)
  if (!existing) {
    return null
  }

  const recipe: Recipe = {
    ...existing,
    ...input,
    id: existing.id,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  }

  db.prepare(
    `UPDATE recipes SET
      title = ?, description = ?, image = ?, ingredients = ?, steps = ?,
      prep_time = ?, servings = ?, favorite = ?, updated_at = ?
    WHERE id = ?`,
  ).run(
    recipe.title,
    recipe.description,
    recipe.image,
    JSON.stringify(recipe.ingredients),
    JSON.stringify(recipe.steps),
    recipe.prepTime,
    recipe.servings,
    recipe.favorite ? 1 : 0,
    recipe.updatedAt,
    id,
  )

  return getRecipe(id)
}

export function patchRecipe(
  id: string,
  patch: Partial<RecipeInput>,
): Recipe | null {
  const existing = getRecipe(id)
  if (!existing) {
    return null
  }

  return updateRecipe(id, {
    title: patch.title ?? existing.title,
    description: patch.description ?? existing.description,
    image: patch.image ?? existing.image,
    ingredients: patch.ingredients ?? existing.ingredients,
    steps: patch.steps ?? existing.steps,
    prepTime: patch.prepTime ?? existing.prepTime,
    servings: patch.servings ?? existing.servings,
    favorite: patch.favorite ?? existing.favorite,
  })
}

export function deleteRecipe(id: string): boolean {
  const result = db.prepare('DELETE FROM recipes WHERE id = ?').run(id)
  return result.changes > 0
}

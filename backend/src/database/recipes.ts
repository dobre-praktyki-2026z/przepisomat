import { randomUUID } from 'node:crypto'
import type { Recipe, RecipeInput } from '../types.ts'
import { db } from './connection.ts'

interface RecipeRow {
  id: string
  title: string
  description: string
  image: string
  ingredients: string
  steps: string
  prep_time: number
  servings: number
  favorite: number
  created_at: string
  updated_at: string
}

const COLUMNS =
  'id, title, description, image, ingredients, steps, prep_time, servings, favorite, created_at, updated_at'

function rowToRecipe(row: RecipeRow): Recipe {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    image: row.image,
    ingredients: JSON.parse(row.ingredients) as string[],
    steps: JSON.parse(row.steps) as string[],
    prepTime: row.prep_time,
    servings: row.servings,
    favorite: row.favorite === 1,
  }
}

function insert(recipe: Recipe, createdAt: string, updatedAt: string): void {
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
    createdAt,
    updatedAt,
  )
}

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

export function createRecipe(input: RecipeInput): Recipe {
  const now = new Date().toISOString()
  const recipe: Recipe = { id: randomUUID(), ...input }
  insert(recipe, now, now)
  return recipe
}

export function updateRecipe(id: string, input: RecipeInput): Recipe | null {
  if (!getRecipe(id)) {
    return null
  }

  db.prepare(
    `UPDATE recipes SET
      title = ?, description = ?, image = ?, ingredients = ?, steps = ?,
      prep_time = ?, servings = ?, favorite = ?, updated_at = ?
    WHERE id = ?`,
  ).run(
    input.title,
    input.description,
    input.image,
    JSON.stringify(input.ingredients),
    JSON.stringify(input.steps),
    input.prepTime,
    input.servings,
    input.favorite ? 1 : 0,
    new Date().toISOString(),
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

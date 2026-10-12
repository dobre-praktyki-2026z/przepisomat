import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { seedRecipes } from './seed.ts'
import type { Recipe, RecipeInput, RecipeRow } from './types.ts'

const DB_PATH =
  process.env.DATABASE_PATH ?? resolve(process.cwd(), 'data/recipes.db')

mkdirSync(dirname(DB_PATH), { recursive: true })

export const db = new DatabaseSync(DB_PATH)

db.exec(`
  CREATE TABLE IF NOT EXISTS recipes (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL DEFAULT '',
    ingredients TEXT NOT NULL DEFAULT '[]',
    steps TEXT NOT NULL DEFAULT '[]',
    prep_time INTEGER NOT NULL,
    servings INTEGER NOT NULL,
    favorite INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`)

export function rowToRecipe(row: RecipeRow): Recipe {
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
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function insertMany(recipes: RecipeInput[]): void {
  const insert = db.prepare(`
    INSERT INTO recipes
      (id, title, description, image, ingredients, steps, prep_time, servings, favorite, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  const now = new Date().toISOString()

  for (const recipe of recipes) {
    insert.run(
      crypto.randomUUID(),
      recipe.title,
      recipe.description,
      recipe.image,
      JSON.stringify(recipe.ingredients),
      JSON.stringify(recipe.steps),
      recipe.prepTime,
      recipe.servings,
      recipe.favorite ? 1 : 0,
      now,
      now,
    )
  }
}

export function seedIfEmpty(): void {
  const row = db.prepare('SELECT COUNT(*) AS count FROM recipes').get() as {
    count: number
  }
  if (row.count === 0) {
    insertMany(seedRecipes)
  }
}

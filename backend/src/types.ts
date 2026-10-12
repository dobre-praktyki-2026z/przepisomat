export interface Recipe {
  id: string
  title: string
  description: string
  image: string
  ingredients: string[]
  steps: string[]
  prepTime: number
  servings: number
  favorite: boolean
  createdAt: string
  updatedAt: string
}

export interface RecipeRow {
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

export interface RecipeInput {
  title: string
  description: string
  image: string
  ingredients: string[]
  steps: string[]
  prepTime: number
  servings: number
  favorite: boolean
}

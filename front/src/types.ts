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
}

export type RecipeInput = Omit<Recipe, 'id'>

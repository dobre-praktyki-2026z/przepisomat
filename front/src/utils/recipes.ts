import type { Recipe } from '../types'

export const PAGE_SIZE_OPTIONS = [3, 6, 9, 12]
export const DEFAULT_PAGE_SIZE = 6

export type SortOption = 'recent' | 'title' | 'time'

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'recent', label: 'Newest' },
    { value: 'title', label: 'Title' },
    { value: 'time', label: 'Prep time' },
]

export interface RecipeFilters {
    search: string
    favoritesOnly: boolean
    favorites: string[]
    sort: SortOption
}

export function filterRecipes(
    recipes: Recipe[],
    filters: RecipeFilters,
): Recipe[] {
    const query = filters.search.trim().toLowerCase()

    const matches = recipes.filter((recipe) => {
        if (filters.favoritesOnly && !filters.favorites.includes(recipe.id)) {
            return false
        }
        if (!query) {
            return true
        }
        return (
            recipe.title.toLowerCase().includes(query) ||
            recipe.description.toLowerCase().includes(query) ||
            recipe.ingredients.some((item) => item.toLowerCase().includes(query))
        )
    })

    return sortRecipes(matches, filters.sort, recipes)
}

function sortRecipes(
    list: Recipe[],
    sort: SortOption,
    original: Recipe[],
): Recipe[] {
    return [...list].sort((a, b) => {
        if (sort === 'title') {
            return a.title.localeCompare(b.title)
        }
        if (sort === 'time') {
            return a.prepTime - b.prepTime
        }
        return original.indexOf(b) - original.indexOf(a)
    })
}

export interface Paginated<T> {
    items: T[]
    pageCount: number
    currentPage: number
}

export function paginate<T>(
    items: T[],
    page: number,
    pageSize: number,
): Paginated<T> {
    const pageCount = Math.max(1, Math.ceil(items.length / pageSize))
    const currentPage = Math.min(page, pageCount)
    const start = (currentPage - 1) * pageSize

    return {
        items: items.slice(start, start + pageSize),
        pageCount,
        currentPage,
    }
}
